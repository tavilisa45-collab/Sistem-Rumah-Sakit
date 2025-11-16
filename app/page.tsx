'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          method: 'GET',
        });

        if (response.ok) {
          router.push('/dashboard');
        } else {
          router.push('/login');
        }
      } catch (error) {
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-primary-600 to-primary-800">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-white mb-6"></div>
        <h1 className="text-black text-2xl font-bold mb-2">
          Sistem Informasi Medis RS Hermawati Jl. Pemuda, Kec. Selaparang, Kota
          Mataram, Nusa Tenggara Bar.
        </h1>
        <p className="primary-text">Mohon tunggu, sedang mengalihkan...</p>
      </div>
    </div>
  );
}
