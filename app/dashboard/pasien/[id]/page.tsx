'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface DetailPasien {
  id: string;
  nomorRekamMedis: string;
  nama: string;
  nik: string;
  jenisIdentitas: string;
  tempatLahir: string;
  tanggalLahir: string;
  gender: string;
  agama: string;
  pekerjaan: string;
  noHP: string;
  email: string;
  alamat: string;
  kelurahan: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
  kodePOS: string;
  catatanMedis: string;
  kunjungan: Array<{
    id: string;
    tanggalKunjungan: string;
    keluhan: string;
    tipeKunjungan: string;
    diagnosis: string;
    terapi: string;
  }>;
  resep: Array<{
    id: string;
    nomorResep: string;
    tanggalResep: string;
    statusResep: string;
    dokterDinas: string;
  }>;
  rawatInap: Array<{
    id: string;
    tanggalMasuk: string;
    tanggalKeluar: string;
    statusRawatInap: string;
    kamar: { nomorKamar: string };
  }>;
}

export default function DetailPasienPage() {
  const params = useParams();
  const router = useRouter();
  const [pasien, setPasien] = useState<DetailPasien | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('info');

  useEffect(() => {
    fetchDetail();
  }, [params.id]);

  const fetchDetail = async () => {
    try {
      const response = await fetch(`/api/pasien/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setPasien(data);
      }
    } catch (error) {
      console.error('Error fetching detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (!pasien) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Data pasien tidak ditemukan</p>
        <Link
          href="/dashboard/pasien"
          className="text-primary-600 hover:underline mt-4"
        >
          Kembali ke daftar pasien
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{pasien.nama}</h1>
          <p className="text-gray-600 mt-1">RM: {pasien.nomorRekamMedis}</p>
        </div>
        <div className="space-x-2">
          <Link
            href={`/dashboard/pasien/${pasien.id}/edit`}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition inline-block"
          >
            Edit
          </Link>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
          >
            Kembali
          </button>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <p className="text-gray-600 text-sm">Usia</p>
            <p className="text-2xl font-bold text-gray-800">
              {calculateAge(pasien.tanggalLahir)} tahun
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Jenis Kelamin</p>
            <p className="text-2xl font-bold text-gray-800">
              {pasien.gender === 'LAKI_LAKI' ? 'Laki-laki' : 'Perempuan'}
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">No. Telepon</p>
            <p className="text-2xl font-bold text-gray-800">
              {pasien.noHP || '-'}
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Email</p>
            <p className="text-lg font-bold text-gray-800 truncate">
              {pasien.email || '-'}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b flex">
          {['info', 'kunjungan', 'resep', 'rawat_inap'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-6 py-4 font-medium transition ${
                tab === t
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {t === 'info' && 'Informasi'}
              {t === 'kunjungan' && 'Kunjungan'}
              {t === 'resep' && 'Resep'}
              {t === 'rawat_inap' && 'Rawat Inap'}
            </button>
          ))}
        </div>

        <div className="p-6">
          {tab === 'info' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-600 text-sm font-medium">NIK</p>
                  <p className="text-gray-800 mt-1">{pasien.nik}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-medium">
                    Tempat / Tanggal Lahir
                  </p>
                  <p className="text-gray-800 mt-1">
                    {pasien.tempatLahir} /{' '}
                    {new Date(pasien.tanggalLahir).toLocaleDateString('id-ID')}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-medium">Agama</p>
                  <p className="text-gray-800 mt-1">{pasien.agama}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-medium">Pekerjaan</p>
                  <p className="text-gray-800 mt-1">
                    {pasien.pekerjaan || '-'}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-gray-600 text-sm font-medium">Alamat</p>
                  <p className="text-gray-800 mt-1">{pasien.alamat}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-medium">Kelurahan</p>
                  <p className="text-gray-800 mt-1">
                    {pasien.kelurahan || '-'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-medium">Kecamatan</p>
                  <p className="text-gray-800 mt-1">
                    {pasien.kecamatan || '-'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-medium">Kabupaten</p>
                  <p className="text-gray-800 mt-1">
                    {pasien.kabupaten || '-'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-medium">Provinsi</p>
                  <p className="text-gray-800 mt-1">{pasien.provinsi || '-'}</p>
                </div>
              </div>
              {pasien.catatanMedis && (
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-2">
                    Catatan Medis
                  </p>
                  <div className="bg-gray-50 p-4 rounded border border-gray-200">
                    <p className="text-gray-800">{pasien.catatanMedis}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === 'kunjungan' && (
            <div className="space-y-4">
              {pasien.kunjungan.length === 0 ? (
                <p className="text-gray-600">Belum ada riwayat kunjungan</p>
              ) : (
                pasien.kunjungan.map((k) => (
                  <div
                    key={k.id}
                    className="bg-gray-50 p-4 rounded border border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-medium text-gray-800">
                        {new Date(k.tanggalKunjungan).toLocaleDateString(
                          'id-ID'
                        )}
                      </p>
                      <span className="px-2 py-1 bg-primary-100 text-primary-800 rounded text-xs font-medium">
                        {k.tipeKunjungan}
                      </span>
                    </div>
                    <p className="text-gray-700">
                      <span className="font-medium">Keluhan:</span> {k.keluhan}
                    </p>
                    {k.diagnosis && (
                      <p className="text-gray-700 mt-1">
                        <span className="font-medium">Diagnosis:</span>{' '}
                        {k.diagnosis}
                      </p>
                    )}
                    {k.terapi && (
                      <p className="text-gray-700 mt-1">
                        <span className="font-medium">Terapi:</span> {k.terapi}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
          {tab === 'resep' && (
            <div className="space-y-4">
              {pasien.resep.length === 0 ? (
                <p className="text-gray-600">Belum ada resep</p>
              ) : (
                pasien.resep.map((r) => (
                  <div
                    key={r.id}
                    className="bg-gray-50 p-4 rounded border border-gray-200"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-primary-600">
                          {r.nomorResep}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {new Date(r.tanggalResep).toLocaleDateString('id-ID')}{' '}
                          - Dr. {r.dokterDinas}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          r.statusResep === 'SELESAI'
                            ? 'bg-green-100 text-green-800'
                            : r.statusResep === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {r.statusResep}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
          {tab === 'rawat_inap' && (
            <div className="space-y-4">
              {pasien.rawatInap.length === 0 ? (
                <p className="text-gray-600">Belum ada riwayat rawat inap</p>
              ) : (
                pasien.rawatInap.map((r) => (
                  <div
                    key={r.id}
                    className="bg-gray-50 p-4 rounded border border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-gray-800">
                        Kamar: {r.kamar.nomorKamar}
                      </p>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          r.statusRawatInap === 'MASUK'
                            ? 'bg-primary-100 text-primary-800'
                            : r.statusRawatInap === 'PULANG'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {r.statusRawatInap}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Masuk:{' '}
                      {new Date(r.tanggalMasuk).toLocaleDateString('id-ID')}
                      {r.tanggalKeluar &&
                        ` - Keluar: ${new Date(
                          r.tanggalKeluar
                        ).toLocaleDateString('id-ID')}`}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
