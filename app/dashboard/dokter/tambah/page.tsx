'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const SPESIALISASI_OPTIONS = [
  'Umum',
  'Anak',
  'Bedah',
  'Kandungan',
  'Jantung',
  'Paru',
  'Saraf',
  'Mata',
  'THT',
  'Kulit',
  'Gigi',
  'Urologi',
  'Orthopedi',
  'Psikiatri',
];

export default function TambahDokterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    // Data User
    nama: '',
    email: '',
    password: '',
    confirmPassword: '',

    // Data Dokter
    nip: '',
    spesialisasi: '',
    noSTR: '',
    noSIP: '',
    noHP: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

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

    // Validasi User
    if (!formData.nama.trim()) newErrors.nama = 'Nama harus diisi';
    if (!formData.email.trim()) {
      newErrors.email = 'Email harus diisi';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }
    if (!formData.password) {
      newErrors.password = 'Password harus diisi';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Password tidak cocok';
    }

    // Validasi Dokter
    if (!formData.nip.trim()) newErrors.nip = 'NIP harus diisi';
    if (!formData.spesialisasi)
      newErrors.spesialisasi = 'Spesialisasi harus dipilih';
    if (!formData.noSTR.trim()) newErrors.noSTR = 'No. STR harus diisi';
    if (!formData.noSIP.trim()) newErrors.noSIP = 'No. SIP harus diisi';
    if (!formData.noHP.trim()) {
      newErrors.noHP = 'No. HP harus diisi';
    } else if (!/^08\d{8,11}$/.test(formData.noHP)) {
      newErrors.noHP = 'Format No. HP tidak valid (contoh: 081234567890)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/dokter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nama: formData.nama,
          email: formData.email,
          password: formData.password,
          nip: formData.nip,
          spesialisasi: formData.spesialisasi,
          noSTR: formData.noSTR,
          noSIP: formData.noSIP,
          noHP: formData.noHP,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Dokter berhasil ditambahkan!');
        router.push('/dashboard/dokter');
      } else {
        setError(data.error || 'Gagal menambahkan dokter');
      }
    } catch (err) {
      console.error('Submit error:', err);
      setError('Terjadi kesalahan saat menambahkan dokter');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Tambah Dokter</h1>
          <p className="text-gray-600 mt-1">Registrasi dokter baru</p>
        </div>
        <Link
          href="/dashboard/dokter"
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

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Data User */}
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-3">
            Data Akun
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                placeholder="Dr. Nama Lengkap, Sp.X"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.nama ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.nama && (
                <p className="mt-1 text-sm text-red-500">{errors.nama}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="dokter@email.com"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                No. HP <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="noHP"
                value={formData.noHP}
                onChange={handleChange}
                placeholder="081234567890"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.noHP ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.noHP && (
                <p className="mt-1 text-sm text-red-500">{errors.noHP}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimal 6 karakter"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Konfirmasi Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Ulangi password"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Data Dokter */}
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-3">
            Data Profesional
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                NIP <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nip"
                value={formData.nip}
                onChange={handleChange}
                placeholder="197503152000010001"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.nip ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.nip && (
                <p className="mt-1 text-sm text-red-500">{errors.nip}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Spesialisasi <span className="text-red-500">*</span>
              </label>
              <select
                name="spesialisasi"
                value={formData.spesialisasi}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.spesialisasi ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">-- Pilih Spesialisasi --</option>
                {SPESIALISASI_OPTIONS.map((sp) => (
                  <option
                    key={sp}
                    value={sp}
                  >
                    {sp}
                  </option>
                ))}
              </select>
              {errors.spesialisasi && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.spesialisasi}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                No. STR <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="noSTR"
                value={formData.noSTR}
                onChange={handleChange}
                placeholder="STR/0175/5/2020"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.noSTR ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.noSTR && (
                <p className="mt-1 text-sm text-red-500">{errors.noSTR}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                No. SIP <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="noSIP"
                value={formData.noSIP}
                onChange={handleChange}
                placeholder="SIP/0175/5/2020"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.noSIP ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.noSIP && (
                <p className="mt-1 text-sm text-red-500">{errors.noSIP}</p>
              )}
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-800 mb-2">Informasi:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Password akan dikirimkan ke email dokter</li>
            <li>• Dokter dapat mengubah password setelah login pertama kali</li>
            <li>• Pastikan data yang diinput sudah benar</li>
          </ul>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-4 border-t">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold transition"
          >
            {loading ? 'Menyimpan...' : 'Simpan Dokter'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}
