'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function TambahObatPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    nama: '',
    jenis: '',
    satuan: 'TABLET',
    harga: '',
    stokMinimal: '10',
    namaPabrik: '',
    nomorBatch: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/farmasi/obat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          harga: parseFloat(formData.harga),
          stokMinimal: parseInt(formData.stokMinimal),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Gagal menambah obat');
        return;
      }

      alert('Obat berhasil ditambahkan');
      router.push('/dashboard/farmasi');
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Tambah Obat Baru</h1>
        <p className="text-gray-600 mt-1">
          Tambahkan obat baru ke dalam sistem
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-8">
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Nama Obat *
              </label>
              <input
                type="text"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                placeholder="Contoh: Amoksisilin 500mg"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Jenis Obat *
              </label>
              <input
                type="text"
                name="jenis"
                value={formData.jenis}
                onChange={handleChange}
                placeholder="Contoh: Antibiotik"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Satuan *
              </label>
              <select
                name="satuan"
                value={formData.satuan}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              >
                <option value="TABLET">Tablet</option>
                <option value="KAPSUL">Kapsul</option>
                <option value="BOTOL">Botol</option>
                <option value="VIAL">Vial</option>
                <option value="AMPUL">Ampul</option>
                <option value="STRIP">Strip</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Harga (Rp) *
              </label>
              <input
                type="number"
                name="harga"
                value={formData.harga}
                onChange={handleChange}
                placeholder="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Stok Minimal
              </label>
              <input
                type="number"
                name="stokMinimal"
                value={formData.stokMinimal}
                onChange={handleChange}
                placeholder="10"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Nama Pabrik
              </label>
              <input
                type="text"
                name="namaPabrik"
                value={formData.namaPabrik}
                onChange={handleChange}
                placeholder="Contoh: PT Pharma Indo"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Nomor Batch
              </label>
              <input
                type="text"
                name="nomorBatch"
                value={formData.nomorBatch}
                onChange={handleChange}
                placeholder="Contoh: B123456"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="flex space-x-4 pt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium disabled:bg-gray-400"
            >
              {loading ? 'Sedang menyimpan...' : 'Simpan Obat'}
            </button>
            <Link
              href="/dashboard/farmasi"
              className="flex-1 px-6 py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition font-medium text-center"
            >
              Batal
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
