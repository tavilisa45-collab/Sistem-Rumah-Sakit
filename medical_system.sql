-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 15 Nov 2025 pada 15.38
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.3.22

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `medical_system`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `audittrail`
--

CREATE TABLE `audittrail` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `action` varchar(191) NOT NULL,
  `modul` varchar(191) NOT NULL,
  `timestamp` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `audittrail`
--

INSERT INTO `audittrail` (`id`, `userId`, `action`, `modul`, `timestamp`) VALUES
('cmhyv75yg0012p0h4ssr9sshv', 'cmhyv75jp0000p0h45d4jeqte', 'SEED_DATA', 'SYSTEM', '2025-11-14 12:59:22.217'),
('cmhz6em4j0001p0hckb3b08e3', 'cmhyv75jp0000p0h45d4jeqte', 'LOGIN', 'AUTH', '2025-11-14 18:13:05.537'),
('cmhzauv940001p08k9bf571yq', 'cmhyv75jp0000p0h45d4jeqte', 'LOGIN', 'AUTH', '2025-11-14 20:17:42.326'),
('cmi01qm6e0001p04k479gu41l', 'cmhyv75jp0000p0h45d4jeqte', 'LOGIN', 'AUTH', '2025-11-15 08:50:13.568'),
('cmi02drqf0003p04kt5eqrn84', 'cmhyv75jp0000p0h45d4jeqte', 'LOGIN', 'AUTH', '2025-11-15 09:08:13.862'),
('cmi03blo90005p04knmyf5e2w', 'cmhyv75jp0000p0h45d4jeqte', 'LOGIN', 'AUTH', '2025-11-15 09:34:32.310'),
('cmi08oamh0007p04kgafdno1r', 'cmhyv75jp0000p0h45d4jeqte', 'LOGIN', 'AUTH', '2025-11-15 12:04:22.596');

-- --------------------------------------------------------

--
-- Struktur dari tabel `barang`
--

