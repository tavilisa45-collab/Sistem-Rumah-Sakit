import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { generateNomorPermintaan } from '@/app/lib/auth';

const prisma = new PrismaClient();

export async function getBarangList(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const kategori = searchParams.get('kategori');

    const where = kategori ? { kategori } : {};

    const barang = await prisma.barang.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(barang);
  } catch (error) {
    console.error('Get barang error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

export async function createBarang(request: NextRequest) {
  try {
    const userRole = request.headers.get('x-user-role');

    if (!['ADMIN', 'LOGISTIK'].includes(userRole || '')) {
      return NextResponse.json(
        { error: 'Tidak memiliki izin' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { nama, kategori, satuan, harga, stokMinimal, supplier } = body;

    const kodeBarang = `BRG${Date.now()}`;

    const barang = await prisma.barang.create({
      data: {
        kodeBarang,
        nama,
        kategori,
        satuan,
        harga,
        stokSekarang: 0,
        stokMinimal: stokMinimal || 5,
        supplier,
      },
    });

    return NextResponse.json({
      message: 'Barang berhasil ditambahkan',
      data: barang,
    });
  } catch (error) {
    console.error('Create barang error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
