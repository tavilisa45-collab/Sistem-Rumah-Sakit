import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { generateNomorPermintaan } from '@/app/lib/auth';

const prisma = new PrismaClient();

export async function createHasilLab(request: NextRequest) {
  try {
    const body = await request.json();
    const { permintaanId, pasienId, petugasInput, hasil, kesimpulan } = body;

    const nomorHasil = `HAS${Date.now()}`;

    const hasilLab = await prisma.hasilLab.create({
      data: {
        nomorHasil,
        permintaanId,
        pasienId,
        petugasInput,
        hasil: JSON.stringify(hasil),
        kesimpulan,
      },
    });

    await prisma.permintaanLab.update({
      where: { id: permintaanId },
      data: { statusPermintaan: 'SELESAI' },
    });

    return NextResponse.json({
      message: 'Hasil lab berhasil disimpan',
      data: hasilLab,
    });
  } catch (error) {
    console.error('Create hasil lab error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
