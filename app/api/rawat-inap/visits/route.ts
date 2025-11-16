import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { generateNomorPermintaan } from '@/app/lib/auth';

const prisma = new PrismaClient();

export async function createVisiasi(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      rawatInapId,
      pasienId,
      dokterDinas,
      subjektif,
      objektif,
      asesment,
      planning,
    } = body;

    const visiasi = await prisma.visiasi.create({
      data: {
        rawatInapId,
        pasienId,
        dokterDinas,
        subjektif,
        objektif,
        asesment,
        planning,
      },
    });

    return NextResponse.json({
      message: 'Visite berhasil dicatat',
      data: visiasi,
    });
  } catch (error) {
    console.error('Create visiasi error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
