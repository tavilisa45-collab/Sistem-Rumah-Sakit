import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper function untuk format tipe kunjungan
function formatTipeKunjungan(tipe: string): string {
  const mapping: { [key: string]: string } = {
    RAWAT_JALAN: 'Rawat Jalan',
    RAWAT_INAP: 'Rawat Inap',
    IGD: 'IGD',
    KONTROL: 'Kontrol',
    KONSULTASI: 'Konsultasi',
  };
  return mapping[tipe] || tipe.replace(/_/g, ' ');
}

export async function GET(request: NextRequest) {
  try {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const totalPasien = await prisma.pasien.count();

    const startOfMonth = new Date(currentYear, currentMonth - 1, 1);
    const endOfMonth = new Date(currentYear, currentMonth, 0);

    const totalKunjunganBulanIni = await prisma.kunjungan.count({
      where: {
        tanggalKunjungan: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });

    const totalObatMenipis = await prisma.obat.count({
      where: {
        stokSekarang: {
          lte: prisma.obat.fields.stokMinimal,
        },
      },
    });

    const totalKamarTerisi = await prisma.rawatInap.count({
      where: {
        statusRawatInap: 'MASUK',
      },
    });

    const kunjunganPerBulan = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = date.getMonth() + 1;
      const year = date.getFullYear();

      const count = await prisma.kunjungan.count({
        where: {
          tanggalKunjungan: {
            gte: new Date(year, month - 1, 1),
            lte: new Date(year, month, 0),
          },
        },
      });

      kunjunganPerBulan.push({
        bulan: date.toLocaleDateString('id-ID', { month: 'short' }),
        total: count,
      });
    }

    const jenisKunjungan = await prisma.kunjungan.groupBy({
      by: ['tipeKunjungan'],
      _count: true,
    });

    const jenisKunjunganFormatted = jenisKunjungan.map((item) => ({
      name: formatTipeKunjungan(item.tipeKunjungan),
      value: item._count,
    }));

    const stokObat = await prisma.obat.findMany({
      take: 5,
      orderBy: { stokSekarang: 'desc' },
      select: {
        nama: true,
        stokSekarang: true,
      },
    });

    const stokObatFormatted = stokObat.map((item) => ({
      nama: item.nama,
      stok: item.stokSekarang,
    }));

    return NextResponse.json({
      totalPasien,
      totalKunjunganBulanIni,
      totalObatMenipis,
      totalKamarTerisi,
      kunjunganPerBulan,
      jenisKunjungan: jenisKunjunganFormatted,
      stokObat: stokObatFormatted,
    });
  } catch (error) {
    console.error('Get statistik error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
