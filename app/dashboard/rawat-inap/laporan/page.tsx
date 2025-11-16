'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface LaporanBOR {
  tanggal: string;
  totalKamar: number;
  kamarTerisi: number;
  kamarKosong: number;
  borPercentage: number;
  pasienMasuk: number;
  pasienKeluar: number;
}

export default function LaporanBORPage() {
  const [loading, setLoading] = useState(true);
  const [laporan, setLaporan] = useState<LaporanBOR[]>([]);
  const [filter, setFilter] = useState({
    startDate: '',
    endDate: '',
  });

  const [summary, setSummary] = useState({
    avgBOR: 0,
    totalPasienMasuk: 0,
    totalPasienKeluar: 0,
    peakOccupancy: 0,
  });

  useEffect(() => {
    const today = new Date();
    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 7);

    setFilter({
      startDate: lastWeek.toISOString().split('T')[0],
      endDate: today.toISOString().split('T')[0],
    });

    fetchLaporan();
  }, []);

  const fetchLaporan = async () => {
    try {
      setLoading(true);
      // Simulasi data - ganti dengan API call yang sebenarnya
      const mockData: LaporanBOR[] = [
        {
          tanggal: '2025-11-14',
          totalKamar: 20,
          kamarTerisi: 16,
          kamarKosong: 4,
          borPercentage: 80,
          pasienMasuk: 3,
          pasienKeluar: 2,
        },
        {
          tanggal: '2025-11-13',
          totalKamar: 20,
          kamarTerisi: 15,
          kamarKosong: 5,
          borPercentage: 75,
          pasienMasuk: 2,
          pasienKeluar: 1,
        },
        {
          tanggal: '2025-11-12',
          totalKamar: 20,
          kamarTerisi: 14,
          kamarKosong: 6,
          borPercentage: 70,
          pasienMasuk: 4,
          pasienKeluar: 3,
        },
      ];

      setLaporan(mockData);

      // Hitung summary
      const avgBOR =
        mockData.reduce((acc, curr) => acc + curr.borPercentage, 0) /
        mockData.length;
      const totalMasuk = mockData.reduce(
        (acc, curr) => acc + curr.pasienMasuk,
        0
      );
      const totalKeluar = mockData.reduce(
        (acc, curr) => acc + curr.pasienKeluar,
        0
      );
      const peak = Math.max(...mockData.map((d) => d.borPercentage));

      setSummary({
        avgBOR: Math.round(avgBOR * 10) / 10,
        totalPasienMasuk: totalMasuk,
        totalPasienKeluar: totalKeluar,
        peakOccupancy: peak,
      });
    } catch (error) {
      console.error('Error fetching laporan:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });
  };

  const handleApplyFilter = () => {
    fetchLaporan();
  };

  const getBORColor = (bor: number) => {
    if (bor >= 75 && bor <= 85) return 'text-green-600 bg-green-50';
    if (bor > 85) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const getBORStatus = (bor: number) => {
    if (bor >= 75 && bor <= 85) return 'Optimal';
    if (bor > 85) return 'Tinggi';
    return 'Rendah';
  };

  const exportToCSV = () => {
    const headers = [
      'Tanggal',
      'Total Kamar',
      'Terisi',
      'Kosong',
      'BOR (%)',
      'Pasien Masuk',
      'Pasien Keluar',
    ];
    const rows = laporan.map((item) => [
      item.tanggal,
      item.totalKamar,
      item.kamarTerisi,
      item.kamarKosong,
      item.borPercentage,
      item.pasienMasuk,
      item.pasienKeluar,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `laporan-bor-${filter.startDate}-${filter.endDate}.csv`;
    a.click();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Laporan BOR</h1>
          <p className="text-gray-600 mt-1">
            Bed Occupancy Rate - Tingkat Penggunaan Tempat Tidur
          </p>
        </div>
        <Link
          href="/dashboard/rawat-inap"
          className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
        >
          ← Kembali
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-primary-500">
          <p className="text-gray-600 text-sm">Rata-rata BOR</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            {summary.avgBOR}%
          </p>
          <p className="text-xs text-gray-500 mt-1">Target: 75-85%</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <p className="text-gray-600 text-sm">Total Pasien Masuk</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            {summary.totalPasienMasuk}
          </p>
          <p className="text-xs text-gray-500 mt-1">Periode filter</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
          <p className="text-gray-600 text-sm">Total Pasien Keluar</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            {summary.totalPasienKeluar}
          </p>
          <p className="text-xs text-gray-500 mt-1">Periode filter</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
          <p className="text-gray-600 text-sm">Peak Occupancy</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            {summary.peakOccupancy}%
          </p>
          <p className="text-xs text-gray-500 mt-1">Tertinggi periode ini</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tanggal Mulai
            </label>
            <input
              type="date"
              name="startDate"
              value={filter.startDate}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tanggal Akhir
            </label>
            <input
              type="date"
              name="endDate"
              value={filter.endDate}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <button
            onClick={handleApplyFilter}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold"
          >
            Tampilkan
          </button>
          <button
            onClick={exportToCSV}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
          >
            Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50">
          <h3 className="text-lg font-bold text-gray-800">
            Detail Laporan Harian
          </h3>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
          </div>
        ) : laporan.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            Tidak ada data untuk periode yang dipilih
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Tanggal
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                    Total Kamar
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                    Terisi
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                    Kosong
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                    BOR (%)
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                    Pasien Masuk
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                    Pasien Keluar
                  </th>
                </tr>
              </thead>
              <tbody>
                {laporan.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">
                      {new Date(item.tanggal).toLocaleDateString('id-ID', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-700">
                      {item.totalKamar}
                    </td>
                    <td className="px-6 py-4 text-center text-sm font-semibold text-primary-600">
                      {item.kamarTerisi}
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">
                      {item.kamarKosong}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-bold ${getBORColor(
                          item.borPercentage
                        )}`}
                      >
                        {item.borPercentage}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-sm font-medium text-primary-800">
                      {getBORStatus(item.borPercentage)}
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-green-600 font-semibold">
                      +{item.pasienMasuk}
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-red-600 font-semibold">
                      -{item.pasienKeluar}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
        <h3 className="font-bold text-gray-800 mb-3">Tentang BOR</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <p className="font-semibold mb-2">Formula BOR:</p>
            <p className="bg-white p-2 rounded border">
              BOR = (Kamar Terisi / Total Kamar) × 100%
            </p>
          </div>
          <div>
            <p className="font-semibold mb-2">Standar Ideal:</p>
            <ul className="space-y-1">
              <li>
                • <span className="text-green-600 font-semibold">75-85%</span> =
                Optimal
              </li>
              <li>
                • <span className="text-orange-600 font-semibold">&gt;85%</span>{' '}
                = Overutilization
              </li>
              <li>
                • <span className="text-red-600 font-semibold">&lt;75%</span> =
                Underutilization
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
