import { NextRequest, NextResponse } from 'next/server';
import { getGEE } from '@/lib/gee/client';

export async function POST(req: NextRequest) {
  try {
    const ee = await getGEE();
    const { lat, lng, startDate, endDate } = await req.json();

    const today = new Date().toISOString().split('T')[0];
    const end = endDate > today ? today : (endDate || today);
    const start = startDate || '2025-01-01';

    const aoi = ee.Geometry.Point([parseFloat(lng), parseFloat(lat)]).buffer(2500).bounds();

    const maskCloud = (image: any) => {
      const qa = image.select('QA60');
      const mask = qa.bitwiseAnd(1 << 10).eq(0).and(qa.bitwiseAnd(1 << 11).eq(0));
      return image.updateMask(mask).divide(10000);
    };

    // --- FUNGSI HELPER UNTUK ANALISIS ---
    const analyzeDateRange = async (dStart: string, dEnd: string) => {
      const collection = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
        .filterBounds(aoi)
        .filterDate(dStart, dEnd)
        .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 40))
        .map(maskCloud);

      const dataset = collection.median();
      const ndvi = dataset.normalizedDifference(['B8', 'B4']).clip(aoi);

      const tertanamMask = ndvi.gt(0.45);
      const areaTertanamImg = tertanamMask.multiply(ee.Image.pixelArea());
      const kosongMask = ndvi.lt(0.2);
      const areaKosongImg = kosongMask.multiply(ee.Image.pixelArea());

      const getArea = (img: any) => {
        return img.reduceRegion({
          reducer: ee.Reducer.sum(),
          geometry: aoi,
          scale: 10,
          maxPixels: 1e8
        });
      };

      const stats = await Promise.all([
        new Promise((res) => getArea(areaTertanamImg).evaluate((r: any) => res((r && r.nd ? r.nd : 0) / 10000))),
        new Promise((res) => getArea(areaKosongImg).evaluate((r: any) => res((r && r.nd ? r.nd : 0) / 10000)))
      ]);

      return { tertanam: stats[0] as number, kosong: stats[1] as number, ndvi, collectionSize: collection.size() };
    };

    // --- EKSEKUSI ANALISIS DUA PERIODE ---
    // Analisis 1: Periode "Baru" (Untuk Peta & Statistik Utama)
    const resultNew = await analyzeDateRange(start, end);

    // Cek jika data periode baru kosong
    const countNew = await new Promise((res) => resultNew.collectionSize.evaluate((s: any) => res(s)));
    if (countNew === 0) {
      return NextResponse.json({ error: "Data satelit terbaru tidak ditemukan.", noData: true }, { status: 404 });
    }

    // Analisis 2: Periode "Lama" (Hanya untuk perbandingan grafik)
    // Kita buat range 3 bulan ke belakang dari startDate sebagai perbandingan baseline
    const baseStart = new Date(startDate);
    baseStart.setMonth(baseStart.getMonth() - 3);
    const resultOld = await analyzeDateRange(baseStart.toISOString().split('T')[0], startDate);

    // --- PREPARASI DATA VIZ & RESPONS ---
    const vizParams = {
      min: 0, max: 0.8,
      palette: ['#FFFFFF', '#CE7E45', '#FCD163', '#66A000', '#207401', '#056201']
    };

    const mapId = await new Promise((resolve, reject) => {
      resultNew.ndvi.getMap(vizParams, (res: any, err: any) => {
        if (err) reject(err); else resolve(res);
      });
    });

    return NextResponse.json({ 
      tileUrl: (mapId as any).urlFormat,
      areaTertanam: resultNew.tertanam.toFixed(2),
      areaKosong: resultNew.kosong.toFixed(2),
      // DATA UNTUK GRAFIK (Tanpa Database)
      chartData: [
        { name: 'Sebelumnya', tertanam: resultOld.tertanam, kosong: resultOld.kosong },
        { name: 'Saat Ini', tertanam: resultNew.tertanam, kosong: resultNew.kosong }
      ],
      info: `Membandingkan kondisi ${startDate} dengan ${end}`
    });

  } catch (error: any) {
    console.error("GEE API Error:", error);
    return NextResponse.json({ error: error.toString() }, { status: 500 });
  }
}