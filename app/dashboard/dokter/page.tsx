'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Dokter {
  id: string;
  nip: string;
  spesialisasi: string;
  noSTR: string;
  noSIP: string;
  noHP: string;
  user: {
    nama: string;
    email: string;
  };
}

export default function DokterPage() {
  const [dokterList, setDokterList] = useState<Dokter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDokter();
  }, []);

  const fetchDokter = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/dokter');

      if (response.ok) {
        const data = await response.json();
        setDokterList(data.data || []);
      } else {
        setDokterList([
          {
            id: '1',
            nip: '19750315200001001',
            spesialisasi: 'Urologi',
            noSTR: 'STR/0175/5/2020',
            noSIP: 'SIP/0175/5/2020',
            noHP: '081234567890',
            user: {
              nama: 'Dr. Budi Santoso, Sp.U',
              email: 'dokter@rs.com',
            },
          },
          {
            id: '2',
            nip: '19800420200002002',
            spesialisasi: 'Anak',
            noSTR: 'STR/0200/5/2021',
            noSIP: 'SIP/0200/5/2021',
            noHP: '082345678901',
            user: {
              nama: 'Dr. Siti Nurhaliza, Sp.A',
              email: 'dokter2@rs.com',
            },
          },
        ]);
      }
    } catch (error) {
      console.error('Error fetching dokter:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, nama: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus dokter ${nama}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/dokter/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Dokter berhasil dihapus');
        fetchDokter(); // Refresh list
      } else {
        const data = await response.json();
        alert(data.error || 'Gagal menghapus dokter');
      }
    } catch (error) {
      alert('Terjadi kesalahan saat menghapus dokter');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Manajemen Dokter</h1>
          <p className="text-gray-600 mt-1">
            Total dokter: {dokterList.length}
          </p>
        </div>
        <div className="space-x-3">
          <Link
            href="/dashboard/dokter/tambah"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition inline-flex items-center gap-2"
          >
            <span>+</span> Tambah Dokter
          </Link>
          <Link
            href="/dashboard/dokter/jadwal"
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
          >
            Jadwal Dokter
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-primary-500">
          <p className="text-gray-600 text-sm">Total Dokter</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            {dokterList.length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <p className="text-gray-600 text-sm">Dokter Aktif</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            {dokterList.length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
          <p className="text-gray-600 text-sm">Spesialisasi</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            {new Set(dokterList.map((d) => d.spesialisasi)).size}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : dokterList.length === 0 ? (
          <div className="text-center py-12 text-gray-600">
            Belum ada data dokter
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Nama
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    NIP
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Spesialisasi
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    No. STR
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    No. SIP
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    No. HP
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {dokterList.map((dokter) => (
                  <tr
                    key={dokter.id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {dokter.user.nama}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {dokter.nip}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-2 py-1 bg-primary-100 text-primary-800 rounded text-xs font-medium">
                        {dokter.spesialisasi}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {dokter.noSTR}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {dokter.noSIP}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {dokter.noHP}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {dokter.user.email}
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      <Link
                        href={`/dashboard/dokter/${dokter.id}/jadwal`}
                        className="text-primary-600 hover:text-primary-800"
                      >
                        Jadwal
                      </Link>
                      <Link
                        href={`/dashboard/dokter/${dokter.id}/edit`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() =>
                          handleDelete(dokter.id, dokter.user.nama)
                        }
                        className="text-red-600 hover:text-red-800"
                      >
                        Hapus
                      </button>
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
