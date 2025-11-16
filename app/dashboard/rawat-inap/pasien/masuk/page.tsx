'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface Pasien {
  id: string;
  nama: string;
  nomorRekamMedis: string;
  noHP: string;
}

export default function PasienMasukPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const kamarIdFromUrl = searchParams.get('kamarId');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pasienOptions, setPasienOptions] = useState<Pasien[]>([]);
  const [searchPasien, setSearchPasien] = useState('');

  const [formData, setFormData] = useState({
    pasienId: '',
    kamarId: kamarIdFromUrl || '',
    diagnosaAwal: '',
  });

  useEffect(() => {
    if (searchPasien.length >= 2) {
      fetchPasien();
    }
  }, [searchPasien]);

  const fetchPasien = async () => {
    try {
      const response = await fetch(
        `/api/pasien?search=${searchPasien}&limit=5`
      );
      if (response.ok) {
        const data = await response.json();
        setPasienOptions(data.data);
      }
    } catch (error) {
      console.error('Error fetching pasien:', error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectPasien = (pasien: Pasien) => {
    setFormData((prev) => ({
      ...prev,
      pasienId: pasien.id,
    }));
    setSearchPasien(pasien.nama);
    setPasienOptions([]);
  };

  const handleSubmit = async () => {
    if (!formData.pasienId || !formData.kamarId || !formData.diagnosaAwal) {
      setError('Semua field wajib diisi');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/rawat-inap/pasien-masuk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Gagal memasukkan pasien');
        return;
      }

      alert('Pasien berhasil masuk rawat inap');
      router.push('/dashboard/rawat-inap');
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Pasien Masuk Rawat Inap
        </h1>
        <p className="text-gray-600 mt-1">
          Catat pasien baru yang masuk rawat inap
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-8">
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Cari Pasien *
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchPasien}
                onChange={(e) => setSearchPasien(e.target.value)}
                placeholder="Ketik nama atau nomor rekam medis pasien..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              {pasienOptions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg mt-1 z-10">
                  {pasienOptions.map((pasien) => (
                    <button
                      key={pasien.id}
                      type="button"
                      onClick={() => handleSelectPasien(pasien)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 border-b last:border-b-0"
                    >
                      <p className="font-medium text-gray-800">{pasien.nama}</p>
                      <p className="text-sm text-gray-600">
                        RM: {pasien.nomorRekamMedis} | HP: {pasien.noHP}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {formData.pasienId && (
              <p className="mt-2 text-sm text-green-600">✓ Pasien dipilih</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Nomor Kamar *
            </label>
            <input
              type="text"
              name="kamarId"
              value={formData.kamarId}
              onChange={handleChange}
              placeholder="Masukkan ID kamar atau pilih dari halaman kamar"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Diagnosa Awal *
            </label>
            <textarea
              name="diagnosaAwal"
              value={formData.diagnosaAwal}
              onChange={handleChange}
              placeholder="Tulis diagnosa awal pasien"
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="flex space-x-4 pt-6">
            <button
              onClick={handleSubmit}
              disabled={loading || !formData.pasienId}
              className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Sedang memproses...' : 'Masukkan Pasien'}
            </button>
            <Link
              href="/dashboard/rawat-inap"
              className="flex-1 px-6 py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition font-medium text-center"
            >
              Batal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
