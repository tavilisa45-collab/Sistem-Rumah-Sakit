import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function getResepList(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const skip = (page - 1) * limit;

    const [resep, total] = await Promise.all([
      prisma.resep.findMany({
        skip,
        take: limit,
        include: {
          pasien: true,
          obat: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.resep.count(),
    ]);

    return NextResponse.json({
      data: resep,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get resep error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

export async function createResep(request: NextRequest) {
  try {
    const userRole = request.headers.get('x-user-role');
    const userId = request.headers.get('x-user-id');

    if (!['ADMIN', 'DOKTER', 'FARMASI'].includes(userRole || '')) {
      return NextResponse.json(
        { error: 'Tidak memiliki izin' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { pasienId, dokterDinas, obatList, catatanResep } = body;

    if (!pasienId || !dokterDinas || !obatList || obatList.length === 0) {
      return NextResponse.json(
        { error: 'Data yang diperlukan tidak lengkap' },
        { status: 400 }
      );
    }

    const { generateNomorResep } = await import('@/app/lib/auth');
    const nomorResep = generateNomorResep();

    const resep = await prisma.resep.create({
      data: {
        nomorResep,
        pasienId,
        dokterDinas,
        catatanResep,
        obat: {
          createMany: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data: obatList.map((item: any) => ({
              obatId: item.obatId,
              jumlah: item.jumlah,
              aturan: item.aturan,
            })),
          },
        },
      },
    });

    for (const item of obatList) {
      await prisma.obat.update({
        where: { id: item.obatId },
        data: {
          stokSekarang: {
            decrement: item.jumlah,
          },
        },
      });

      await prisma.logStokObat.create({
        data: {
          obatId: item.obatId,
          tipe: 'KELUAR',
          jumlah: item.jumlah,
          keterangan: `Resep ${nomorResep}`,
        },
      });
    }

    await prisma.auditTrail.create({
      data: {
        userId: userId || '',
        action: 'CREATE_RESEP',
        modul: 'FARMASI',
      },
    });

    return NextResponse.json({
      message: 'Resep berhasil dibuat',
      data: resep,
    });
  } catch (error) {
    console.error('Create resep error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
