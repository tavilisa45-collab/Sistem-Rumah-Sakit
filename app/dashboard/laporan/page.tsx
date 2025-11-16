'use client';

import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export default function LaporanPage() {
  const [dataLaporan, setDataLaporan] = useState({
    kunjunganPerBulan: [],
    jenisKunjungan: [],
    topObat: [],
    stokRawatInap: [],
  });
  const [loading, setLoading] = useState(true);
  const [filterBulan, setFilterBulan] = useState(new Date().getMonth() + 1);
  const [filterTahun, setFilterTahun] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchLaporan();
  }, [filterBulan, filterTahun]);

  const fetchLaporan = async () => {
    try {
      setLoading(true);

      setDataLaporan({
        kunjunganPerBulan: [
          { bulan: 'Jan', total: 120 },
          { bulan: 'Feb', total: 140 },
          { bulan: 'Mar', total: 110 },
          { bulan: 'Apr', total: 160 },
          { bulan: 'May', total: 150 },
          { bulan: 'Jun', total: 180 },
        ],
        jenisKunjungan: [
          { name: 'Rawat Jalan', value: 300 },
          { name: 'IGD', value: 150 },
          { name: 'Rawat Inap', value: 200 },
        ],
        topObat: [
          { nama: 'Amoksisilin', pemakaian: 250 },
          { nama: 'Paracetamol', pemakaian: 180 },
          { nama: 'Ibuprofen', pemakaian: 160 },
          { nama: 'Metronidazol', pemakaian: 140 },
        ],
        stokRawatInap: [
          { bulan: 'Week 1', okupansi: 65 },
          { bulan: 'Week 2', okupansi: 72 },
          { bulan: 'Week 3', okupansi: 68 },
          { bulan: 'Week 4', okupansi: 75 },
        ],
      });
    } catch (error) {
      console.error('Error fetching laporan:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#3b82f6', '#ef4444', '#10b981'];

  const handleExportPDF = () => {
    alert('Fitur export PDF sedang dikembangkan');
  };

  const handleExportExcel = () => {
    alert('Fitur export Excel sedang dikembangkan');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Laporan & Analytics
          </h1>
          <p className="text-gray-600 mt-1">Analisis data rumah sakit</p>
        </div>
        <div className="space-x-2">
          <button
            onClick={handleExportPDF}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
          >
            Export PDF
          </button>
          <button
            onClick={handleExportExcel}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
          >
            Export Excel
          </button>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-4 flex gap-4">
        <div>
          <label className="block text-sm text-gray-600 font-medium mb-1">
            Bulan
          </label>
          <select
            value={filterBulan}
            onChange={(e) => setFilterBulan(parseInt(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {[...Array(12)].map((_, i) => (
              <option
                key={i + 1}
                value={i + 1}
              >
                {new Date(2024, i, 1).toLocaleDateString('id-ID', {
                  month: 'long',
                })}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-600 font-medium mb-1">
            Tahun
          </label>
          <select
            value={filterTahun}
            onChange={(e) => setFilterTahun(parseInt(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {[2022, 2023, 2024, 2025].map((year) => (
              <option
                key={year}
                value={year}
              >
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">Memuat laporan...</p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Trend Kunjungan 6 Bulan
              </h3>
              <ResponsiveContainer
                width="100%"
                height={300}
              >
                <BarChart data={dataLaporan.kunjunganPerBulan}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="bulan" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="total"
                    fill="#3b82f6"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Distribusi Jenis Kunjungan
              </h3>
              <ResponsiveContainer
                width="100%"
                height={300}
              >
                <PieChart>
                  <Pie
                    data={dataLaporan.jenisKunjungan}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {dataLaporan.jenisKunjungan.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Top 4 Obat Paling Dipakai
              </h3>
              <ResponsiveContainer
                width="100%"
                height={300}
              >
                <BarChart
                  data={dataLaporan.topObat}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis
                    dataKey="nama"
                    type="category"
                    width={100}
                  />
                  <Tooltip />
                  <Bar
                    dataKey="pemakaian"
                    fill="#10b981"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Occupancy Rate Rawat Inap
              </h3>
              <ResponsiveContainer
                width="100%"
                height={300}
              >
                <BarChart data={dataLaporan.stokRawatInap}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="bulan" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="okupansi"
                    fill="#f59e0b"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
