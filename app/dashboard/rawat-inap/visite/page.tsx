'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface PasienRawatInap {
  id: string;
  pasien: {
    id: string;
    nama: string;
    nomorRekamMedis: string;
  };
  kamar: {
    nomorKamar: string;
    tipeKamar: string;
  };
  diagnosaAwal: string;
  tanggalMasuk: string;
}

export default function VisiteDokterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingPasien, setLoadingPasien] = useState(true);
  const [error, setError] = useState('');
  const [pasienList, setPasienList] = useState<PasienRawatInap[]>([]);
  const [selectedRawatInap, setSelectedRawatInap] =
    useState<PasienRawatInap | null>(null);

  const [formData, setFormData] = useState({
    rawatInapId: '',
    pasienId: '',
    dokterDinas: '',
    subjektif: '',
    objektif: '',
    asesment: '',
    planning: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchPasienRawatInap();
  }, []);

  const fetchPasienRawatInap = async () => {
    try {
      const response = await fetch('/api/rawat-inap?status=aktif');
      if (response.ok) {
        const data = await response.json();
        setPasienList(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching pasien:', error);
    } finally {
      setLoadingPasien(false);
    }
  };

  const handlePasienSelect = (rawatInap: PasienRawatInap) => {
    setSelectedRawatInap(rawatInap);
    setFormData({
      ...formData,
      rawatInapId: rawatInap.id,
      pasienId: rawatInap.pasien.id,
    });
    setErrors({ ...errors, rawatInapId: '', pasienId: '' });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.rawatInapId) newErrors.rawatInapId = 'Pasien harus dipilih';
    if (!formData.dokterDinas)
      newErrors.dokterDinas = 'Nama dokter harus diisi';
    if (!formData.subjektif) newErrors.subjektif = 'Data subjektif harus diisi';
    if (!formData.objektif) newErrors.objektif = 'Data objektif harus diisi';
    if (!formData.asesment) newErrors.asesment = 'Assessment harus diisi';
    if (!formData.planning) newErrors.planning = 'Planning harus diisi';

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
      const response = await fetch('/api/rawat-inap/visite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Visite dokter berhasil dicatat!');
        router.push('/dashboard/rawat-inap');
      } else {
        const data = await response.json();
        setError(data.error || 'Gagal menyimpan visite');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat menyimpan visite');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Input Visite Dokter
          </h1>
          <p className="text-gray-600 mt-1">
            Catat hasil visite dokter untuk pasien rawat inap (SOAP)
          </p>
        </div>
        <Link
          href="/dashboard/rawat-inap"
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
        {/* Pilih Pasien */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Pilih Pasien Rawat Inap <span className="text-red-500">*</span>
          </label>

          {loadingPasien ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : pasienList.length === 0 ? (
            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
              Tidak ada pasien rawat inap aktif
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {pasienList.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handlePasienSelect(item)}
                  className={`text-left p-4 border-2 rounded-lg transition ${
                    selectedRawatInap?.id === item.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">
                        {item.pasien.nama}
                      </p>
                      <p className="text-sm text-gray-600">
                        RM: {item.pasien.nomorRekamMedis}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Kamar: {item.kamar.nomorKamar} ({item.kamar.tipeKamar})
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Diagnosis: {item.diagnosaAwal}
                      </p>
                    </div>
                    {selectedRawatInap?.id === item.id && (
                      <span className="text-blue-600 font-bold">✓</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
          {errors.rawatInapId && (
            <p className="mt-2 text-sm text-red-500">{errors.rawatInapId}</p>
          )}
        </div>

        {/* Nama Dokter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Nama Dokter yang Visite <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="dokterDinas"
            value={formData.dokterDinas}
            onChange={handleChange}
            placeholder="Masukkan nama dokter"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.dokterDinas ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.dokterDinas && (
            <p className="mt-1 text-sm text-red-500">{errors.dokterDinas}</p>
          )}
        </div>

        {/* SOAP Format */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-2">Format SOAP</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>
              • <strong>S (Subjektif):</strong> Keluhan pasien
            </li>
            <li>
              • <strong>O (Objektif):</strong> Hasil pemeriksaan fisik, vital
              sign, lab
            </li>
            <li>
              • <strong>A (Assessment):</strong> Diagnosis/analisa kondisi
            </li>
            <li>
              • <strong>P (Planning):</strong> Rencana tindakan & terapi
            </li>
          </ul>
        </div>

        {/* Subjektif */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            S - Subjektif (Keluhan Pasien){' '}
            <span className="text-red-500">*</span>
          </label>
          <textarea
            name="subjektif"
            value={formData.subjektif}
            onChange={handleChange}
            rows={3}
            placeholder="Contoh: Pasien mengeluh nyeri perut bagian kanan atas, mual, tidak ada muntah..."
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.subjektif ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.subjektif && (
            <p className="mt-1 text-sm text-red-500">{errors.subjektif}</p>
          )}
        </div>

        {/* Objektif */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            O - Objektif (Pemeriksaan Fisik){' '}
            <span className="text-red-500">*</span>
          </label>
          <textarea
            name="objektif"
            value={formData.objektif}
            onChange={handleChange}
            rows={4}
            placeholder="Contoh: TD: 120/80 mmHg, Nadi: 88x/menit, RR: 20x/menit, Suhu: 37.2°C. Abdomen: nyeri tekan kuadran kanan atas (+)..."
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.objektif ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.objektif && (
            <p className="mt-1 text-sm text-red-500">{errors.objektif}</p>
          )}
        </div>

        {/* Assessment */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            A - Assessment (Diagnosis) <span className="text-red-500">*</span>
          </label>
          <textarea
            name="asesment"
            value={formData.asesment}
            onChange={handleChange}
            rows={3}
            placeholder="Contoh: Diagnosis kerja: Kolesistitis akut. Kondisi pasien membaik..."
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.asesment ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.asesment && (
            <p className="mt-1 text-sm text-red-500">{errors.asesment}</p>
          )}
        </div>

        {/* Planning */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            P - Planning (Rencana Tindakan){' '}
            <span className="text-red-500">*</span>
          </label>
          <textarea
            name="planning"
            value={formData.planning}
            onChange={handleChange}
            rows={4}
            placeholder="Contoh: - Lanjutkan antibiotik IV&#10;- Monitor vital sign setiap 4 jam&#10;- Diet rendah lemak&#10;- USG abdomen besok pagi..."
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.planning ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.planning && (
            <p className="mt-1 text-sm text-red-500">{errors.planning}</p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-4 border-t">
          <button
            onClick={handleSubmit}
            disabled={loading || !selectedRawatInap}
            className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold transition"
          >
            {loading ? 'Menyimpan...' : '✓ Simpan Visite'}
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
