import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  // 1. Ambil sesi user
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 2. Unwrapping params
    const resolvedParams = await params;
    const historyId = resolvedParams.id;

    // 3. Mencari data
    const history = await prisma.history.findUnique({
      where: { id: historyId },
      include: { user: true } 
    });

    // 4. PERBAIKAN: Validasi kepemilikan data dengan Optional Chaining (?.)
    // Kita cek apakah history ada, dan apakah email user-nya sama dengan sesi saat ini
    // history.user?.email tidak akan crash meskipun user-nya null
    if (!history || history.user?.email !== session.user.email) {
      return NextResponse.json({ error: "Data tidak ditemukan atau akses ditolak" }, { status: 404 });
    }

    return NextResponse.json(history);
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}