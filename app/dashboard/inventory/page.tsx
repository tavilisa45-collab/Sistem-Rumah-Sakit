'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Barang {
  id: string;
  kodeBarang: string;
  nama: string;
  kategori: string;
  satuan: string;
  harga: number;
  stokSekarang: number;
  stokMinimal: number;
}

export default function InventoryPage() {
  const [barangList, setBarangList] = useState<Barang[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterKategori, setFilterKategori] = useState('');

  useEffect(() => {
    fetchBarang();
  }, [filterKategori]);

  const fetchBarang = async () => {
    try {
      setLoading(true);
      const params = filterKategori ? `?kategori=${filterKategori}` : '';
      const response = await fetch(`/api/inventory/barang${params}`);
      if (response.ok) {
        const data = await response.json();
        setBarangList(data);
      }
    } catch (error) {
      console.error('Error fetching barang:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStockStatus = (stok: number, minimal: number) => {
    if (stok <= minimal)
      return { status: 'MENIPIS', color: 'bg-red-100 text-red-800' };
    if (stok <= minimal * 1.5)
      return { status: 'RENDAH', color: 'bg-yellow-100 text-yellow-800' };
    return { status: 'NORMAL', color: 'bg-green-100 text-green-800' };
  };

  const categories = ['ALAT_MEDIS', 'BAHAN_HABIS', 'LINEN', 'LAINNYA'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Manajemen Inventory
          </h1>
          <p className="text-gray-600 mt-1">
            Kelola stok barang dan perlengkapan
          </p>
        </div>
        <div className="space-x-3">
          <Link
            href="/dashboard/inventory/barang/tambah"
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
          >
            + Tambah Barang
          </Link>
          <Link
            href="/dashboard/inventory/permintaan"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Permintaan
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-primary-500">
          <p className="text-gray-600 text-sm">Total Barang</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            {barangList.length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
          <p className="text-gray-600 text-sm">Stok Menipis</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            {barangList.filter((b) => b.stokSekarang <= b.stokMinimal).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <p className="text-gray-600 text-sm">Total Nilai</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            Rp{' '}
            {(
              barangList.reduce((sum, b) => sum + b.harga * b.stokSekarang, 0) /
              1000000
            ).toFixed(1)}
            M
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilterKategori('')}
            className={`px-4 py-2 rounded-lg transition ${
              filterKategori === ''
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Semua
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterKategori(cat)}
              className={`px-4 py-2 rounded-lg transition ${
                filterKategori === cat
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {cat.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : barangList.length === 0 ? (
          <div className="text-center py-12 text-gray-600">
            Tidak ada data barang
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Kode
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Nama Barang
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Kategori
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Satuan
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Harga
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Stok
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
                {barangList.map((barang) => {
                  const { status, color } = getStockStatus(
                    barang.stokSekarang,
                    barang.stokMinimal
                  );
                  return (
                    <tr
                      key={barang.id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 font-medium text-primary-600">
                        {barang.kodeBarang}
                      </td>
                      <td className="px-6 py-4">{barang.nama}</td>
                      <td className="px-6 py-4 text-sm">{barang.kategori}</td>
                      <td className="px-6 py-4 text-sm">{barang.satuan}</td>
                      <td className="px-6 py-4 text-sm">
                        Rp {barang.harga.toLocaleString('id-ID')}
                      </td>
                      <td className="px-6 py-4 font-medium">
                        {barang.stokSekarang}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${color}`}
                        >
                          {status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <Link
                          href={`/dashboard/inventory/barang/${barang.id}`}
                          className="text-primary-600 hover:underline"
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
