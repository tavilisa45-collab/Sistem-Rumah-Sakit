'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Pasien {
  id: string;
  nama: string;
  nomorRekamMedis: string;
}

interface Obat {
  id: string;
  namaObat: string;
  stokSekarang: number;
  satuan: string;
}

interface ObatItem {
  obatId: string;
  namaObat: string;
  jumlah: number;
  aturan: string;
  stokTersedia: number;
  satuan: string;
}

export default function BuatResepPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [pasienList, setPasienList] = useState<Pasien[]>([]);
  const [obatList, setObatList] = useState<Obat[]>([]);
  const [searchPasien, setSearchPasien] = useState('');
  const [searchObat, setSearchObat] = useState('');

  const [formData, setFormData] = useState({
    pasienId: '',
    dokterDinas: '',
    catatanResep: '',
  });

  const [selectedPasien, setSelectedPasien] = useState<Pasien | null>(null);
  const [obatItems, setObatItems] = useState<ObatItem[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchPasien();
    fetchObat();
  }, []);

  const fetchPasien = async () => {
    try {
      const response = await fetch('/api/pasien');
      if (response.ok) {
        const data = await response.json();
        setPasienList(Array.isArray(data.data) ? data.data : []);
      } else {
        setPasienList([]);
      }
    } catch (error) {
      console.error('Error fetching pasien:', error);
      setPasienList([]);
    }
  };

  const fetchObat = async () => {
    try {
      const response = await fetch('/api/farmasi/obat');
      if (response.ok) {
        const data = await response.json();
        setObatList(Array.isArray(data.data) ? data.data : []);
      } else {
        setObatList([]);
      }
    } catch (error) {
      console.error('Error fetching obat:', error);
      setObatList([]);
    }
  };

  const filteredPasien = pasienList.filter(
    (p) =>
      p?.nama?.toLowerCase().includes(searchPasien.toLowerCase()) ||
      p?.nomorRekamMedis?.toLowerCase().includes(searchPasien.toLowerCase())
  );

  const filteredObat = obatList.filter(
    (o) =>
      o?.namaObat?.toLowerCase().includes(searchObat.toLowerCase()) &&
      (o?.stokSekarang || 0) > 0
  );

  const handlePasienSelect = (pasien: Pasien) => {
    setSelectedPasien(pasien);
    setFormData({ ...formData, pasienId: pasien.id });
    setSearchPasien('');
    setErrors({ ...errors, pasienId: '' });
  };

  const handleAddObat = (obat: Obat) => {
    const exists = obatItems.find((item) => item.obatId === obat.id);
    if (exists) {
      alert('Obat sudah ditambahkan');
      return;
    }

    setObatItems([
      ...obatItems,
      {
        obatId: obat.id,
        namaObat: obat.namaObat,
        jumlah: 1,
        aturan: '',
        stokTersedia: obat.stokSekarang,
        satuan: obat.satuan,
      },
    ]);
    setSearchObat('');
    setErrors({ ...errors, obatItems: '' });
  };

  const handleObatChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const updated = [...obatItems];
    if (field === 'jumlah') {
      const jumlah = Number(value);
      if (jumlah > updated[index].stokTersedia) {
        alert(`Stok tidak mencukupi. Tersedia: ${updated[index].stokTersedia}`);
        return;
      }
      updated[index].jumlah = jumlah;
    } else {
      updated[index].aturan = value as string;
    }
    setObatItems(updated);
  };

  const handleRemoveObat = (index: number) => {
    setObatItems(obatItems.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.pasienId) {
      newErrors.pasienId = 'Pilih pasien terlebih dahulu';
    }
    if (!formData.dokterDinas.trim()) {
      newErrors.dokterDinas = 'Nama dokter harus diisi';
    }
    if (obatItems.length === 0) {
      newErrors.obatItems = 'Tambahkan minimal 1 obat';
    }

    obatItems.forEach((item, index) => {
      if (!item.aturan.trim()) {
        newErrors[`aturan_${index}`] = 'Aturan pakai harus diisi';
      }
      if (item.jumlah <= 0) {
        newErrors[`jumlah_${index}`] = 'Jumlah harus lebih dari 0';
      }
    });

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
      const payload = {
        ...formData,
        obatList: obatItems.map((item) => ({
          obatId: item.obatId,
          jumlah: item.jumlah,
          aturan: item.aturan,
        })),
      };

      const response = await fetch('/api/farmasi/resep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert('Resep berhasil dibuat!');
        router.push('/dashboard/farmasi/resep');
      } else {
        const error = await response.json();
        alert(error.error || 'Gagal membuat resep');
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Terjadi kesalahan saat membuat resep');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Buat Resep Baru</h1>
          <p className="text-gray-600 mt-1">Tambah resep obat untuk pasien</p>
        </div>
        <Link
          href="/dashboard/farmasi/resep"
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
        >
          ← Kembali
        </Link>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Pilih Pasien */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 primary-text">
            Data Pasien
          </h2>

          <div className="space-y-4">
            {selectedPasien ? (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">
                      {selectedPasien.nama}
                    </p>
                    <p className="text-sm text-gray-600">
                      No. RM: {selectedPasien.nomorRekamMedis}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPasien(null);
                      setFormData({ ...formData, pasienId: '' });
                    }}
                    className="text-red-600 hover:text-red-800"
                  >
                    Ganti
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cari Pasien
                </label>
                <input
                  type="text"
                  value={searchPasien}
                  onChange={(e) => setSearchPasien(e.target.value)}
                  placeholder="Cari nama atau nomor rekam medis..."
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                {searchPasien && (
                  <div className="mt-2 max-h-48 overflow-y-auto border rounded-lg">
                    {filteredPasien.length > 0 ? (
                      filteredPasien.map((pasien) => (
                        <button
                          key={pasien.id}
                          type="button"
                          onClick={() => handlePasienSelect(pasien)}
                          className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b last:border-b-0"
                        >
                          <p className="font-medium">{pasien.nama}</p>
                          <p className="text-sm text-gray-600">
                            No. RM: {pasien.nomorRekamMedis}
                          </p>
                        </button>
                      ))
                    ) : (
                      <p className="px-4 py-3 text-gray-500">
                        Pasien tidak ditemukan
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
            {errors.pasienId && (
              <p className="text-red-600 text-sm">{errors.pasienId}</p>
            )}
          </div>
        </div>

        {/* Dokter Dinas */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 primary-text">
            Dokter Pemeriksa
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Dokter Dinas *
            </label>
            <input
              type="text"
              value={formData.dokterDinas}
              onChange={(e) =>
                setFormData({ ...formData, dokterDinas: e.target.value })
              }
              placeholder="Masukkan nama dokter"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            {errors.dokterDinas && (
              <p className="text-red-600 text-sm mt-1">{errors.dokterDinas}</p>
            )}
          </div>
        </div>

        {/* Daftar Obat */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 primary-text">
            Daftar Obat
          </h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cari Obat
            </label>
            <input
              type="text"
              value={searchObat}
              onChange={(e) => setSearchObat(e.target.value)}
              placeholder="Cari nama obat..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            {searchObat && (
              <div className="mt-2 max-h-48 overflow-y-auto border rounded-lg">
                {filteredObat.length > 0 ? (
                  filteredObat.map((obat) => (
                    <button
                      key={obat.id}
                      type="button"
                      onClick={() => handleAddObat(obat)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b last:border-b-0"
                    >
                      <p className="font-medium">{obat.namaObat}</p>
                      <p className="text-sm text-gray-600">
                        Stok: {obat.stokSekarang} {obat.satuan}
                      </p>
                    </button>
                  ))
                ) : (
                  <p className="px-4 py-3 text-gray-500">
                    Obat tidak ditemukan
                  </p>
                )}
              </div>
            )}
          </div>

          {errors.obatItems && (
            <p className="text-red-600 text-sm mb-4">{errors.obatItems}</p>
          )}

          {/* Obat yang dipilih */}
          {obatItems.length > 0 && (
            <div className="space-y-3">
              {obatItems.map((item, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 border rounded-lg space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold">{item.namaObat}</p>
                      <p className="text-sm text-gray-600">
                        Stok: {item.stokTersedia} {item.satuan}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveObat(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Hapus
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Jumlah *
                      </label>
                      <input
                        type="number"
                        min="1"
                        max={item.stokTersedia}
                        value={item.jumlah}
                        onChange={(e) =>
                          handleObatChange(index, 'jumlah', e.target.value)
                        }
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      {errors[`jumlah_${index}`] && (
                        <p className="text-red-600 text-xs mt-1">
                          {errors[`jumlah_${index}`]}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Aturan Pakai *
                      </label>
                      <input
                        type="text"
                        value={item.aturan}
                        onChange={(e) =>
                          handleObatChange(index, 'aturan', e.target.value)
                        }
                        placeholder="Contoh: 3x1 sehari"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      {errors[`aturan_${index}`] && (
                        <p className="text-red-600 text-xs mt-1">
                          {errors[`aturan_${index}`]}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Catatan */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 primary-text">
            Catatan Tambahan
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Catatan Resep (Opsional)
            </label>
            <textarea
              value={formData.catatanResep}
              onChange={(e) =>
                setFormData({ ...formData, catatanResep: e.target.value })
              }
              rows={4}
              placeholder="Tambahkan catatan tambahan untuk resep ini..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Tombol Aksi */}
        <div className="flex items-center justify-end gap-4">
          <Link
            href="/dashboard/farmasi/resep"
            className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            )}
            {loading ? 'Menyimpan...' : 'Simpan Resep'}
          </button>
        </div>
      </form>
    </div>
  );
}
