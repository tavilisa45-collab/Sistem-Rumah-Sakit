import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const dokterList = await prisma.dokter.findMany({
      include: {
        user: {
          select: {
            nama: true,
            email: true,
          },
        },
      },
      orderBy: {
        user: {
          nama: 'asc',
        },
      },
    });

    return NextResponse.json({
      data: dokterList,
    });
  } catch (error) {
    console.error('Get dokter error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
