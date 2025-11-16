'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Pasien {
  id: string;
  nomorRekamMedis: string;
  nama: string;
  noHP: string;
  alamat: string;
  nik: string;
  tanggalLahir: string;
  gender: string;
}

interface PaginationData {
  data: Pasien[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function PasienPage() {
  const [pasienList, setPasienList] = useState<Pasien[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const fetchPasien = async (pageNum: number, searchQuery: string) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: '10',
      });

      if (searchQuery) {
        params.append('search', searchQuery);
      }

      const response = await fetch(`/api/pasien?${params}`);
      if (response.ok) {
        const data: PaginationData = await response.json();
        setPasienList(data.data);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching pasien:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPasien(1, search);
      setPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchPasien(page, search);
  }, [page]);

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus pasien ini?')) return;

    try {
      const response = await fetch(`/api/pasien/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setPasienList(pasienList.filter((p) => p.id !== id));
        alert('Pasien berhasil dihapus');
      }
    } catch (error) {
      console.error('Error deleting pasien:', error);
      alert('Gagal menghapus pasien');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Manajemen Pasien</h1>
          <p className="text-gray-600 mt-1">
            Total: {pagination.total} pasien terdaftar
          </p>
        </div>
        <Link
          href="/dashboard/pasien/tambah"
          className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium flex items-center"
        >
          + Tambah Pasien Baru
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <input
          type="text"
          placeholder="Cari pasien (nama, nomor rekam medis, NIK, no HP)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <p className="mt-4 text-gray-600">Memuat data...</p>
            </div>
          </div>
        ) : pasienList.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Tidak ada data pasien</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Nomor RM
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Nama
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    NIK
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    No HP
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Alamat
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {pasienList.map((pasien) => (
                  <tr
                    key={pasien.id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-primary-600">
                      {pasien.nomorRekamMedis}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {pasien.nama}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {pasien.nik}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {pasien.noHP}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {pasien.alamat?.substring(0, 30)}...
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      <Link
                        href={`/dashboard/pasien/${pasien.id}`}
                        className="inline-px-3 py-1 bg-primary-100 text-primary-700 rounded hover:bg-primary-200 transition"
                      >
                        Lihat
                      </Link>
                      <button
                        onClick={() => handleDelete(pasien.id)}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
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
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
          >
            Sebelumnya
          </button>

          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
            (pageNum) => (
              <button
                key={pageNum}
                onClick={() => setPage(pageNum)}
                className={`px-3 py-2 rounded-lg transition ${
                  pageNum === page
                    ? 'bg-primary-600 text-white'
                    : 'border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {pageNum}
              </button>
            )
          )}

          <button
            onClick={() => setPage(Math.min(pagination.totalPages, page + 1))}
            disabled={page === pagination.totalPages}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
          >
            Selanjutnya
          </button>
        </div>
      )}
    </div>
  );
}
