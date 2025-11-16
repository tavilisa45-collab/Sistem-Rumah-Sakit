'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Resep {
  id: string;
  nomorResep: string;
  pasien: { nama: string; nomorRekamMedis: string };
  dokterDinas: string;
  statusResep: string;
  tanggalResep: string;
}

export default function ResepPage() {
  const [resepList, setResepList] = useState<Resep[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResep();
  }, []);

  const fetchResep = async () => {
    try {
      const response = await fetch('/api/farmasi/resep');
      if (response.ok) {
        const data = await response.json();
        setResepList(data.data);
      }
    } catch (error) {
      console.error('Error fetching resep:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      SELESAI: 'bg-green-100 text-green-800',
      BATAL: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Daftar Resep</h1>
          <p className="text-gray-600 mt-1">Kelola resep pasien</p>
        </div>
        <Link
          href="/dashboard/farmasi/resep/buat"
          className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
        >
          + Buat Resep Baru
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : resepList.length === 0 ? (
          <div className="text-center py-12 text-gray-600">Belum ada resep</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    No. Resep
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Pasien
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    No. RM
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Dokter
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Tanggal
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
                {resepList.map((resep) => (
                  <tr
                    key={resep.id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 font-medium text-primary-600">
                      {resep.nomorResep}
                    </td>
                    <td className="px-6 py-4">{resep.pasien.nama}</td>
                    <td className="px-6 py-4">
                      {resep.pasien.nomorRekamMedis}
                    </td>
                    <td className="px-6 py-4">{resep.dokterDinas}</td>
                    <td className="px-6 py-4">
                      {new Date(resep.tanggalResep).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          resep.statusResep
                        )}`}
                      >
                        {resep.statusResep}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <Link
                        href={`/dashboard/farmasi/resep/${resep.id}`}
                        className="text-primary-600 hover:underline"
                      >
                        Lihat
                      </Link>
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
