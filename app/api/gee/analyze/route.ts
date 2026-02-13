import { NextRequest, NextResponse } from 'next/server';
import { getGEE } from '@/lib/gee/client';

export async function POST(req: NextRequest) {
  try {
    const ee = await getGEE();
    const body = await req.json();
    const { lat, lng } = body;

    const aoi = ee.Geometry.Point([lng, lat]).buffer(2000).bounds();
    const s2 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
      .filterBounds(aoi)
      .filterDate('2024-01-01', '2024-12-31')
      .median();

    const ndvi = s2.normalizedDifference(['B8', 'B4']);
    const sugarCane = ndvi.updateMask(ndvi.gt(0.4));

    const mapId = await new Promise((resolve, reject) => {
      sugarCane.getMap({ palette: ['white', 'green'] }, (res: any, err: any) => {
        if (err) reject(err);
        else resolve(res);
      });
    });

    return NextResponse.json({ tileUrl: (mapId as any).urlFormat });
  } catch (error: any) {
    // Pesan ini akan dikirim ke Frontend agar kamu tahu persis apa yang salah
    return NextResponse.json({ 
      error: error.message || error.toString(),
      details: "Cek terminal VS Code untuk log lengkap"
    }, { status: 500 });
  }
}