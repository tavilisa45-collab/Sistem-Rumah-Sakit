'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface RawatInapData {
  totalPasienMasuk: number;
  totalKamarKosong: number;
  totalKamarTerisi: number;
  tingkatOccupancy: number;
}

export default function RawatInapPage() {
  const [stats, setStats] = useState<RawatInapData>({
    totalPasienMasuk: 0,
    totalKamarKosong: 0,
    totalKamarTerisi: 0,
    tingkatOccupancy: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setStats({
        totalPasienMasuk: 12,
        totalKamarKosong: 8,
        totalKamarTerisi: 12,
        tingkatOccupancy: 60,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Manajemen Rawat Inap
          </h1>
          <p className="text-gray-600 mt-1">
            Kelola kamar dan pasien rawat inap
          </p>
        </div>
        <div className="space-x-3">
          <Link
            href="/dashboard/rawat-inap/kamar"
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
          >
            Kamar
          </Link>
          <Link
            href="/dashboard/rawat-inap/pasien"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Pasien Masuk
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-primary-500">
          <p className="text-gray-600 text-sm">Pasien Masuk</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            {stats.totalPasienMasuk}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <p className="text-gray-600 text-sm">Kamar Kosong</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            {stats.totalKamarKosong}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
          <p className="text-gray-600 text-sm">Kamar Terisi</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            {stats.totalKamarTerisi}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
          <p className="text-gray-600 text-sm">Occupancy Rate</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            {stats.tingkatOccupancy}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Aksi Cepat</h3>
          <div className="space-y-2">
            <Link
              href="/dashboard/rawat-inap/pasien/masuk"
              className="block px-4 py-2 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition"
            >
              Pasien Masuk Kamar
            </Link>
            <Link
              href="/dashboard/rawat-inap/visite"
              className="block px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition"
            >
              Input Visite Dokter
            </Link>
            <Link
              href="/dashboard/rawat-inap/laporan"
              className="block px-4 py-2 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition"
            >
              Laporan BOR
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Informasi</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• BOR: Bed Occupancy Rate (%)= (Terisi / Total) x 100</p>
            <p>• Standar BOR optimal: 75-85%</p>
            <p>• Update status kamar secara real-time</p>
            <p>• Pantau pasien yang akan pulang</p>
          </div>
        </div>
      </div>
    </div>
  );
}
