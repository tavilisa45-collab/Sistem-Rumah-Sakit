'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Pasien {
  id: string;
  nama: string;
  nomorRekamMedis: string;
  tanggalLahir: string;
}

export default function BuatPermintaanLabPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [pasienList, setPasienList] = useState<Pasien[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPasienList, setShowPasienList] = useState(false);
  const [selectedPasien, setSelectedPasien] = useState<Pasien | null>(null);

  const [formData, setFormData] = useState({
    pasienId: '',
    dokterDinas: '',
    jenisPermintaan: '',
    tipePermeriksaan: '',
    indikasi: '',
    prioritas: 'NORMAL',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchPasien();
  }, []);

  const fetchPasien = async () => {
    try {
      const response = await fetch('/api/pasien');
      if (response.ok) {
        const data = await response.json();
        setPasienList(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching pasien:', error);
    }
  };

  const filteredPasien = pasienList.filter(
    (p) =>
      p.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.nomorRekamMedis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePasienSelect = (pasien: Pasien) => {
    setSelectedPasien(pasien);
    setFormData({ ...formData, pasienId: pasien.id });
    setSearchTerm(pasien.nama);
    setShowPasienList(false);
    setErrors({ ...errors, pasienId: '' });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.pasienId) newErrors.pasienId = 'Pasien harus dipilih';
    if (!formData.dokterDinas)
      newErrors.dokterDinas = 'Dokter dinas harus diisi';
    if (!formData.jenisPermintaan)
      newErrors.jenisPermintaan = 'Jenis permintaan harus dipilih';
    if (!formData.tipePermeriksaan)
      newErrors.tipePermeriksaan = 'Tipe pemeriksaan harus dipilih';
    if (!formData.indikasi) newErrors.indikasi = 'Indikasi harus diisi';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/lab/permintaan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Permintaan lab berhasil dibuat!');
        router.push('/dashboard/lab');
      } else {
        const data = await response.json();
        alert(data.error || 'Gagal membuat permintaan');
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Terjadi kesalahan saat membuat permintaan');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Buat Permintaan Lab
          </h1>
          <p className="text-gray-600 mt-1">
            Isi formulir untuk membuat permintaan pemeriksaan lab
          </p>
        </div>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-secondary-100 transition"
        >
          ← Kembali
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-lg p-6 space-y-6"
      >
        {/* Pencarian Pasien */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Pasien <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowPasienList(true);
              }}
              onFocus={() => setShowPasienList(true)}
              placeholder="Cari pasien berdasarkan nama atau no. RM"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.pasienId ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {showPasienList && searchTerm && filteredPasien.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {filteredPasien.map((pasien) => (
                  <button
                    key={pasien.id}
                    type="button"
                    onClick={() => handlePasienSelect(pasien)}
                    className="w-full px-4 py-3 text-left hover:bg-primary-50 border-b last:border-b-0 transition"
                  >
                    <p className="font-medium text-gray-800">{pasien.nama}</p>
                    <p className="text-sm text-gray-500">
                      RM: {pasien.nomorRekamMedis}
                    </p>
                    <p className="text-xs text-gray-400">
                      Lahir:{' '}
                      {new Date(pasien.tanggalLahir).toLocaleDateString(
                        'id-ID'
                      )}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
          {selectedPasien && (
            <div className="mt-2 p-3 bg-primary-50 border border-primary-200 rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Pasien terpilih:</span>{' '}
                {selectedPasien.nama} (RM: {selectedPasien.nomorRekamMedis})
              </p>
            </div>
          )}
          {errors.pasienId && (
            <p className="mt-1 text-sm text-red-500">{errors.pasienId}</p>
          )}
        </div>

        {/* Dokter Dinas */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Dokter yang Meminta <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="dokterDinas"
            value={formData.dokterDinas}
            onChange={handleChange}
            placeholder="Masukkan nama dokter"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
              errors.dokterDinas ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.dokterDinas && (
            <p className="mt-1 text-sm text-red-500">{errors.dokterDinas}</p>
          )}
        </div>

        {/* Jenis Permintaan */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Jenis Permintaan <span className="text-red-500">*</span>
          </label>
          <select
            name="jenisPermintaan"
            value={formData.jenisPermintaan}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
              errors.jenisPermintaan ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">-- Pilih Jenis --</option>
            <option value="HEMATOLOGI">Hematologi</option>
            <option value="KIMIA_KLINIK">Kimia Klinik</option>
            <option value="MIKROBIOLOGI">Mikrobiologi</option>
            <option value="IMUNOLOGI">Imunologi</option>
            <option value="URINALISIS">Urinalisis</option>
          </select>
          {errors.jenisPermintaan && (
            <p className="mt-1 text-sm text-red-500">
              {errors.jenisPermintaan}
            </p>
          )}
        </div>

        {/* Tipe Pemeriksaan */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Tipe Pemeriksaan <span className="text-red-500">*</span>
          </label>
          <select
            name="tipePermeriksaan"
            value={formData.tipePermeriksaan}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
              errors.tipePermeriksaan ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">-- Pilih Tipe --</option>
            <option value="DARAH_LENGKAP">Darah Lengkap</option>
            <option value="GULA_DARAH">Gula Darah</option>
            <option value="FUNGSI_HATI">Fungsi Hati</option>
            <option value="FUNGSI_GINJAL">Fungsi Ginjal</option>
            <option value="LIPID_PROFILE">Lipid Profile</option>
            <option value="URINE_LENGKAP">Urine Lengkap</option>
            <option value="KULTUR">Kultur</option>
            <option value="LAINNYA">Lainnya</option>
          </select>
          {errors.tipePermeriksaan && (
            <p className="mt-1 text-sm text-red-500">
              {errors.tipePermeriksaan}
            </p>
          )}
        </div>

        {/* Indikasi */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Indikasi Klinis <span className="text-red-500">*</span>
          </label>
          <textarea
            name="indikasi"
            value={formData.indikasi}
            onChange={handleChange}
            rows={4}
            placeholder="Masukkan indikasi klinis atau diagnosis kerja"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
              errors.indikasi ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.indikasi && (
            <p className="mt-1 text-sm text-red-500">{errors.indikasi}</p>
          )}
        </div>

        {/* Prioritas */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Prioritas
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="prioritas"
                value="NORMAL"
                checked={formData.prioritas === 'NORMAL'}
                onChange={handleChange}
                className="w-4 h-4 text-primary-600 focus:ring-2 focus:ring-primary-500"
              />
              <span className="ml-2 text-gray-700">Normal</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="prioritas"
                value="URGENT"
                checked={formData.prioritas === 'URGENT'}
                onChange={handleChange}
                className="w-4 h-4 text-red-600 focus:ring-2 focus:ring-red-500"
              />
              <span className="ml-2 text-gray-700">Urgent</span>
            </label>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold transition"
          >
            {loading ? 'Menyimpan...' : 'Simpan Permintaan'}
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
