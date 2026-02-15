import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  // 1. Ambil sesi user terlebih dahulu
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 2. PERBAIKAN: Unwrapping params yang bersifat Promise
    const resolvedParams = await params;
    const historyId = resolvedParams.id;

    // 3. Mencari data berdasarkan ID unik yang sudah di-await
    const history = await prisma.history.findUnique({
      where: { id: historyId },
      include: { user: true } 
    });

    // 4. Validasi kepemilikan data
    if (!history || history.user.email !== session.user.email) {
      return NextResponse.json({ error: "Data tidak ditemukan atau akses ditolak" }, { status: 404 });
    }

    return NextResponse.json(history);
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}