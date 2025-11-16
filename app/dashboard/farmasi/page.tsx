'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Obat {
  id: string;
  kodeObat: string;
  nama: string;
  jenis: string;
  satuan: string;
  harga: number;
  stokSekarang: number;
  stokMinimal: number;
}

export default function FarmasiPage() {
  const [obatList, setObatList] = useState<Obat[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchObat();
  }, []);

  const fetchObat = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/farmasi/obat?search=${search}`);
      if (response.ok) {
        const data = await response.json();
        setObatList(data.data);
      }
    } catch (error) {
      console.error('Error fetching obat:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchObat();
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const getStockStatus = (stok: number, minimal: number) => {
    if (stok <= minimal)
      return { status: 'MENIPIS', color: 'bg-red-100 text-red-800' };
    if (stok <= minimal * 1.5)
      return { status: 'RENDAH', color: 'bg-yellow-100 text-yellow-800' };
    return { status: 'NORMAL', color: 'bg-green-100 text-green-800' };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Manajemen Farmasi
          </h1>
          <p className="text-gray-600 mt-1">Kelola stok obat dan resep</p>
        </div>
        <div className="space-x-3">
          <Link
            href="/dashboard/farmasi/obat"
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
          >
            Daftar Obat
          </Link>
          <Link
            href="/dashboard/farmasi/resep"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Resep
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-primary-500">
          <p className="text-gray-600 text-sm">Total Obat</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            {obatList.length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
          <p className="text-gray-600 text-sm">Stok Menipis</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            {obatList.filter((o) => o.stokSekarang <= o.stokMinimal).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <p className="text-gray-600 text-sm">Total Nilai Stok</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            Rp{' '}
            {(
              obatList.reduce((sum, o) => sum + o.harga * o.stokSekarang, 0) /
              1000000
            ).toFixed(1)}
            M
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-4">
        <input
          type="text"
          placeholder="Cari obat (nama, kode)..."
          value={search}
          onChange={handleSearch}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : obatList.length === 0 ? (
          <div className="text-center py-12 text-gray-600">
            Tidak ada data obat
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Kode
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Nama Obat
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Jenis
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Satuan
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Harga
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Stok
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
                {obatList.map((obat) => {
                  const { status, color } = getStockStatus(
                    obat.stokSekarang,
                    obat.stokMinimal
                  );
                  return (
                    <tr
                      key={obat.id}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-primary-600">
                        {obat.kodeObat}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800">
                        {obat.nama}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {obat.jenis}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {obat.satuan}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        Rp {obat.harga.toLocaleString('id-ID')}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">
                        {obat.stokSekarang} {obat.satuan}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${color}`}
                        >
                          {status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm space-x-2">
                        <Link
                          href={`/dashboard/farmasi/obat/${obat.id}`}
                          className="text-primary-600 hover:text-primary-800"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
