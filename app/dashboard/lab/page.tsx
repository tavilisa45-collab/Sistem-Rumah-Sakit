'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface PermintaanLab {
  id: string;
  nomorPermintaan: string;
  pasien: { nama: string; nomorRekamMedis: string };
  jenisPermintaan: string;
  tipePermeriksaan: string;
  statusPermintaan: string;
  prioritas: string;
  tanggalPermintaan: string;
}

export default function LabPage() {
  const [permintaanList, setPermintaanList] = useState<PermintaanLab[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPermintaan();
  }, []);

  const fetchPermintaan = async () => {
    try {
      const response = await fetch('/api/lab/permintaan');
      if (response.ok) {
        const data = await response.json();
        setPermintaanList(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching permintaan:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      PROSES: 'bg-primary-100 text-primary-800',
      SELESAI: 'bg-green-100 text-green-800',
      BATAL: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPrioritasColor = (prioritas: string) => {
    const colors: { [key: string]: string } = {
      NORMAL: 'bg-gray-100 text-gray-800',
      URGENT: 'bg-red-100 text-red-800',
    };
    return colors[prioritas] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Manajemen Laboratorium
          </h1>
          <p className="text-gray-600 mt-1">
            Kelola permintaan dan hasil pemeriksaan lab
          </p>
        </div>
        <Link
          href="/dashboard/lab/permintaan/buat"
          className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
        >
          + Buat Permintaan
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <p className="text-gray-600 text-sm">Total Permintaan</p>
          <p className="text-2xl font-bold text-gray-800">
            {permintaanList.length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <p className="text-gray-600 text-sm">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">
            {
              permintaanList.filter((p) => p.statusPermintaan === 'PENDING')
                .length
            }
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <p className="text-gray-600 text-sm">Proses</p>
          <p className="text-2xl font-bold text-primary-600">
            {
              permintaanList.filter((p) => p.statusPermintaan === 'PROSES')
                .length
            }
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <p className="text-gray-600 text-sm">Selesai</p>
          <p className="text-2xl font-bold text-green-600">
            {
              permintaanList.filter((p) => p.statusPermintaan === 'SELESAI')
                .length
            }
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : permintaanList.length === 0 ? (
          <div className="text-center py-12 text-gray-600">
            Belum ada permintaan
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    No. Permintaan
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Pasien
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Jenis
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Pemeriksaan
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Prioritas
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Tanggal
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {permintaanList.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 font-medium text-primary-600">
                      {item.nomorPermintaan}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium">{item.pasien?.nama}</p>
                      <p className="text-sm text-gray-500">
                        {item.pasien?.nomorRekamMedis}
                      </p>
                    </td>
                    <td className="px-6 py-4">{item.jenisPermintaan}</td>
                    <td className="px-6 py-4">{item.tipePermeriksaan}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${getPrioritasColor(
                          item.prioritas
                        )}`}
                      >
                        {item.prioritas}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          item.statusPermintaan
                        )}`}
                      >
                        {item.statusPermintaan}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {new Date(item.tanggalPermintaan).toLocaleDateString(
                        'id-ID'
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      {item.statusPermintaan === 'PENDING' && (
                        <Link
                          href={`/dashboard/lab/hasil/input/${item.id}`}
                          className="text-green-600 hover:underline"
                        >
                          Input Hasil
                        </Link>
                      )}
                      {item.statusPermintaan === 'SELESAI' && (
                        <Link
                          href={`/dashboard/lab/hasil/${item.id}`}
                          className="text-primary-600 hover:underline"
                        >
                          Lihat Hasil
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
