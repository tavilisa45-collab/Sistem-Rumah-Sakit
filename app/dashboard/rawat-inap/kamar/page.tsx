'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Kamar {
  id: string;
  nomorKamar: string;
  tipeKamar: string;
  kapasitas: number;
  terisiSekarang: number;
  hargaPerHari: number;
  status: string;
  fasilitas: string;
}

export default function KamarPage() {
  const [kamarList, setKamarList] = useState<Kamar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKamar();
  }, []);

  const fetchKamar = async () => {
    try {
      const response = await fetch('/api/rawat-inap/kamar');
      if (response.ok) {
        const data = await response.json();
        setKamarList(data);
      }
    } catch (error) {
      console.error('Error fetching kamar:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      KOSONG: 'bg-green-100 text-green-800',
      TERISI: 'bg-red-100 text-red-800',
      PERBAIKAN: 'bg-yellow-100 text-yellow-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getTipeKamarBadgeColor = (tipe: string) => {
    const colors: { [key: string]: string } = {
      KELAS_1: 'bg-purple-100 text-purple-800',
      KELAS_2: 'bg-primary-100 text-primary-800',
      KELAS_3: 'bg-indigo-100 text-indigo-800',
    };
    return colors[tipe] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Manajemen Kamar</h1>
          <p className="text-gray-600 mt-1">Total kamar: {kamarList.length}</p>
        </div>
        <Link
          href="/dashboard/rawat-inap/kamar/tambah"
          className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
        >
          + Tambah Kamar
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <p className="text-gray-600 text-sm">Total Kamar</p>
          <p className="text-2xl font-bold text-gray-800">{kamarList.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <p className="text-gray-600 text-sm">Kosong</p>
          <p className="text-2xl font-bold text-green-600">
            {kamarList.filter((k) => k.status === 'KOSONG').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <p className="text-gray-600 text-sm">Terisi</p>
          <p className="text-2xl font-bold text-red-600">
            {kamarList.filter((k) => k.status === 'TERISI').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <p className="text-gray-600 text-sm">Perbaikan</p>
          <p className="text-2xl font-bold text-yellow-600">
            {kamarList.filter((k) => k.status === 'PERBAIKAN').length}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    No. Kamar
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Tipe
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Kapasitas
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Terisi
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Harga/Hari
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Fasilitas
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {kamarList.map((kamar) => (
                  <tr
                    key={kamar.id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 font-bold text-primary-600">
                      {kamar.nomorKamar}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${getTipeKamarBadgeColor(
                          kamar.tipeKamar
                        )}`}
                      >
                        {kamar.tipeKamar}
                      </span>
                    </td>
                    <td className="px-6 py-4">{kamar.kapasitas}</td>
                    <td className="px-6 py-4">
                      <span className="font-medium">
                        {kamar.terisiSekarang}/{kamar.kapasitas}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      Rp {kamar.hargaPerHari.toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {kamar.fasilitas || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          kamar.status
                        )}`}
                      >
                        {kamar.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {kamar.status === 'KOSONG' && (
                        <Link
                          href={`/dashboard/rawat-inap/pasien/masuk?kamarId=${kamar.id}`}
                          className="text-primary-600 hover:underline"
                        >
                          Masukkan Pasien
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
