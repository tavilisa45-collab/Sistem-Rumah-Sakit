import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    const userId = request.headers.get('x-user-id');

    if (userId) {
      await prisma.auditTrail.create({
        data: {
          userId,
          action: 'LOGOUT',
          modul: 'AUTH',
        },
      });
    }

    const response = NextResponse.json({
      message: 'Logout berhasil',
    });

    response.cookies.set({
      name: 'token',
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
