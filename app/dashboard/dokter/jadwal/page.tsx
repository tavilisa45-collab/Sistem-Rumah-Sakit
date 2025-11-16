'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface JadwalDokter {
  id: string;
  hari: string;
  jamMulai: string;
  jamSelesai: string;
  poliklinik: string;
  isActive: boolean;
  dokter: {
    user: {
      nama: string;
    };
  };
}

const HARI = ['SENIN', 'SELASA', 'RABU', 'KAMIS', 'JUMAT', 'SABTU', 'MINGGU'];

export default function JadwalDokterPage() {
  const [jadwalList, setJadwalList] = useState<JadwalDokter[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterHari, setFilterHari] = useState('');

  useEffect(() => {
    fetchJadwal();
  }, [filterHari]);

  const fetchJadwal = async () => {
    try {
      setLoading(true);

      setJadwalList([
        {
          id: '1',
          hari: 'SENIN',
          jamMulai: '08:00',
          jamSelesai: '12:00',
          poliklinik: 'Poliklinik Urologi',
          isActive: true,
          dokter: {
            user: {
              nama: 'Dr. Budi Santoso, Sp.U',
            },
          },
        },
        {
          id: '2',
          hari: 'RABU',
          jamMulai: '14:00',
          jamSelesai: '17:00',
          poliklinik: 'Poliklinik Urologi',
          isActive: true,
          dokter: {
            user: {
              nama: 'Dr. Budi Santoso, Sp.U',
            },
          },
        },
        {
          id: '3',
          hari: 'SELASA',
          jamMulai: '08:00',
          jamSelesai: '12:00',
          poliklinik: 'Poliklinik Anak',
          isActive: true,
          dokter: {
            user: {
              nama: 'Dr. Siti Nurhaliza, Sp.A',
            },
          },
        },
      ]);
    } catch (error) {
      console.error('Error fetching jadwal:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredJadwal = filterHari
    ? jadwalList.filter((j) => j.hari === filterHari)
    : jadwalList;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Jadwal Dokter</h1>
          <p className="text-gray-600 mt-1">
            Total jadwal: {jadwalList.length}
          </p>
        </div>
        <Link
          href="/dashboard/dokter/jadwal/tambah"
          className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
        >
          + Tambah Jadwal
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilterHari('')}
            className={`px-4 py-2 rounded-lg transition ${
              filterHari === ''
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Semua Hari
          </button>
          {HARI.map((hari) => (
            <button
              key={hari}
              onClick={() => setFilterHari(hari)}
              className={`px-4 py-2 rounded-lg transition ${
                filterHari === hari
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {hari}
            </button>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredJadwal.length === 0 ? (
          <div className="text-center py-12 text-gray-600">
            Belum ada jadwal untuk hari ini
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Hari
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Dokter
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Jam Mulai
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Jam Selesai
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Poliklinik
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredJadwal.map((jadwal) => (
                  <tr
                    key={jadwal.id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {jadwal.hari}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {jadwal.dokter.user.nama}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {jadwal.jamMulai}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {jadwal.jamSelesai}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {jadwal.poliklinik}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          jadwal.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {jadwal.isActive ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      <button className="text-primary-600 hover:text-primary-800">
                        Edit
                      </button>
                      <button className="text-red-600 hover:text-red-800">
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
