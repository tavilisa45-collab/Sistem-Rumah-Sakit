import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

async function main() {
  console.log('🌱 Mulai seeding data...');

  // Hapus data lama
  await prisma.user.deleteMany();
  await prisma.pasien.deleteMany();
  await prisma.obat.deleteMany();
  await prisma.kamar.deleteMany();
  await prisma.barang.deleteMany();

  // 1. CREATE USERS
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@rs.com',
      password: await hashPassword('admin123'),
      nama: 'Admin Rumah Sakit',
      role: 'ADMIN',
      isActive: true,
    },
  });

  const dokterUser = await prisma.user.create({
    data: {
      email: 'dokter@rs.com',
      password: await hashPassword('dokter123'),
      nama: 'Dr. Budi Santoso, Sp.U',
      role: 'DOKTER',
      isActive: true,
    },
  });

  const farmasiUser = await prisma.user.create({
    data: {
      email: 'farmasi@rs.com',
      password: await hashPassword('farmasi123'),
      nama: 'Apt. Siti Nurhaliza',
      role: 'FARMASI',
      isActive: true,
    },
  });

  const labUser = await prisma.user.create({
    data: {
      email: 'lab@rs.com',
      password: await hashPassword('lab123'),
      nama: 'Analis Lab - Hendra',
      role: 'LAB',
      isActive: true,
    },
  });

  const rawatInapUser = await prisma.user.create({
    data: {
      email: 'rawatinap@rs.com',
      password: await hashPassword('rawatinap123'),
      nama: 'Perawat Rawat Inap',
      role: 'RAWAT_INAP',
      isActive: true,
    },
  });

  console.log('✅ Users dibuat');

  // 2. CREATE DOKTER PROFILE
  const dokter = await prisma.dokter.create({
    data: {
      userId: dokterUser.id,
      nip: '19750315200001001',
      spesialisasi: 'Urologi',
      noSTR: 'STR/0175/5/2020',
      noSIP: 'SIP/0175/5/2020',
      noHP: '081234567890',
    },
  });

  // 3. CREATE JADWAL DOKTER
  await prisma.jadwalDokter.create({
    data: {
      dokterID: dokter.id,
      hari: 'SENIN',
      jamMulai: '08:00',
      jamSelesai: '12:00',
      poliklinik: 'Poliklinik Urologi',
    },
  });

  await prisma.jadwalDokter.create({
    data: {
      dokterID: dokter.id,
      hari: 'RABU',
      jamMulai: '14:00',
      jamSelesai: '17:00',
      poliklinik: 'Poliklinik Urologi',
    },
  });

  console.log('✅ Dokter & Jadwal dibuat');

  // 4. CREATE PASIEN
  const pasien1 = await prisma.pasien.create({
    data: {
      nomorRekamMedis: 'RM240001',
      nama: 'Suryanto Wijaya',
      nik: '3273091985010001',
      jenisIdentitas: 'KTP',
      noIdentitas: '3273091985010001',
      tempatLahir: 'Bandung',
      tanggalLahir: new Date('1985-09-13'),
      gender: 'LAKI_LAKI',
      agama: 'Islam',
      pekerjaan: 'Wiraswasta',
      noHP: '081234567890',
      email: 'suryanto@email.com',
      alamat: 'Jl. Merdeka No. 123 RT 02 RW 05',
      kelurahan: 'Pasarkemis',
      kecamatan: 'Pasarkemis',
      kabupaten: 'Tangerang',
      provinsi: 'Banten',
      kodePOS: '15560',
    },
  });

  const pasien2 = await prisma.pasien.create({
    data: {
      nomorRekamMedis: 'RM240002',
      nama: 'Siti Maryam',
      nik: '3273091990050002',
      jenisIdentitas: 'KTP',
      noIdentitas: '3273091990050002',
      tempatLahir: 'Tangerang',
      tanggalLahir: new Date('1990-05-20'),
      gender: 'PEREMPUAN',
      agama: 'Islam',
      pekerjaan: 'PNS',
      noHP: '082345678901',
      email: 'siti@email.com',
      alamat: 'Jl. Sudirman No. 456',
      kelurahan: 'Solear',
      kecamatan: 'Pasarkemis',
      kabupaten: 'Tangerang',
      provinsi: 'Banten',
      kodePOS: '15560',
    },
  });

  console.log('✅ Pasien dibuat');

  // 5. CREATE KUNJUNGAN
  await prisma.kunjungan.create({
    data: {
      pasienId: pasien1.id,
      keluhan: 'Sakit saat buang air kecil',
      tipeKunjungan: 'RAWAT_JALAN',
      diagnosis: 'Infeksi saluran kemih',
      terapi: 'Antibiotik + Antiperadangan',
      dokterDinas: 'Dr. Budi Santoso, Sp.U',
      tanggalKunjungan: new Date(),
    },
  });

  console.log('✅ Kunjungan dibuat');

  // 6. CREATE OBAT
  const obat1 = await prisma.obat.create({
    data: {
      kodeObat: 'OBT001',
      nama: 'Amoksisilin 500mg',
      jenis: 'Antibiotik',
      satuan: 'TABLET',
      harga: 5000,
      stokSekarang: 100,
      stokMinimal: 20,
      namaPabrik: 'PT Pharma Indo',
      nomorBatch: 'B2024001',
    },
  });

  const obat2 = await prisma.obat.create({
    data: {
      kodeObat: 'OBT002',
      nama: 'Paracetamol 500mg',
      jenis: 'Analgesik',
      satuan: 'TABLET',
      harga: 2000,
      stokSekarang: 5,
      stokMinimal: 50,
      namaPabrik: 'PT Pharma Indo',
      nomorBatch: 'B2024002',
    },
  });

  const obat3 = await prisma.obat.create({
    data: {
      kodeObat: 'OBT003',
      nama: 'Ibuprofen 400mg',
      jenis: 'Analgesik & Antiradang',
      satuan: 'TABLET',
      harga: 3000,
      stokSekarang: 200,
      stokMinimal: 30,
      namaPabrik: 'PT Pharma Jaya',
      nomorBatch: 'B2024003',
    },
  });

  console.log('✅ Obat dibuat');

  // 7. CREATE RESEP
  const resep = await prisma.resep.create({
    data: {
      nomorResep: 'RX240001',
      pasienId: pasien1.id,
      dokterDinas: 'Dr. Budi Santoso, Sp.U',
      catatanResep: 'Diminum 3x sehari selama 7 hari',
      obat: {
        createMany: {
          data: [
            {
              obatId: obat1.id,
              jumlah: 21,
              aturan: '3x1 tablet setelah makan',
            },
            {
              obatId: obat3.id,
              jumlah: 14,
              aturan: '2x1 tablet setelah makan',
            },
          ],
        },
      },
    },
  });

  console.log('✅ Resep dibuat');

  // 8. CREATE KAMAR
  const kamar1 = await prisma.kamar.create({
    data: {
      nomorKamar: 'K-101',
      tipeKamar: 'KELAS_1',
      kapasitas: 1,
      terisiSekarang: 0,
      hargaPerHari: 500000,
      fasilitas: 'AC, TV, Kamar mandi pribadi',
    },
  });

  const kamar2 = await prisma.kamar.create({
    data: {
      nomorKamar: 'K-102',
      tipeKamar: 'KELAS_1',
      kapasitas: 1,
      terisiSekarang: 1,
      hargaPerHari: 500000,
      fasilitas: 'AC, TV, Kamar mandi pribadi',
      status: 'TERISI',
    },
  });

  const kamar3 = await prisma.kamar.create({
    data: {
      nomorKamar: 'K-201',
      tipeKamar: 'KELAS_2',
      kapasitas: 2,
      terisiSekarang: 1,
      hargaPerHari: 300000,
      fasilitas: 'AC, TV',
      status: 'TERISI',
    },
  });

  const kamar4 = await prisma.kamar.create({
    data: {
      nomorKamar: 'K-301',
      tipeKamar: 'KELAS_3',
      kapasitas: 3,
      terisiSekarang: 0,
      hargaPerHari: 150000,
      fasilitas: 'Kipas angin',
    },
  });

  console.log('✅ Kamar dibuat');

  // 9. CREATE RAWAT INAP
  const rawatInap = await prisma.rawatInap.create({
    data: {
      pasienId: pasien2.id,
      kamarId: kamar3.id,
      diagnosaAwal: 'Demam berdarah Dengue Grade II',
      statusRawatInap: 'MASUK',
    },
  });

  console.log('✅ Rawat Inap dibuat');

  // 10. CREATE VISITE
  await prisma.visiasi.create({
    data: {
      rawatInapId: rawatInap.id,
      pasienId: pasien2.id,
      dokterDinas: 'Dr. Budi Santoso, Sp.U',
      subjektif: 'Pasien mengeluh demam tinggi dan nyeri sendi',
      objektif: 'T: 39.5°C, N: 88x/menit, RR: 22x/menit, TD: 120/80 mmHg',
      asesment: 'DBD Grade II, Kondisi stabil',
      planning: 'Lanjutkan terapi, monitor vital signs, transfusi jika Hb < 10',
    },
  });

  console.log('✅ Visite dibuat');

  // 11. CREATE BARANG INVENTORY
  const barang1 = await prisma.barang.create({
    data: {
      kodeBarang: 'BRG001',
      nama: 'Spuit 3ml',
      kategori: 'ALAT_MEDIS',
      satuan: 'BOX',
      harga: 85000,
      stokSekarang: 50,
      stokMinimal: 20,
    },
  });

  const barang2 = await prisma.barang.create({
    data: {
      kodeBarang: 'BRG002',
      nama: 'Masker Medis (50 pcs)',
      kategori: 'BAHAN_HABIS',
      satuan: 'BOX',
      harga: 50000,
      stokSekarang: 10,
      stokMinimal: 30,
    },
  });

  const barang3 = await prisma.barang.create({
    data: {
      kodeBarang: 'BRG003',
      nama: 'Seprei Putih (per lusin)',
      kategori: 'LINEN',
      satuan: 'LUSIN',
      harga: 120000,
      stokSekarang: 100,
      stokMinimal: 50,
    },
  });

  console.log('✅ Barang Inventory dibuat');

  // 12. CREATE PERMINTAAN LAB
  const permintaanLab = await prisma.permintaanLab.create({
    data: {
      nomorPermintaan: 'PLB240001',
      pasienId: pasien2.id,
      dokterDinas: 'Dr. Budi Santoso, Sp.U',
      jenisPermintaan: 'LABORATORIUM',
      tipePermeriksaan: 'DARAH_LENGKAP',
      indikasi: 'Demam tinggi, curiga DBD',
      prioritas: 'URGENT',
    },
  });

  console.log('✅ Permintaan Lab dibuat');

  // 13. CREATE HASIL LAB
  await prisma.hasilLab.create({
    data: {
      nomorHasil: 'HAS240001',
      permintaanId: permintaanLab.id,
      pasienId: pasien2.id,
      petugasInput: 'Analis Lab - Hendra',
      hasil: JSON.stringify({
        hemoglobin: '11.5',
        leukosit: '8500',
        trombosit: '95000',
        hematokrit: '35%',
      }),
      kesimpulan: 'Sesuai dengan gambaran klinis DBD, Hematokrit meningkat',
    },
  });

  console.log('✅ Hasil Lab dibuat');

  // 14. CREATE AUDIT TRAIL
  await prisma.auditTrail.create({
    data: {
      userId: adminUser.id,
      action: 'SEED_DATA',
      modul: 'SYSTEM',
    },
  });

  console.log('✅ Audit Trail dibuat');

  console.log('');
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║      🎉 SEEDING DATA BERHASIL!                         ║');
  console.log('║                                                        ║');
  console.log('║  📧 Login Credentials:                                 ║');
  console.log('║  ────────────────────────────────────────────────────  ║');
  console.log('║  Admin:     admin@rs.com / admin123                   ║');
  console.log('║  Dokter:    dokter@rs.com / dokter123                 ║');
  console.log('║  Farmasi:   farmasi@rs.com / farmasi123               ║');
  console.log('║  Lab:       lab@rs.com / lab123                       ║');
  console.log('║  Rawat Inap: rawatinap@rs.com / rawatinap123          ║');
  console.log('║                                                        ║');
  console.log('║  📊 Data yang dibuat:                                  ║');
  console.log('║  ────────────────────────────────────────────────────  ║');
  console.log('║  ✓ 5 Users (multi-role)                               ║');
  console.log('║  ✓ 2 Pasien                                           ║');
  console.log('║  ✓ 3 Obat                                             ║');
  console.log('║  ✓ 4 Kamar                                            ║');
  console.log('║  ✓ 3 Barang Inventory                                 ║');
  console.log('║  ✓ 1 Resep                                            ║');
  console.log('║  ✓ 1 Permintaan Lab & Hasil                           ║');
  console.log('║  ✓ 1 Rawat Inap & Visite                              ║');
  console.log('║                                                        ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  console.log('');
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
