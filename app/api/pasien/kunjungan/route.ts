import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function createKunjungan(request: NextRequest) {
  try {
    const body = await request.json();
    const { pasienId, keluhan, tipeKunjungan, diagnosis, terapi, dokterDinas } =
      body;

    const kunjungan = await prisma.kunjungan.create({
      data: {
        pasienId,
        keluhan,
        tipeKunjungan,
        diagnosis,
        terapi,
        dokterDinas,
      },
    });

    return NextResponse.json({
      message: 'Kunjungan berhasil dicatat',
      data: kunjungan,
    });
  } catch (error) {
    console.error('Create kunjungan error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

export async function getKunjunganByPasien(
  request: NextRequest,
  { params }: { params: { pasienId: string } }
) {
  try {
    const kunjungan = await prisma.kunjungan.findMany({
      where: { pasienId: params.pasienId },
      orderBy: { tanggalKunjungan: 'desc' },
    });

    return NextResponse.json(kunjungan);
  } catch (error) {
    console.error('Get kunjungan error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
