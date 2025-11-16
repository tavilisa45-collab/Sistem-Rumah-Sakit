import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { nama: { contains: search } },
            { kodeObat: { contains: search } },
          ],
        }
      : {};

    const [obat, total] = await Promise.all([
      prisma.obat.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.obat.count({ where }),
    ]);

    return NextResponse.json({
      data: obat,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get obat error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userRole = request.headers.get('x-user-role');
    const userId = request.headers.get('x-user-id');

    if (!['ADMIN', 'FARMASI'].includes(userRole || '')) {
      return NextResponse.json(
        { error: 'Tidak memiliki izin' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      nama,
      jenis,
      satuan,
      harga,
      stokMinimal,
      namaPabrik,
      nomorBatch,
      tanggalKadaluarsa,
    } = body;

    if (!nama || !jenis || !satuan || harga === undefined) {
      return NextResponse.json(
        { error: 'Data yang diperlukan tidak lengkap' },
        { status: 400 }
      );
    }

    const kodeObat = `OBT${Date.now()}`;

    const obat = await prisma.obat.create({
      data: {
        kodeObat,
        nama,
        jenis,
        satuan,
        harga,
        stokSekarang: 0,
        stokMinimal: stokMinimal || 10,
        namaPabrik,
        nomorBatch,
        tanggalKadaluarsa: tanggalKadaluarsa
          ? new Date(tanggalKadaluarsa)
          : null,
      },
    });

    await prisma.auditTrail.create({
      data: {
        userId: userId || '',
        action: 'CREATE_OBAT',
        modul: 'FARMASI',
      },
    });

    return NextResponse.json({
      message: 'Obat berhasil ditambahkan',
      data: obat,
    });
  } catch (error) {
    console.error('Create obat error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
