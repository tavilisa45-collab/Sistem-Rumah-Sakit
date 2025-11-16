import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { generateNomorPermintaan } from '@/app/lib/auth';

const prisma = new PrismaClient();

export async function createPermintaanBarang(request: NextRequest) {
  try {
    const body = await request.json();
    const { barangId, unitPeminta, jumlah, keperluan, prioritas } = body;

    const nomorPermintaan = generateNomorPermintaan('PRB');

    const permintaan = await prisma.permintaanBarang.create({
      data: {
        nomorPermintaan,
        barangId,
        unitPeminta,
        jumlah,
        keperluan,
        prioritas: prioritas || 'NORMAL',
      },
    });

    return NextResponse.json({
      message: 'Permintaan barang berhasil dibuat',
      data: permintaan,
    });
  } catch (error) {
    console.error('Create permintaan barang error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
