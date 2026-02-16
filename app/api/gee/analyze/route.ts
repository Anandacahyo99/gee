import { NextRequest, NextResponse } from 'next/server';
import { getGEE } from '@/lib/gee/client';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; 

export async function POST(req: NextRequest) {
  try {
    // 1. Ambil Sesi User (Opsional sekarang)
    const session = await getServerSession(authOptions);
    
    // Kita tidak lagi me-return 401 jika session kosong.
    // Kita hanya menyimpan email jika user memang login.
    const userEmail = session?.user?.email;

    const ee = await getGEE();
    const { lat, lng, startDate, endDate, locationName } = await req.json();

    const today = new Date().toISOString().split('T')[0];
    const end = endDate > today ? today : (endDate || today);
    const start = startDate || '2025-01-01';

    // Koordinat Point untuk GEE
    const aoi = ee.Geometry.Point([parseFloat(lng), parseFloat(lat)]).buffer(2500).bounds();

    const maskCloud = (image: any) => {
      const qa = image.select('QA60');
      const mask = qa.bitwiseAnd(1 << 10).eq(0).and(qa.bitwiseAnd(1 << 11).eq(0));
      return image.updateMask(mask).divide(10000);
    };

    const analyzeDateRange = async (dStart: string, dEnd: string) => {
      const collection = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
        .filterBounds(aoi)
        .filterDate(dStart, dEnd)
        .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 40))
        .map(maskCloud);

      const dataset = collection.median();
      const ndvi = dataset.normalizedDifference(['B8', 'B4']).clip(aoi);

      const meanNdvi = ndvi.reduceRegion({
        reducer: ee.Reducer.mean(),
        geometry: aoi,
        scale: 10,
        maxPixels: 1e8
      });

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

      const stats = await new Promise((res) => {
        const areaTertanam = getArea(areaTertanamImg);
        const areaKosong = getArea(areaKosongImg);
        
        ee.Dictionary({
          tertanam: areaTertanam.get('nd'),
          kosong: areaKosong.get('nd'),
          mean: meanNdvi.get('nd')
        }).evaluate((r: any) => {
          res([
            (r?.tertanam || 0) / 10000, 
            (r?.kosong || 0) / 10000,
            (r?.mean || 0)
          ]);
        });
      });

      const [tertanam, kosong, mean] = stats as number[];
      return { tertanam, kosong, mean, ndvi, collectionSize: collection.size() };
    };

    // Analisis Periode Baru
    const resultNew = await analyzeDateRange(start, end);

    const countNew = await new Promise((res) => resultNew.collectionSize.evaluate((s: any) => res(s)));
    if (countNew === 0) {
      return NextResponse.json({ error: "Data satelit terbaru tidak ditemukan.", noData: true }, { status: 404 });
    }

    // Analisis Periode Lama (Perbandingan)
    const baseStart = new Date(startDate);
    baseStart.setMonth(baseStart.getMonth() - 3);
    const resultOld = await analyzeDateRange(baseStart.toISOString().split('T')[0], startDate);

    const vizParams = {
      min: 0, max: 0.8,
      palette: ['#FFFFFF', '#CE7E45', '#FCD163', '#66A000', '#207401', '#056201']
    };

    const mapId = await new Promise((resolve, reject) => {
      resultNew.ndvi.getMap(vizParams, (res: any, err: any) => {
        if (err) reject(err); else resolve(res);
      });
    });

    // --- INTEGRASI PRISMA (MODIFIKASI) ---
    // Siapkan data object dasar
    const dbData: any = {
      locationName: locationName || `${lat}, ${lng}`,
      areaTertanam: parseFloat(resultNew.tertanam.toFixed(2)),
      areaKosong: parseFloat(resultNew.kosong.toFixed(2)),
      ndviAvg: parseFloat(resultNew.mean.toFixed(3)),
      startDate: start,
      endDate: end,
      tileUrl: (mapId as any).urlFormat,
      chartData: JSON.stringify([
        { name: 'Sebelumnya', tertanam: resultOld.tertanam, kosong: resultOld.kosong },
        { name: 'Saat Ini', tertanam: resultNew.tertanam, kosong: resultNew.kosong }
      ]),
    };

    // HANYA hubungkan ke User jika userEmail tersedia (sudah login)
    if (userEmail) {
      dbData.user = { connect: { email: userEmail } };
    }

    const historyEntry = await prisma.history.create({
      data: dbData
    });

    return NextResponse.json({ 
      id: historyEntry.id, 
      tileUrl: (mapId as any).urlFormat,
      areaTertanam: resultNew.tertanam.toFixed(2),
      areaKosong: resultNew.kosong.toFixed(2),
      chartData: [
        { name: 'Sebelumnya', tertanam: resultOld.tertanam, kosong: resultOld.kosong },
        { name: 'Saat Ini', tertanam: resultNew.tertanam, kosong: resultNew.kosong }
      ],
      info: `Analisis selesai. ${userEmail ? 'Tersimpan di akun Anda.' : 'Tersimpan sebagai Tamu.'}`
    });

  } catch (error: any) {
    console.error("GEE API Error:", error);
    return NextResponse.json({ error: error.toString() }, { status: 500 });
  }
}