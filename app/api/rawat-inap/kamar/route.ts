import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { generateNomorPermintaan } from '@/app/lib/auth';

const prisma = new PrismaClient();

export async function getKamarList(request: NextRequest) {
  try {
    const kamar = await prisma.kamar.findMany({
      orderBy: { nomorKamar: 'asc' },
    });

    return NextResponse.json(kamar);
  } catch (error) {
    console.error('Get kamar error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

export async function createKamar(request: NextRequest) {
  try {
    const userRole = request.headers.get('x-user-role');

    if (userRole !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Tidak memiliki izin' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { nomorKamar, tipeKamar, kapasitas, hargaPerHari, fasilitas } = body;

    const kamar = await prisma.kamar.create({
      data: {
        nomorKamar,
        tipeKamar,
        kapasitas,
        hargaPerHari,
        fasilitas,
      },
    });

    return NextResponse.json({
      message: 'Kamar berhasil ditambahkan',
      data: kamar,
    });
  } catch (error) {
    console.error('Create kamar error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
