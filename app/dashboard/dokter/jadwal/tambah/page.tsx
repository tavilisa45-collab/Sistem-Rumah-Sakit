'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Dokter {
  id: string;
  user: {
    nama: string;
  };
  spesialisasi: string;
}

const HARI_OPTIONS = [
  'SENIN',
  'SELASA',
  'RABU',
  'KAMIS',
  'JUMAT',
  'SABTU',
  'MINGGU',
];

export default function TambahJadwalDokterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingDokter, setLoadingDokter] = useState(true);
  const [dokterList, setDokterList] = useState<Dokter[]>([]);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    dokterID: '',
    hari: '',
    jamMulai: '',
    jamSelesai: '',
    poliklinik: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchDokter();
  }, []);

  const fetchDokter = async () => {
    try {
      const response = await fetch('/api/dokter');
      if (response.ok) {
        const data = await response.json();
        setDokterList(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching dokter:', error);
    } finally {
      setLoadingDokter(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.dokterID) newErrors.dokterID = 'Dokter harus dipilih';
    if (!formData.hari) newErrors.hari = 'Hari harus dipilih';
    if (!formData.jamMulai) newErrors.jamMulai = 'Jam mulai harus diisi';
    if (!formData.jamSelesai) newErrors.jamSelesai = 'Jam selesai harus diisi';
    if (!formData.poliklinik) newErrors.poliklinik = 'Poliklinik harus diisi';

    if (formData.jamMulai && formData.jamSelesai) {
      if (formData.jamMulai >= formData.jamSelesai) {
        newErrors.jamSelesai = 'Jam selesai harus lebih besar dari jam mulai';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/dokter/jadwal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Jadwal dokter berhasil ditambahkan!');
        router.push('/dashboard/dokter/jadwal');
      } else {
        const data = await response.json();
        setError(data.error || 'Gagal menambahkan jadwal');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat menambahkan jadwal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Tambah Jadwal Dokter
          </h1>
          <p className="text-gray-600 mt-1">Atur jadwal praktik dokter</p>
        </div>
        <Link
          href="/dashboard/dokter/jadwal"
          className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
        >
          ← Kembali
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
        {/* Pilih Dokter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Pilih Dokter <span className="text-red-500">*</span>
          </label>
          {loadingDokter ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <select
              name="dokterID"
              value={formData.dokterID}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.dokterID ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">-- Pilih Dokter --</option>
              {dokterList.map((dokter) => (
                <option
                  key={dokter.id}
                  value={dokter.id}
                >
                  {dokter.user.nama} - {dokter.spesialisasi}
                </option>
              ))}
            </select>
          )}
          {errors.dokterID && (
            <p className="mt-1 text-sm text-red-500">{errors.dokterID}</p>
          )}
        </div>

        {/* Pilih Hari */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Hari <span className="text-red-500">*</span>
          </label>
          <select
            name="hari"
            value={formData.hari}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
              errors.hari ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">-- Pilih Hari --</option>
            {HARI_OPTIONS.map((hari) => (
              <option
                key={hari}
                value={hari}
              >
                {hari}
              </option>
            ))}
          </select>
          {errors.hari && (
            <p className="mt-1 text-sm text-red-500">{errors.hari}</p>
          )}
        </div>

        {/* Jam Mulai & Selesai */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Jam Mulai <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              name="jamMulai"
              value={formData.jamMulai}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.jamMulai ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.jamMulai && (
              <p className="mt-1 text-sm text-red-500">{errors.jamMulai}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Jam Selesai <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              name="jamSelesai"
              value={formData.jamSelesai}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.jamSelesai ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.jamSelesai && (
              <p className="mt-1 text-sm text-red-500">{errors.jamSelesai}</p>
            )}
          </div>
        </div>

        {/* Poliklinik */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Poliklinik <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="poliklinik"
            value={formData.poliklinik}
            onChange={handleChange}
            placeholder="Contoh: Poliklinik Umum"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
              errors.poliklinik ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.poliklinik && (
            <p className="mt-1 text-sm text-red-500">{errors.poliklinik}</p>
          )}
        </div>

        {/* Info Box */}
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-800 mb-2">💡 Tips:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Pastikan jam praktik tidak bentrok dengan jadwal lain</li>
            <li>• Format waktu menggunakan 24 jam (contoh: 14:00)</li>
            <li>• Jadwal akan otomatis aktif setelah dibuat</li>
          </ul>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-4 border-t">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold transition"
          >
            {loading ? 'Menyimpan...' : 'Simpan Jadwal'}
          </button>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}