CREATE TABLE `barang` (
  `id` varchar(191) NOT NULL,
  `kodeBarang` varchar(191) NOT NULL,
  `nama` varchar(191) NOT NULL,
  `kategori` varchar(191) NOT NULL,
  `satuan` varchar(191) NOT NULL,
  `harga` double NOT NULL,
  `stokSekarang` int(11) NOT NULL,
  `stokMinimal` int(11) NOT NULL DEFAULT 5,
  `lokasi` varchar(191) DEFAULT NULL,
  `supplier` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `barang`
--

INSERT INTO `barang` (`id`, `kodeBarang`, `nama`, `kategori`, `satuan`, `harga`, `stokSekarang`, `stokMinimal`, `lokasi`, `supplier`, `createdAt`, `updatedAt`) VALUES
('cmhyv75xz000up0h4aaps932q', 'BRG001', 'Spuit 3ml', 'ALAT_MEDIS', 'BOX', 85000, 50, 20, NULL, NULL, '2025-11-14 12:59:22.200', '2025-11-14 12:59:22.200'),
('cmhyv75y3000vp0h4y3c26cqk', 'BRG002', 'Masker Medis (50 pcs)', 'BAHAN_HABIS', 'BOX', 50000, 10, 30, NULL, NULL, '2025-11-14 12:59:22.204', '2025-11-14 12:59:22.204'),
('cmhyv75y6000wp0h4vt9sctrp', 'BRG003', 'Seprei Putih (per lusin)', 'LINEN', 'LUSIN', 120000, 100, 50, NULL, NULL, '2025-11-14 12:59:22.207', '2025-11-14 12:59:22.207');

-- --------------------------------------------------------

--
-- Struktur dari tabel `dokter`
--

CREATE TABLE `dokter` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `nip` varchar(191) NOT NULL,
  `spesialisasi` varchar(191) NOT NULL,
  `noSTR` varchar(191) DEFAULT NULL,
  `noSIP` varchar(191) DEFAULT NULL,
  `noHP` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `dokter`
--

INSERT INTO `dokter` (`id`, `userId`, `nip`, `spesialisasi`, `noSTR`, `noSIP`, `noHP`, `createdAt`, `updatedAt`) VALUES
('cmhyv75vx0006p0h4sfu4d00a', 'cmhyv75mz0001p0h4307z7xs2', '19750315200001001', 'Urologi', 'STR/0175/5/2020', 'SIP/0175/5/2020', '081234567890', '2025-11-14 12:59:22.126', '2025-11-14 12:59:22.126');

-- --------------------------------------------------------

--
-- Struktur dari tabel `hasillab`
--

CREATE TABLE `hasillab` (
  `id` varchar(191) NOT NULL,
  `nomorHasil` varchar(191) NOT NULL,
  `permintaanId` varchar(191) NOT NULL,
  `pasienId` varchar(191) NOT NULL,
  `petugasInput` varchar(191) NOT NULL,
  `hasil` varchar(191) NOT NULL,
  `nilaiReferensi` varchar(191) DEFAULT NULL,
  `kesimpulan` varchar(191) DEFAULT NULL,
  `tanggalHasil` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `statusHasil` varchar(191) NOT NULL DEFAULT 'PROSES',
  `fileHasil` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `hasillab`
--

INSERT INTO `hasillab` (`id`, `nomorHasil`, `permintaanId`, `pasienId`, `petugasInput`, `hasil`, `nilaiReferensi`, `kesimpulan`, `tanggalHasil`, `statusHasil`, `fileHasil`, `createdAt`, `updatedAt`) VALUES
('cmhyv75yd0010p0h48di2cqji', 'HAS240001', 'cmhyv75y9000yp0h4ezghmduv', 'cmhyv75wh000cp0h4l2bf4mw2', 'Analis Lab - Hendra', '{\"hemoglobin\":\"11.5\",\"leukosit\":\"8500\",\"trombosit\":\"95000\",\"hematokrit\":\"35%\"}', NULL, 'Sesuai dengan gambaran klinis DBD, Hematokrit meningkat', '2025-11-14 12:59:22.213', 'PROSES', NULL, '2025-11-14 12:59:22.213', '2025-11-14 12:59:22.213');

-- --------------------------------------------------------

--
-- Struktur dari tabel `jadwaldokter`
--

CREATE TABLE `jadwaldokter` (
  `id` varchar(191) NOT NULL,
  `dokterID` varchar(191) NOT NULL,
  `hari` varchar(191) NOT NULL,
  `jamMulai` varchar(191) NOT NULL,
  `jamSelesai` varchar(191) NOT NULL,
  `poliklinik` varchar(191) NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `jadwaldokter`
--

INSERT INTO `jadwaldokter` (`id`, `dokterID`, `hari`, `jamMulai`, `jamSelesai`, `poliklinik`, `isActive`, `createdAt`, `updatedAt`) VALUES
('cmhyv75w10008p0h40ponoj1n', 'cmhyv75vx0006p0h4sfu4d00a', 'SENIN', '08:00', '12:00', 'Poliklinik Urologi', 1, '2025-11-14 12:59:22.129', '2025-11-14 12:59:22.129'),
('cmhyv75w5000ap0h4jweoqkbz', 'cmhyv75vx0006p0h4sfu4d00a', 'RABU', '14:00', '17:00', 'Poliklinik Urologi', 1, '2025-11-14 12:59:22.133', '2025-11-14 12:59:22.133');

-- --------------------------------------------------------

--
-- Struktur dari tabel `kamar`
--

CREATE TABLE `kamar` (
  `id` varchar(191) NOT NULL,
  `nomorKamar` varchar(191) NOT NULL,
  `tipeKamar` varchar(191) NOT NULL,
  `kapasitas` int(11) NOT NULL DEFAULT 1,
  `terisiSekarang` int(11) NOT NULL DEFAULT 0,
  `hargaPerHari` double NOT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'KOSONG',
  `fasilitas` varchar(191) DEFAULT NULL,
  `catatan` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `kamar`
--

INSERT INTO `kamar` (`id`, `nomorKamar`, `tipeKamar`, `kapasitas`, `terisiSekarang`, `hargaPerHari`, `status`, `fasilitas`, `catatan`, `createdAt`, `updatedAt`) VALUES
('cmhyv75xe000mp0h4aauw2a39', 'K-101', 'KELAS_1', 1, 0, 500000, 'KOSONG', 'AC, TV, Kamar mandi pribadi', NULL, '2025-11-14 12:59:22.179', '2025-11-14 12:59:22.179'),
('cmhyv75xi000np0h4qugsi34g', 'K-102', 'KELAS_1', 1, 1, 500000, 'TERISI', 'AC, TV, Kamar mandi pribadi', NULL, '2025-11-14 12:59:22.182', '2025-11-14 12:59:22.182'),
('cmhyv75xk000op0h45nyintle', 'K-201', 'KELAS_2', 2, 1, 300000, 'TERISI', 'AC, TV', NULL, '2025-11-14 12:59:22.185', '2025-11-14 12:59:22.185'),
('cmhyv75xn000pp0h4re7677cr', 'K-301', 'KELAS_3', 3, 0, 150000, 'KOSONG', 'Kipas angin', NULL, '2025-11-14 12:59:22.188', '2025-11-14 12:59:22.188');

-- --------------------------------------------------------

--
-- Struktur dari tabel `kunjungan`
--

CREATE TABLE `kunjungan` (
  `id` varchar(191) NOT NULL,
  `pasienId` varchar(191) NOT NULL,
  `dokterDinas` varchar(191) DEFAULT NULL,
  `keluhan` varchar(191) NOT NULL,
  `tipeKunjungan` varchar(191) NOT NULL,
  `diagnosis` varchar(191) DEFAULT NULL,
  `terapi` varchar(191) DEFAULT NULL,
  `tanggalKunjungan` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `kunjungan`
--

INSERT INTO `kunjungan` (`id`, `pasienId`, `dokterDinas`, `keluhan`, `tipeKunjungan`, `diagnosis`, `terapi`, `tanggalKunjungan`, `createdAt`, `updatedAt`) VALUES
('cmhyv75wn000ep0h4mg9f62yo', 'cmhyv75wb000bp0h4zxz4oqpx', 'Dr. Budi Santoso, Sp.U', 'Sakit saat buang air kecil', 'RAWAT_JALAN', 'Infeksi saluran kemih', 'Antibiotik + Antiperadangan', '2025-11-14 12:59:22.150', '2025-11-14 12:59:22.151', '2025-11-14 12:59:22.151');

-- --------------------------------------------------------

--
-- Struktur dari tabel `logstokbarang`
--

CREATE TABLE `logstokbarang` (
  `id` varchar(191) NOT NULL,
  `barangId` varchar(191) NOT NULL,
  `tipe` varchar(191) NOT NULL,
  `jumlah` int(11) NOT NULL,
  `keterangan` varchar(191) DEFAULT NULL,
  `tanggal` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `logstokobat`
--

CREATE TABLE `logstokobat` (
  `id` varchar(191) NOT NULL,
  `obatId` varchar(191) NOT NULL,
  `tipe` varchar(191) NOT NULL,
  `jumlah` int(11) NOT NULL,
  `keterangan` varchar(191) DEFAULT NULL,
  `tanggal` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `obat`
--

CREATE TABLE `obat` (
  `id` varchar(191) NOT NULL,
  `kodeObat` varchar(191) NOT NULL,
  `nama` varchar(191) NOT NULL,
  `jenis` varchar(191) NOT NULL,
  `satuan` varchar(191) NOT NULL,
  `harga` double NOT NULL,
  `stokSekarang` int(11) NOT NULL,
  `stokMinimal` int(11) NOT NULL DEFAULT 10,
  `namaPabrik` varchar(191) DEFAULT NULL,
  `nomorBatch` varchar(191) DEFAULT NULL,
  `tanggalKadaluarsa` datetime(3) DEFAULT NULL,
  `deskripsi` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `obat`
--

INSERT INTO `obat` (`id`, `kodeObat`, `nama`, `jenis`, `satuan`, `harga`, `stokSekarang`, `stokMinimal`, `namaPabrik`, `nomorBatch`, `tanggalKadaluarsa`, `deskripsi`, `createdAt`, `updatedAt`) VALUES
('cmhyv75wu000fp0h4yuabjtbp', 'OBT001', 'Amoksisilin 500mg', 'Antibiotik', 'TABLET', 5000, 100, 20, 'PT Pharma Indo', 'B2024001', NULL, NULL, '2025-11-14 12:59:22.159', '2025-11-14 12:59:22.159'),
('cmhyv75x0000gp0h4tyxzo0ks', 'OBT002', 'Paracetamol 500mg', 'Analgesik', 'TABLET', 2000, 5, 50, 'PT Pharma Indo', 'B2024002', NULL, NULL, '2025-11-14 12:59:22.164', '2025-11-14 12:59:22.164'),
('cmhyv75x2000hp0h4op8b8bo1', 'OBT003', 'Ibuprofen 400mg', 'Analgesik & Antiradang', 'TABLET', 3000, 200, 30, 'PT Pharma Jaya', 'B2024003', NULL, NULL, '2025-11-14 12:59:22.166', '2025-11-14 12:59:22.166');

-- --------------------------------------------------------

--
-- Struktur dari tabel `pasien`
--

CREATE TABLE `pasien` (
  `id` varchar(191) NOT NULL,
  `nomorRekamMedis` varchar(191) NOT NULL,
  `nama` varchar(191) NOT NULL,
  `nik` varchar(191) NOT NULL,
  `jenisIdentitas` enum('KTP','PASPOR','BUKU_NIKAH','AKTA_KELAHIRAN') NOT NULL,
  `noIdentitas` varchar(191) NOT NULL,
  `tempatLahir` varchar(191) NOT NULL,
  `tanggalLahir` datetime(3) NOT NULL,
  `gender` enum('LAKI_LAKI','PEREMPUAN') NOT NULL,
  `agama` varchar(191) DEFAULT NULL,
  `pekerjaan` varchar(191) DEFAULT NULL,
  `noHP` varchar(191) DEFAULT NULL,
  `email` varchar(191) DEFAULT NULL,
  `alamat` varchar(191) NOT NULL,
  `kelurahan` varchar(191) DEFAULT NULL,
  `kecamatan` varchar(191) DEFAULT NULL,
  `kabupaten` varchar(191) DEFAULT NULL,
  `provinsi` varchar(191) DEFAULT NULL,
  `kodePOS` varchar(191) DEFAULT NULL,
  `namaOrangTua` varchar(191) DEFAULT NULL,
  `hubunganDarurat` varchar(191) DEFAULT NULL,
  `noHubunganDarurat` varchar(191) DEFAULT NULL,
  `asuransi` varchar(191) DEFAULT NULL,
  `noAsuransi` varchar(191) DEFAULT NULL,
  `statusAsuransi` varchar(191) DEFAULT NULL,
  `catatanMedis` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `pasien`
--

INSERT INTO `pasien` (`id`, `nomorRekamMedis`, `nama`, `nik`, `jenisIdentitas`, `noIdentitas`, `tempatLahir`, `tanggalLahir`, `gender`, `agama`, `pekerjaan`, `noHP`, `email`, `alamat`, `kelurahan`, `kecamatan`, `kabupaten`, `provinsi`, `kodePOS`, `namaOrangTua`, `hubunganDarurat`, `noHubunganDarurat`, `asuransi`, `noAsuransi`, `statusAsuransi`, `catatanMedis`, `createdAt`, `updatedAt`) VALUES
('cmhyv75wb000bp0h4zxz4oqpx', 'RM240001', 'Suryanto Wijaya', '3273091985010001', 'KTP', '3273091985010001', 'Bandung', '1985-09-13 00:00:00.000', 'LAKI_LAKI', 'Islam', 'Wiraswasta', '081234567890', 'suryanto@email.com', 'Jl. Merdeka No. 123 RT 02 RW 05', 'Pasarkemis', 'Pasarkemis', 'Tangerang', 'Banten', '15560', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-14 12:59:22.140', '2025-11-14 12:59:22.140'),
('cmhyv75wh000cp0h4l2bf4mw2', 'RM240002', 'Siti Maryam', '3273091990050002', 'KTP', '3273091990050002', 'Tangerang', '1990-05-20 00:00:00.000', 'PEREMPUAN', 'Islam', 'PNS', '082345678901', 'siti@email.com', 'Jl. Sudirman No. 456', 'Solear', 'Pasarkemis', 'Tangerang', 'Banten', '15560', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-14 12:59:22.145', '2025-11-14 12:59:22.145');

-- --------------------------------------------------------

--
-- Struktur dari tabel `permintaanbarang`
--

CREATE TABLE `permintaanbarang` (
  `id` varchar(191) NOT NULL,
  `nomorPermintaan` varchar(191) NOT NULL,
  `barangId` varchar(191) NOT NULL,
  `unitPeminta` varchar(191) NOT NULL,
  `jumlah` int(11) NOT NULL,
  `keperluan` varchar(191) DEFAULT NULL,
  `prioritas` varchar(191) NOT NULL DEFAULT 'NORMAL',
  `statusPermintaan` varchar(191) NOT NULL DEFAULT 'PENDING',
  `tanggalPermintaan` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `permintaanlab`
--

CREATE TABLE `permintaanlab` (
  `id` varchar(191) NOT NULL,
  `nomorPermintaan` varchar(191) NOT NULL,
  `pasienId` varchar(191) NOT NULL,
  `dokterDinas` varchar(191) NOT NULL,
  `jenisPermintaan` varchar(191) NOT NULL,
  `tipePermeriksaan` varchar(191) NOT NULL,
  `indikasi` varchar(191) DEFAULT NULL,
  `prioritas` varchar(191) NOT NULL DEFAULT 'NORMAL',
  `statusPermintaan` varchar(191) NOT NULL DEFAULT 'PENDING',
  `tanggalPermintaan` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `permintaanlab`
--

INSERT INTO `permintaanlab` (`id`, `nomorPermintaan`, `pasienId`, `dokterDinas`, `jenisPermintaan`, `tipePermeriksaan`, `indikasi`, `prioritas`, `statusPermintaan`, `tanggalPermintaan`, `createdAt`, `updatedAt`) VALUES
('cmhyv75y9000yp0h4ezghmduv', 'PLB240001', 'cmhyv75wh000cp0h4l2bf4mw2', 'Dr. Budi Santoso, Sp.U', 'LABORATORIUM', 'DARAH_LENGKAP', 'Demam tinggi, curiga DBD', 'URGENT', 'PENDING', '2025-11-14 12:59:22.209', '2025-11-14 12:59:22.209', '2025-11-14 12:59:22.209');

-- --------------------------------------------------------

--
-- Struktur dari tabel `rawatinap`
--

CREATE TABLE `rawatinap` (
  `id` varchar(191) NOT NULL,
  `pasienId` varchar(191) NOT NULL,
  `kamarId` varchar(191) NOT NULL,
  `tanggalMasuk` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `tanggalKeluar` datetime(3) DEFAULT NULL,
  `diagnosaAwal` varchar(191) NOT NULL,
  `statusRawatInap` varchar(191) NOT NULL DEFAULT 'MASUK',
  `catatan` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `rawatinap`
--

INSERT INTO `rawatinap` (`id`, `pasienId`, `kamarId`, `tanggalMasuk`, `tanggalKeluar`, `diagnosaAwal`, `statusRawatInap`, `catatan`, `createdAt`, `updatedAt`) VALUES
('cmhyv75xq000rp0h4r363a8ir', 'cmhyv75wh000cp0h4l2bf4mw2', 'cmhyv75xk000op0h45nyintle', '2025-11-14 12:59:22.191', NULL, 'Demam berdarah Dengue Grade II', 'MASUK', NULL, '2025-11-14 12:59:22.191', '2025-11-14 12:59:22.191');

-- --------------------------------------------------------

--
-- Struktur dari tabel `resep`
--

CREATE TABLE `resep` (
  `id` varchar(191) NOT NULL,
  `nomorResep` varchar(191) NOT NULL,
  `pasienId` varchar(191) NOT NULL,
  `dokterDinas` varchar(191) NOT NULL,
  `tanggalResep` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `catatanResep` varchar(191) DEFAULT NULL,
  `statusResep` varchar(191) NOT NULL DEFAULT 'PENDING',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `resep`
--

INSERT INTO `resep` (`id`, `nomorResep`, `pasienId`, `dokterDinas`, `tanggalResep`, `catatanResep`, `statusResep`, `createdAt`, `updatedAt`) VALUES
('cmhyv75x5000jp0h4v0vqkp1m', 'RX240001', 'cmhyv75wb000bp0h4zxz4oqpx', 'Dr. Budi Santoso, Sp.U', '2025-11-14 12:59:22.170', 'Diminum 3x sehari selama 7 hari', 'PENDING', '2025-11-14 12:59:22.170', '2025-11-14 12:59:22.170');

-- --------------------------------------------------------

--
-- Struktur dari tabel `resepobat`
--

CREATE TABLE `resepobat` (
  `id` varchar(191) NOT NULL,
  `resepId` varchar(191) NOT NULL,
  `obatId` varchar(191) NOT NULL,
  `jumlah` int(11) NOT NULL,
  `aturan` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `resepobat`
--

INSERT INTO `resepobat` (`id`, `resepId`, `obatId`, `jumlah`, `aturan`) VALUES
('cmhyv75x6000kp0h4lyjpj7j1', 'cmhyv75x5000jp0h4v0vqkp1m', 'cmhyv75wu000fp0h4yuabjtbp', 21, '3x1 tablet setelah makan'),
('cmhyv75x6000lp0h48c63hsyf', 'cmhyv75x5000jp0h4v0vqkp1m', 'cmhyv75x2000hp0h4op8b8bo1', 14, '2x1 tablet setelah makan');

-- --------------------------------------------------------

--
-- Struktur dari tabel `statistik`
--

CREATE TABLE `statistik` (
  `id` varchar(191) NOT NULL,
  `tipe` varchar(191) NOT NULL,
  `bulan` int(11) NOT NULL,
  `tahun` int(11) NOT NULL,
  `jumlah` int(11) NOT NULL,
  `data` varchar(191) DEFAULT NULL,
  `lastUpdated` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `user`
--

CREATE TABLE `user` (
  `id` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `password` varchar(191) NOT NULL,
  `nama` varchar(191) NOT NULL,
  `role` enum('ADMIN','DOKTER','FARMASI','LAB','RADIOLOGI','RAWAT_INAP','LOGISTIK','PERAWAT','RESEPSIONIS') NOT NULL DEFAULT 'RESEPSIONIS',
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `lastLogin` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `user`
--

INSERT INTO `user` (`id`, `email`, `password`, `nama`, `role`, `isActive`, `createdAt`, `updatedAt`, `lastLogin`) VALUES
('cmhyv75jp0000p0h45d4jeqte', 'admin@rs.com', '$2b$10$X3SVyA7DNNivFCcV272As.RDiHeUB16tHpCEd9bqzJ7LHCNJMDPb2', 'Admin Rumah Sakit', 'ADMIN', 1, '2025-11-14 12:59:21.685', '2025-11-15 12:04:22.375', '2025-11-15 12:04:22.355'),
('cmhyv75mz0001p0h4307z7xs2', 'dokter@rs.com', '$2b$10$xNtDXgmwHkCat.Yc44.k8u6F7pPZ8q2.hQutXh7SrSWvdSalunWFi', 'Dr. Budi Santoso, Sp.U', 'DOKTER', 1, '2025-11-14 12:59:21.804', '2025-11-14 12:59:21.804', NULL),
('cmhyv75q00002p0h43iu37j9t', 'farmasi@rs.com', '$2b$10$uARhPiQe45J559/pERq3G.u.lkCZTz0mdb8Y5J3rksDRoN9U2y.SS', 'Apt. Siti Nurhaliza', 'FARMASI', 1, '2025-11-14 12:59:21.912', '2025-11-14 12:59:21.912', NULL),
('cmhyv75t30003p0h432boz16h', 'lab@rs.com', '$2b$10$wS4nmnTqns7fNDYXYpYwWuC6UP1svWFN4tve.buifQt19E2NqA6cC', 'Analis Lab - Hendra', 'LAB', 1, '2025-11-14 12:59:22.023', '2025-11-14 12:59:22.023', NULL),
('cmhyv75vu0004p0h4gramhru3', 'rawatinap@rs.com', '$2b$10$hjAW/hSA1xWfC0Y3KM/Og.Ss4J26mDSgtzMbmEu3FUSYjWIhEuY4O', 'Perawat Rawat Inap', 'RAWAT_INAP', 1, '2025-11-14 12:59:22.123', '2025-11-14 12:59:22.123', NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `visiasi`
--

CREATE TABLE `visiasi` (
  `id` varchar(191) NOT NULL,
  `rawatInapId` varchar(191) NOT NULL,
  `pasienId` varchar(191) NOT NULL,
  `dokterDinas` varchar(191) NOT NULL,
  `tanggalVisite` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `subjektif` varchar(191) DEFAULT NULL,
  `objektif` varchar(191) DEFAULT NULL,
  `asesment` varchar(191) DEFAULT NULL,
  `planning` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `visiasi`
--

INSERT INTO `visiasi` (`id`, `rawatInapId`, `pasienId`, `dokterDinas`, `tanggalVisite`, `subjektif`, `objektif`, `asesment`, `planning`, `createdAt`, `updatedAt`) VALUES
('cmhyv75xv000tp0h410wh7fgp', 'cmhyv75xq000rp0h4r363a8ir', 'cmhyv75wh000cp0h4l2bf4mw2', 'Dr. Budi Santoso, Sp.U', '2025-11-14 12:59:22.196', 'Pasien mengeluh demam tinggi dan nyeri sendi', 'T: 39.5°C, N: 88x/menit, RR: 22x/menit, TD: 120/80 mmHg', 'DBD Grade II, Kondisi stabil', 'Lanjutkan terapi, monitor vital signs, transfusi jika Hb < 10', '2025-11-14 12:59:22.196', '2025-11-14 12:59:22.196');

-- --------------------------------------------------------

--
-- Struktur dari tabel `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) NOT NULL,
  `checksum` varchar(64) NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) NOT NULL,
  `logs` text DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('5273e445-69b9-4d7e-b0ea-12498cd91132', '5ce3a4db931089128d940db75b783be4e375e1e3a4084f535a37bb8b96e3abb1', '2025-11-14 08:51:55.656', '20251114085154_init', NULL, NULL, '2025-11-14 08:51:54.823', 1);

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `audittrail`
--
ALTER TABLE `audittrail`
  ADD PRIMARY KEY (`id`),
  ADD KEY `AuditTrail_userId_idx` (`userId`),
  ADD KEY `AuditTrail_timestamp_idx` (`timestamp`);

--
-- Indeks untuk tabel `barang`
--
ALTER TABLE `barang`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Barang_kodeBarang_key` (`kodeBarang`),
  ADD KEY `Barang_kodeBarang_idx` (`kodeBarang`),
  ADD KEY `Barang_nama_idx` (`nama`);

--
-- Indeks untuk tabel `dokter`
--
ALTER TABLE `dokter`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Dokter_userId_key` (`userId`),
  ADD UNIQUE KEY `Dokter_nip_key` (`nip`),
  ADD KEY `Dokter_nip_idx` (`nip`);

--
-- Indeks untuk tabel `hasillab`
--
ALTER TABLE `hasillab`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `HasilLab_nomorHasil_key` (`nomorHasil`),
  ADD KEY `HasilLab_pasienId_idx` (`pasienId`),
  ADD KEY `HasilLab_permintaanId_idx` (`permintaanId`);

--
-- Indeks untuk tabel `jadwaldokter`
--
ALTER TABLE `jadwaldokter`
  ADD PRIMARY KEY (`id`),
  ADD KEY `JadwalDokter_dokterID_idx` (`dokterID`);

--
-- Indeks untuk tabel `kamar`
--
ALTER TABLE `kamar`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Kamar_nomorKamar_key` (`nomorKamar`),
  ADD KEY `Kamar_nomorKamar_idx` (`nomorKamar`),
  ADD KEY `Kamar_status_idx` (`status`);

--
-- Indeks untuk tabel `kunjungan`
--
ALTER TABLE `kunjungan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Kunjungan_pasienId_idx` (`pasienId`),
  ADD KEY `Kunjungan_tanggalKunjungan_idx` (`tanggalKunjungan`);

--
-- Indeks untuk tabel `logstokbarang`
--
ALTER TABLE `logstokbarang`
  ADD PRIMARY KEY (`id`),
  ADD KEY `LogStokBarang_barangId_idx` (`barangId`);

--
-- Indeks untuk tabel `logstokobat`
--
ALTER TABLE `logstokobat`
  ADD PRIMARY KEY (`id`),
  ADD KEY `LogStokObat_obatId_idx` (`obatId`);

--
-- Indeks untuk tabel `obat`
--
ALTER TABLE `obat`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Obat_kodeObat_key` (`kodeObat`),
  ADD KEY `Obat_kodeObat_idx` (`kodeObat`),
  ADD KEY `Obat_nama_idx` (`nama`),
  ADD KEY `Obat_stokSekarang_idx` (`stokSekarang`);

--
-- Indeks untuk tabel `pasien`
--
ALTER TABLE `pasien`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Pasien_nomorRekamMedis_key` (`nomorRekamMedis`),
  ADD UNIQUE KEY `Pasien_nik_key` (`nik`),
  ADD UNIQUE KEY `Pasien_noIdentitas_key` (`noIdentitas`),
  ADD KEY `Pasien_nomorRekamMedis_idx` (`nomorRekamMedis`),
  ADD KEY `Pasien_nik_idx` (`nik`),
  ADD KEY `Pasien_nama_idx` (`nama`);

--
-- Indeks untuk tabel `permintaanbarang`
--
ALTER TABLE `permintaanbarang`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `PermintaanBarang_nomorPermintaan_key` (`nomorPermintaan`),
  ADD KEY `PermintaanBarang_barangId_idx` (`barangId`),
  ADD KEY `PermintaanBarang_nomorPermintaan_idx` (`nomorPermintaan`);

--
-- Indeks untuk tabel `permintaanlab`
--
ALTER TABLE `permintaanlab`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `PermintaanLab_nomorPermintaan_key` (`nomorPermintaan`),
  ADD KEY `PermintaanLab_pasienId_idx` (`pasienId`),
  ADD KEY `PermintaanLab_nomorPermintaan_idx` (`nomorPermintaan`);

--
-- Indeks untuk tabel `rawatinap`
--
ALTER TABLE `rawatinap`
  ADD PRIMARY KEY (`id`),
  ADD KEY `RawatInap_pasienId_idx` (`pasienId`),
  ADD KEY `RawatInap_kamarId_idx` (`kamarId`);

--
-- Indeks untuk tabel `resep`
--
ALTER TABLE `resep`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Resep_nomorResep_key` (`nomorResep`),
  ADD KEY `Resep_pasienId_idx` (`pasienId`),
  ADD KEY `Resep_nomorResep_idx` (`nomorResep`);

--
-- Indeks untuk tabel `resepobat`
--
ALTER TABLE `resepobat`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ResepObat_resepId_idx` (`resepId`),
  ADD KEY `ResepObat_obatId_idx` (`obatId`);

--
-- Indeks untuk tabel `statistik`
--
ALTER TABLE `statistik`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Statistik_tipe_bulan_tahun_key` (`tipe`,`bulan`,`tahun`);

--
-- Indeks untuk tabel `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `User_email_key` (`email`),
  ADD KEY `User_email_idx` (`email`),
  ADD KEY `User_role_idx` (`role`);

--
-- Indeks untuk tabel `visiasi`
--
ALTER TABLE `visiasi`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Visiasi_rawatInapId_idx` (`rawatInapId`),
  ADD KEY `Visiasi_pasienId_idx` (`pasienId`);

--
-- Indeks untuk tabel `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `audittrail`
--
ALTER TABLE `audittrail`
  ADD CONSTRAINT `AuditTrail_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `dokter`
--
ALTER TABLE `dokter`
  ADD CONSTRAINT `Dokter_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `hasillab`
--
ALTER TABLE `hasillab`
  ADD CONSTRAINT `HasilLab_pasienId_fkey` FOREIGN KEY (`pasienId`) REFERENCES `pasien` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `HasilLab_permintaanId_fkey` FOREIGN KEY (`permintaanId`) REFERENCES `permintaanlab` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `jadwaldokter`
--
ALTER TABLE `jadwaldokter`
  ADD CONSTRAINT `JadwalDokter_dokterID_fkey` FOREIGN KEY (`dokterID`) REFERENCES `dokter` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `kunjungan`
--
ALTER TABLE `kunjungan`
  ADD CONSTRAINT `Kunjungan_pasienId_fkey` FOREIGN KEY (`pasienId`) REFERENCES `pasien` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `logstokbarang`
--
ALTER TABLE `logstokbarang`
  ADD CONSTRAINT `LogStokBarang_barangId_fkey` FOREIGN KEY (`barangId`) REFERENCES `barang` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `logstokobat`
--
ALTER TABLE `logstokobat`
  ADD CONSTRAINT `LogStokObat_obatId_fkey` FOREIGN KEY (`obatId`) REFERENCES `obat` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `permintaanbarang`
--
ALTER TABLE `permintaanbarang`
  ADD CONSTRAINT `PermintaanBarang_barangId_fkey` FOREIGN KEY (`barangId`) REFERENCES `barang` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `permintaanlab`
--
ALTER TABLE `permintaanlab`
  ADD CONSTRAINT `PermintaanLab_pasienId_fkey` FOREIGN KEY (`pasienId`) REFERENCES `pasien` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `rawatinap`
--
ALTER TABLE `rawatinap`
  ADD CONSTRAINT `RawatInap_kamarId_fkey` FOREIGN KEY (`kamarId`) REFERENCES `kamar` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `RawatInap_pasienId_fkey` FOREIGN KEY (`pasienId`) REFERENCES `pasien` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `resep`
--
ALTER TABLE `resep`
  ADD CONSTRAINT `Resep_pasienId_fkey` FOREIGN KEY (`pasienId`) REFERENCES `pasien` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `resepobat`
--
ALTER TABLE `resepobat`
  ADD CONSTRAINT `ResepObat_obatId_fkey` FOREIGN KEY (`obatId`) REFERENCES `obat` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ResepObat_resepId_fkey` FOREIGN KEY (`resepId`) REFERENCES `resep` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `visiasi`
--
ALTER TABLE `visiasi`
  ADD CONSTRAINT `Visiasi_pasienId_fkey` FOREIGN KEY (`pasienId`) REFERENCES `pasien` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Visiasi_rawatInapId_fkey` FOREIGN KEY (`rawatInapId`) REFERENCES `rawatinap` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
