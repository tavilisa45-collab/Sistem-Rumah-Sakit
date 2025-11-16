import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getPasienById(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const pasien = await prisma.pasien.findUnique({
      where: { id: params.id },
      include: {
        kunjungan: {
          orderBy: { tanggalKunjungan: 'desc' },
          take: 10,
        },
        resep: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        rawatInap: {
          orderBy: { tanggalMasuk: 'desc' },
          take: 5,
        },
      },
    });

    if (!pasien) {
      return NextResponse.json(
        { error: 'Pasien tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json(pasien);
  } catch (error) {
    console.error('Get pasien by id error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

// PUT - Update pasien
export async function updatePasien(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get('x-user-id');
    const body = await request.json();

    const pasien = await prisma.pasien.update({
      where: { id: params.id },
      data: body,
    });

    // Audit trail
    await prisma.auditTrail.create({
      data: {
        userId: userId || '',
        action: 'UPDATE_PASIEN',
        modul: 'PASIEN',
      },
    });

    return NextResponse.json({
      message: 'Pasien berhasil diupdate',
      data: pasien,
    });
  } catch (error) {
    console.error('Update pasien error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

// DELETE - Hapus pasien (soft delete)
export async function deletePasien(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userRole = request.headers.get('x-user-role');
    const userId = request.headers.get('x-user-id');

    if (userRole !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Hanya admin yang bisa menghapus pasien' },
        { status: 403 }
      );
    }

    // Cek apakah pasien memiliki referensi
    const kunjungan = await prisma.kunjungan.count({
      where: { pasienId: params.id },
    });

    if (kunjungan > 0) {
      return NextResponse.json(
        {
          error: 'Tidak bisa menghapus pasien yang memiliki riwayat kunjungan',
        },
        { status: 400 }
      );
    }

    await prisma.pasien.delete({
      where: { id: params.id },
    });

    // Audit trail
    await prisma.auditTrail.create({
      data: {
        userId: userId || '',
        action: 'DELETE_PASIEN',
        modul: 'PASIEN',
      },
    });

    return NextResponse.json({
      message: 'Pasien berhasil dihapus',
    });
  } catch (error) {
    console.error('Delete pasien error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
