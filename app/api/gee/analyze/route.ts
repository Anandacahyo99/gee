import { NextRequest, NextResponse } from 'next/server';
import { getGEE } from '@/lib/gee/client';

export async function POST(req: NextRequest) {
  try {
    const ee = await getGEE();
    const { lat, lng } = await req.json();

    // Memastikan input koordinat berupa angka
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);

    const aoi = ee.Geometry.Point([lngNum, latNum]).buffer(5000).bounds();
    
    // 1. Cloud Masking & Normalisasi (Sangat Penting untuk S2_SR)
    const maskCloud = (image: any) => {
      const qa = image.select('QA60');
      const cloudBitMask = 1 << 10;
      const cirrusBitMask = 1 << 11;
      const mask = qa.bitwiseAnd(cloudBitMask).eq(0)
                  .and(qa.bitwiseAnd(cirrusBitMask).eq(0));
      
      // Sentinel-2 SR memiliki scale factor 10000
      return image.updateMask(mask).divide(10000);
    };

    const dataset = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
      .filterBounds(aoi)
      .filterDate('2024-01-01', '2024-12-31')
      .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20)) // Filter awal awan < 20%
      .map(maskCloud)
      .median();

    // Hitung NDVI
    const ndvi = dataset.normalizedDifference(['B8', 'B4']).clip(aoi);

    // 2. Skema Warna Dinamis
    const vizParams = {
      min: 0,
      max: 0.8, // Tebu sehat biasanya mencapai puncaknya di 0.8
      palette: ['#FFFFFF', '#CE7E45', '#FCD163', '#66A000', '#207401', '#056201']
    };

    // 3. Hitung Luas Lahan (Gunakan .evaluate() agar tidak blocking)
    const caneMask = ndvi.gt(0.4); 
    const areaImage = caneMask.multiply(ee.Image.pixelArea());
    
    const stats = areaImage.reduceRegion({
      reducer: ee.Reducer.sum(),
      geometry: aoi,
      scale: 10, // Resolusi Sentinel-2 adalah 10m
      maxPixels: 1e8
    });

    // Menggunakan Promise untuk mendapatkan info area secara asinkron
    const areaInHa = await new Promise<string>((resolve) => {
      stats.evaluate((result: any, error: any) => {
        if (error) {
          console.error("Area Calculation Error:", error);
          resolve("0.00");
        } else {
          const areaSqM = result.nd || 0;
          resolve((areaSqM / 10000).toFixed(2));
        }
      });
    });

    // Mendapatkan Map ID untuk Leaflet
    const mapId = await new Promise((resolve, reject) => {
      ndvi.getMap(vizParams, (res: any, err: any) => {
        if (err) reject(err); else resolve(res);
      });
    });

    return NextResponse.json({ 
      tileUrl: (mapId as any).urlFormat,
      area: areaInHa 
    });

  } catch (error: any) {
    console.error("GEE Route Error:", error);
    return NextResponse.json({ error: error.toString() }, { status: 500 });
  }
}