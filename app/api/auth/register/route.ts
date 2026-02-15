import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    // 1. Validasi input
    if (!email || !password) {
      return NextResponse.json({ message: "Email dan password wajib diisi" }, { status: 400 });
    }

    // 2. Cek apakah user sudah ada
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ message: "Email sudah terdaftar" }, { status: 409 });
    }

    // 3. Hash password (Standar keamanan TI)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Simpan ke Supabase via Prisma v7
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    return NextResponse.json({ message: "User berhasil dibuat", userId: newUser.id }, { status: 201 });
  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json({ message: "Terjadi kesalahan server" }, { status: 500 });
  }
}