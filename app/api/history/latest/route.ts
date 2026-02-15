import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // WAJIB ADA

export async function GET() {
  // Masukkan authOptions agar session terbaca dengan benar
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const latestHistory = await prisma.history.findFirst({
      where: { 
        user: { email: session.user.email } 
      },
      orderBy: { createdAt: "desc" },
      select: { id: true }
    });

    if (!latestHistory) {
      return NextResponse.json({ id: null });
    }

    return NextResponse.json({ id: latestHistory.id });
  } catch (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}