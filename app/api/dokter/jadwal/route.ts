import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const userRole = request.headers.get('x-user-role');

    if (userRole !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Tidak memiliki izin' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { dokterID, hari, jamMulai, jamSelesai, poliklinik } = body;

    if (!dokterID || !hari || !jamMulai || !jamSelesai || !poliklinik) {
      return NextResponse.json(
        { error: 'Semua field harus diisi' },
        { status: 400 }
      );
    }

    const existingJadwal = await prisma.jadwalDokter.findFirst({
      where: {
        dokterID,
        hari,
        OR: [
          {
            AND: [
              { jamMulai: { lte: jamMulai } },
              { jamSelesai: { gt: jamMulai } },
            ],
          },
          {
            AND: [
              { jamMulai: { lt: jamSelesai } },
              { jamSelesai: { gte: jamSelesai } },
            ],
          },
          {
            AND: [
              { jamMulai: { gte: jamMulai } },
              { jamSelesai: { lte: jamSelesai } },
            ],
          },
        ],
      },
    });

    if (existingJadwal) {
      return NextResponse.json(
        { error: 'Jadwal bentrok dengan jadwal yang sudah ada' },
        { status: 400 }
      );
    }

    const jadwal = await prisma.jadwalDokter.create({
      data: {
        dokterID,
        hari,
        jamMulai,
        jamSelesai,
        poliklinik,
      },
      include: {
        dokter: {
          include: {
            user: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: 'Jadwal dokter berhasil ditambahkan',
        data: jadwal,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create jadwal dokter error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dokterID = searchParams.get('dokterID');
    const hari = searchParams.get('hari');

    const where: any = {};
    if (dokterID) where.dokterID = dokterID;
    if (hari) where.hari = hari;

    const jadwalList = await prisma.jadwalDokter.findMany({
      where,
      include: {
        dokter: {
          include: {
            user: true,
          },
        },
      },
      orderBy: [{ hari: 'asc' }, { jamMulai: 'asc' }],
    });

    return NextResponse.json({
      data: jadwalList,
    });
  } catch (error) {
    console.error('Get jadwal dokter error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
