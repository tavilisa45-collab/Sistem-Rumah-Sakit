import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '@/app/lib/auth';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, nama, role } = body;

    if (!email || !password || !nama) {
      return NextResponse.json(
        { error: 'Email, password, dan nama harus diisi' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Format email tidak valid' },
        { status: 400 }
      );
    }
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password minimal 6 karakter' },
        { status: 400 }
      );
    }
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email sudah terdaftar di sistem' },
        { status: 400 }
      );
    }
    const hashedPassword = await hashPassword(password);

    let userRole = 'RESEPSIONIS';
    if (
      [
        'ADMIN',
        'DOKTER',
        'FARMASI',
        'LAB',
        'RADIOLOGI',
        'RAWAT_INAP',
        'LOGISTIK',
        'PERAWAT',
      ].includes(role)
    ) {
      userRole = 'RESEPSIONIS';
    }

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        nama: nama.trim(),
        role: userRole,
        isActive: true,
      },
    });

    await prisma.auditTrail.create({
      data: {
        userId: user.id,
        action: 'REGISTER',
        modul: 'AUTH',
      },
    });

    return NextResponse.json(
      {
        message: 'Registrasi berhasil. Silakan login dengan akun Anda.',
        user: {
          id: user.id,
          email: user.email,
          nama: user.nama,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
