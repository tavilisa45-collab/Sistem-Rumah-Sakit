'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          router.push('/dashboard');
        }
      } catch (error) {
      } finally {
        setChecking(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Login gagal');
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-primary-600 to-primary-800 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          <p className="text-white mt-4">Memproses...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen relative flex items-center justify-center px-4"
      style={{
        backgroundImage: `url('/bg.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="absolute inset-0 bg-white opacity-40 backdrop-blur-md"></div>
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-block bg-white p-3 rounded-full mb-4">
            <svg
              className="w-24 h-24 primary-text"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3.5 22L1.25192 18.6279C1.08766 18.3815 1 18.092 1 17.7958V13.25C1 12.5596 1.55964 12 2.25 12C2.94036 12 3.5 12.5596 3.5 13.25V16.0211C3.5 16.1162 3.52712 16.2093 3.57817 16.2895L3.79872 16.6361M5.44444 19.2222L3.79872 16.6361M8.22222 21.9999V19.4235C8.22222 18.93 8.07612 18.4474 7.80234 18.0368L6.79337 16.5233C6.34922 15.8571 5.46013 15.6572 4.77355 16.0691L3.79872 16.6361M20.7223 22L22.782 18.6088C22.9246 18.3741 23 18.1048 23 17.8301V13.2499C23 12.5596 22.4404 12 21.7501 12C21.0598 12 20.5001 12.5596 20.5001 13.2499V16.0211C20.5001 16.1162 20.473 16.2093 20.422 16.2895L20.4166 16.298M18.5557 19.2222L20.4166 16.298M16 22V19.0903C16 18.5967 16.1461 18.1142 16.4199 17.7035L17.4289 16.1901C17.873 15.5238 18.7621 15.3239 19.4487 15.7359L20.4166 16.298M12.9999 2C13.5521 2 13.9999 2.44772 13.9999 3V5.90014C13.9999 5.95536 14.0446 6.00013 14.0999 6.00013L17 6.00014C17.5523 6.00014 18 6.44785 18 7.00014V9.00013C18 9.55242 17.5523 10.0001 17 10.0001H14.0999C14.0446 10.0001 13.9999 10.0449 13.9999 10.1001V13C13.9999 13.5523 13.5521 14 12.9999 14H10.9999C10.4476 14 9.99985 13.5523 9.99985 13V10.1001C9.99985 10.0449 9.95508 10.0001 9.89985 10.0001H7.00005C6.44776 10.0001 6.00005 9.55242 6.00005 9.00013V7.00013C6.00005 6.44785 6.44776 6.00013 7.00005 6.00013L9.89985 6.00013C9.95508 6.00013 9.99985 5.95536 9.99985 5.90014V3C9.99985 2.44771 10.4476 2 10.9999 2H12.9999Z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold primary-text">
            Sistem Informasi Medis
          </h1>
          <p className="primary-text mt-2">Manajemen Data Rumah Sakit</p>
        </div>
        <div className="bg-white rounded-lg shadow-xl p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Masuk ke Sistem
          </h2>

          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                {error}
              </div>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contoh@rumahsakit.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-600 hover:text-gray-800 transition"
                  disabled={loading}
                >
                  {showPassword ? (
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path
                        fillRule="evenodd"
                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-14-14zM10 3c-3.332 0-6.263 2.15-7.542 5.232A11.979 11.979 0 001.144 9.93m16.58-1.127A11.98 11.98 0 0019.892 9.87m-2.35 1.97C17.732 14.057 13.942 17 9.5 17S1.268 14.057 0 10c1.732-4.057 5.522-7 9.5-7s8.268 2.943 9.542 7zM10 10a2 2 0 11-4 0 2 2 0 014 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white font-medium py-2 rounded-lg hover:bg-primary-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sedang memproses...
                </>
              ) : (
                'Masuk'
              )}
            </button>
          </form>
          {/* 
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center mb-3 font-medium">
              Akun Demo (Untuk Testing):
            </p>
            <div className="bg-gray-50 p-4 rounded text-sm space-y-2">
              <div className="border-l-2 border-primary-600 pl-3">
                <p className="font-medium text-gray-800">Admin</p>
                <p className="text-gray-600">admin@rs.com / admin123</p>
              </div>
              <div className="border-l-2 border-green-600 pl-3">
                <p className="font-medium text-gray-800">Dokter</p>
                <p className="text-gray-600">dokter@rs.com / dokter123</p>
              </div>
              <div className="border-l-2 border-yellow-600 pl-3">
                <p className="font-medium text-gray-800">Farmasi</p>
                <p className="text-gray-600">farmasi@rs.com / farmasi123</p>
              </div>
              <div className="border-l-2 border-purple-600 pl-3">
                <p className="font-medium text-gray-800">Laboratorium</p>
                <p className="text-gray-600">lab@rs.com / lab123</p>
              </div>
              <div className="border-l-2 border-red-600 pl-3">
                <p className="font-medium text-gray-800">Rawat Inap</p>
                <p className="text-gray-600">rawatinap@rs.com / rawatinap123</p>
              </div>
            </div>
          </div> */}

          {/* <div className="mt-4 p-3 bg-primary-50 border border-primary-200 rounded text-xs text-primary-700">
            <p className="font-medium mb-1">Tips:</p>
            <p>
              Gunakan salah satu akun demo di atas untuk testing aplikasi. Fitur
              berbeda untuk setiap role.
            </p>
          </div> */}
        </div>

        <div className="text-center primary-text text-sm">
          <p>&copy; 2025 Sistem Informasi Medis </p>
          <p className="mt-1">
            Rumah Sakit Hermawati. All Rights Reserved by Hermawati
          </p>
        </div>
      </div>
    </div>
  );
}
