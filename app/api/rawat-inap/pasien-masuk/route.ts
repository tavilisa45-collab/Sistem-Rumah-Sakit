import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { generateNomorPermintaan } from '@/app/lib/auth';

const prisma = new PrismaClient();

export async function createRawatInapMasuk(request: NextRequest) {
  try {
    const body = await request.json();
    const { pasienId, kamarId, diagnosaAwal } = body;

    if (!pasienId || !kamarId || !diagnosaAwal) {
      return NextResponse.json(
        { error: 'Data yang diperlukan tidak lengkap' },
        { status: 400 }
      );
    }

    const rawatInap = await prisma.rawatInap.create({
      data: {
        pasienId,
        kamarId,
        diagnosaAwal,
      },
    });

    await prisma.kamar.update({
      where: { id: kamarId },
      data: {
        terisiSekarang: {
          increment: 1,
        },
        status: 'TERISI',
      },
    });

    return NextResponse.json({
      message: 'Pasien berhasil masuk rawat inap',
      data: rawatInap,
    });
  } catch (error) {
    console.error('Create rawat inap masuk error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
