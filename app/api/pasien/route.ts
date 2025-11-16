import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { generateNomorRekamMedis } from '@/app/lib/auth';

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
            { nomorRekamMedis: { contains: search } },
            { nik: { contains: search } },
            { noHP: { contains: search } },
          ],
        }
      : {};

    const [pasien, total] = await Promise.all([
      prisma.pasien.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.pasien.count({ where }),
    ]);

    return NextResponse.json({
      data: pasien,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get pasien error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

// POST - Buat pasien baru
export async function POST(request: NextRequest) {
  try {
    const userRole = request.headers.get('x-user-role');
    const userId = request.headers.get('x-user-id');

    // Hanya admin dan resepsionis yang bisa tambah pasien
    if (!['ADMIN', 'RESEPSIONIS'].includes(userRole || '')) {
      return NextResponse.json(
        { error: 'Tidak memiliki izin' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      nama,
      nik,
      jenisIdentitas,
      noIdentitas,
      tempatLahir,
      tanggalLahir,
      gender,
      agama,
      pekerjaan,
      noHP,
      email,
      alamat,
      kelurahan,
      kecamatan,
      kabupaten,
      provinsi,
      kodePOS,
    } = body;

    // Validasi field required
    if (!nama || !nik || !jenisIdentitas || !noIdentitas || !tanggalLahir) {
      return NextResponse.json(
        { error: 'Data yang diperlukan tidak lengkap' },
        { status: 400 }
      );
    }

    // Cek nik sudah terdaftar
    const existingPasien = await prisma.pasien.findUnique({
      where: { nik },
    });

    if (existingPasien) {
      return NextResponse.json(
        { error: 'Pasien dengan NIK ini sudah terdaftar' },
        { status: 400 }
      );
    }

    const nomorRekamMedis = generateNomorRekamMedis(Date.now());

    const pasien = await prisma.pasien.create({
      data: {
        nomorRekamMedis,
        nama,
        nik,
        jenisIdentitas,
        noIdentitas,
        tempatLahir,
        tanggalLahir: new Date(tanggalLahir),
        gender,
        agama,
        pekerjaan,
        noHP,
        email,
        alamat,
        kelurahan,
        kecamatan,
        kabupaten,
        provinsi,
        kodePOS,
      },
    });

    // Audit trail
    await prisma.auditTrail.create({
      data: {
        userId: userId || '',
        action: 'CREATE_PASIEN',
        modul: 'PASIEN',
      },
    });

    return NextResponse.json({
      message: 'Pasien berhasil ditambahkan',
      data: pasien,
    });
  } catch (error) {
    console.error('Create pasien error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
