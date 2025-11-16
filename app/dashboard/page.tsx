'use client';

import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface Stats {
  totalPasien: number;
  totalKunjunganBulanIni: number;
  totalObatMenipis: number;
  totalKamarTerisi: number;
  kunjunganPerBulan: Array<{ bulan: string; total: number }>;
  jenisKunjungan: Array<{ name: string; value: number }>;
  stokObat: Array<{ nama: string; stok: number }>;
}

const COLORS = ['#1F2B6C', '#6d8fd4', '#10b981', '#f59e0b', '#8b5cf6'];

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalPasien: 0,
    totalKunjunganBulanIni: 0,
    totalObatMenipis: 0,
    totalKamarTerisi: 0,
    kunjunganPerBulan: [],
    jenisKunjungan: [],
    stokObat: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/dashboard/statistik');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full py-20">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="w-full space-y-6">
        <div className="relative bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl overflow-hidden shadow-2xl">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url('/cover.jpg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          ></div>

          <div className="relative grid md:grid-cols-2 gap-8 p-8 md:p-12">
            <div className="flex flex-col justify-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Sistem Informasi Rumah Sakit
              </h1>
              <p className="text-primary-100 text-lg mb-6">
                Pantau status rumah sakit Anda dalam satu dashboard terpadu
              </p>
            </div>

            {/* Right Side - SVG Chart */}
            <div className="flex items-center justify-center">
              <div className="relative w-full h-64 md:h-80 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <svg
                  className="w-32 h-32 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 w-full">
          <a
            href="/dashboard/pasien"
            className="flex-1 px-6 py-4 bg-white text-primary-600 rounded-lg hover:bg-gray-100 transition font-semibold text-center shadow-md hover:shadow-lg"
          >
            Kelola Pasien
          </a>
          <a
            href="/dashboard/laporan"
            className="flex-1 px-6 py-4 bg-primary-700 text-white border-2 border-primary-600 rounded-lg hover:bg-primary-600 transition font-semibold text-center shadow-md hover:shadow-lg"
          >
            Lihat Laporan
          </a>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-primary-300 hover:shadow-xl transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Pasien</p>
              <p className="text-3xl font-bold text-primary-600 mt-2">
                {stats.totalPasien}
              </p>
            </div>
            <div className="bg-primary-100 p-4 rounded-full">
              <svg
                className="w-8 h-8 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4">Data terakhir diupdate</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">
                Kunjungan Bulan Ini
              </p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {stats.totalKunjunganBulanIni}
              </p>
            </div>
            <div className="bg-green-100 p-4 rounded-full">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4">Termasuk semua jenis</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500 hover:shadow-xl transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Obat Menipis</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">
                {stats.totalObatMenipis}
              </p>
            </div>
            <div className="bg-yellow-100 p-4 rounded-full">
              <svg
                className="w-8 h-8 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4">Perlu pemesanan</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500 hover:shadow-xl transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Kamar Terisi</p>
              <p className="text-3xl font-bold text-red-600 mt-2">
                {stats.totalKamarTerisi}
              </p>
            </div>
            <div className="bg-red-100 p-4 rounded-full">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m0 0H9m5 0v-4m0 0h-4m4 0h4"
                />
              </svg>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4">Dari total kamar</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
          <h3 className="text-lg font-bold text-primary-900 mb-4 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-primary-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
              />
            </svg>
            Trend Kunjungan 6 Bulan Terakhir
          </h3>
          {stats.kunjunganPerBulan.length > 0 ? (
            <ResponsiveContainer
              width="100%"
              height={300}
            >
              <LineChart data={stats.kunjunganPerBulan}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e5e7eb"
                />
                <XAxis
                  dataKey="bulan"
                  stroke="#6b7280"
                />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#1F2B6C"
                  strokeWidth={3}
                  dot={{ fill: '#1F2B6C', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
              <p className="text-gray-500">Belum ada data</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
          <h3 className="text-lg font-bold text-primary-900 mb-4 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-primary-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
              />
            </svg>
            Distribusi Jenis Kunjungan
          </h3>
          {stats.jenisKunjungan.length > 0 ? (
            <ResponsiveContainer
              width="100%"
              height={300}
            >
              <PieChart>
                <Pie
                  data={stats.jenisKunjungan}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stats.jenisKunjungan.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
              <p className="text-gray-500">Belum ada data</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 lg:col-span-2 hover:shadow-xl transition">
          <h3 className="text-lg font-bold text-primary-900 mb-4 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-primary-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            Status Stok Obat Top 5
          </h3>
          {stats.stokObat.length > 0 ? (
            <ResponsiveContainer
              width="100%"
              height={300}
            >
              <BarChart data={stats.stokObat}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e5e7eb"
                />
                <XAxis
                  dataKey="nama"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  stroke="#6b7280"
                />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Bar
                  dataKey="stok"
                  fill="#1F2B6C"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
              <p className="text-gray-500">Belum ada data</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Access & Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
          <div className="flex items-center gap-3 mb-4">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <p className="font-bold text-lg">Akses Cepat</p>
          </div>
          <div className="space-y-3">
            <a
              href="/dashboard/pasien/tambah"
              className="block bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-3 rounded-lg transition"
            >
              + Tambah Pasien Baru
            </a>
            <a
              href="/dashboard/farmasi/resep"
              className="block bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-3 rounded-lg transition"
            >
              + Buat Resep
            </a>
            <a
              href="/dashboard/lab/permintaan"
              className="block bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-3 rounded-lg transition"
            >
              + Permintaan Lab
            </a>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition border-l-4 border-primary-600">
          <div className="flex items-center gap-3 mb-4">
            <svg
              className="w-6 h-6 text-primary-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-primary-900 font-bold text-lg">Informasi</p>
          </div>
          <div className="space-y-2 text-gray-700">
            <p className="text-sm flex items-center gap-2">
              <svg
                className="w-4 h-4 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>
                {new Date().toLocaleDateString('id-ID', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </p>
            <p className="text-sm flex items-center gap-2">
              <svg
                className="w-4 h-4 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{new Date().toLocaleTimeString('id-ID')}</span>
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition border-l-4 border-green-500">
          <div className="flex items-center gap-3 mb-4">
            <svg
              className="w-6 h-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <p className="text-primary-900 font-bold text-lg">Bantuan</p>
          </div>
          <p className="text-sm text-gray-700">
            Butuh bantuan? Hubungi IT Support atau baca dokumentasi sistem untuk
            panduan lengkap.
          </p>
          <button className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition text-sm font-medium w-full">
            Hubungi Support
          </button>
        </div>
      </div>
    </div>
  );
}
