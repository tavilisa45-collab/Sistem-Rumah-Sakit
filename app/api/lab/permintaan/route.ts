import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { generateNomorPermintaan } from '@/app/lib/auth';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      pasienId,
      dokterDinas,
      jenisPermintaan,
      tipePermeriksaan,
      indikasi,
      prioritas,
    } = body;

    const nomorPermintaan = generateNomorPermintaan('PLB');

    const permintaan = await prisma.permintaanLab.create({
      data: {
        nomorPermintaan,
        pasienId,
        dokterDinas,
        jenisPermintaan,
        tipePermeriksaan,
        indikasi,
        prioritas: prioritas || 'NORMAL',
      },
    });

    return NextResponse.json({
      message: 'Permintaan lab berhasil dibuat',
      data: permintaan,
    });
  } catch (error) {
    console.error('Create permintaan lab error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
