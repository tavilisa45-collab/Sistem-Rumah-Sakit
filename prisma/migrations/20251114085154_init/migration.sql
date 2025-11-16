-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'DOKTER', 'FARMASI', 'LAB', 'RADIOLOGI', 'RAWAT_INAP', 'LOGISTIK', 'PERAWAT', 'RESEPSIONIS') NOT NULL DEFAULT 'RESEPSIONIS',
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `lastLogin` DATETIME(3) NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    INDEX `User_email_idx`(`email`),
    INDEX `User_role_idx`(`role`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AuditTrail` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `action` VARCHAR(191) NOT NULL,
    `modul` VARCHAR(191) NOT NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `AuditTrail_userId_idx`(`userId`),
    INDEX `AuditTrail_timestamp_idx`(`timestamp`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pasien` (
    `id` VARCHAR(191) NOT NULL,
    `nomorRekamMedis` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `nik` VARCHAR(191) NOT NULL,
    `jenisIdentitas` ENUM('KTP', 'PASPOR', 'BUKU_NIKAH', 'AKTA_KELAHIRAN') NOT NULL,
    `noIdentitas` VARCHAR(191) NOT NULL,
    `tempatLahir` VARCHAR(191) NOT NULL,
    `tanggalLahir` DATETIME(3) NOT NULL,
    `gender` ENUM('LAKI_LAKI', 'PEREMPUAN') NOT NULL,
    `agama` VARCHAR(191) NULL,
    `pekerjaan` VARCHAR(191) NULL,
    `noHP` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `alamat` VARCHAR(191) NOT NULL,
    `kelurahan` VARCHAR(191) NULL,
    `kecamatan` VARCHAR(191) NULL,
    `kabupaten` VARCHAR(191) NULL,
    `provinsi` VARCHAR(191) NULL,
    `kodePOS` VARCHAR(191) NULL,
    `namaOrangTua` VARCHAR(191) NULL,
    `hubunganDarurat` VARCHAR(191) NULL,
    `noHubunganDarurat` VARCHAR(191) NULL,
    `asuransi` VARCHAR(191) NULL,
    `noAsuransi` VARCHAR(191) NULL,
    `statusAsuransi` VARCHAR(191) NULL,
    `catatanMedis` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Pasien_nomorRekamMedis_key`(`nomorRekamMedis`),
    UNIQUE INDEX `Pasien_nik_key`(`nik`),
    UNIQUE INDEX `Pasien_noIdentitas_key`(`noIdentitas`),
    INDEX `Pasien_nomorRekamMedis_idx`(`nomorRekamMedis`),
    INDEX `Pasien_nik_idx`(`nik`),
    INDEX `Pasien_nama_idx`(`nama`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Kunjungan` (
    `id` VARCHAR(191) NOT NULL,
    `pasienId` VARCHAR(191) NOT NULL,
    `dokterDinas` VARCHAR(191) NULL,
    `keluhan` VARCHAR(191) NOT NULL,
    `tipeKunjungan` VARCHAR(191) NOT NULL,
    `diagnosis` VARCHAR(191) NULL,
    `terapi` VARCHAR(191) NULL,
    `tanggalKunjungan` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Kunjungan_pasienId_idx`(`pasienId`),
    INDEX `Kunjungan_tanggalKunjungan_idx`(`tanggalKunjungan`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Dokter` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `nip` VARCHAR(191) NOT NULL,
    `spesialisasi` VARCHAR(191) NOT NULL,
    `noSTR` VARCHAR(191) NULL,
    `noSIP` VARCHAR(191) NULL,
    `noHP` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Dokter_userId_key`(`userId`),
    UNIQUE INDEX `Dokter_nip_key`(`nip`),
    INDEX `Dokter_nip_idx`(`nip`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `JadwalDokter` (
    `id` VARCHAR(191) NOT NULL,
    `dokterID` VARCHAR(191) NOT NULL,
    `hari` VARCHAR(191) NOT NULL,
    `jamMulai` VARCHAR(191) NOT NULL,
    `jamSelesai` VARCHAR(191) NOT NULL,
    `poliklinik` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `JadwalDokter_dokterID_idx`(`dokterID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Obat` (
    `id` VARCHAR(191) NOT NULL,
    `kodeObat` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `jenis` VARCHAR(191) NOT NULL,
    `satuan` VARCHAR(191) NOT NULL,
    `harga` DOUBLE NOT NULL,
    `stokSekarang` INTEGER NOT NULL,
    `stokMinimal` INTEGER NOT NULL DEFAULT 10,
    `namaPabrik` VARCHAR(191) NULL,
    `nomorBatch` VARCHAR(191) NULL,
    `tanggalKadaluarsa` DATETIME(3) NULL,
    `deskripsi` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Obat_kodeObat_key`(`kodeObat`),
    INDEX `Obat_kodeObat_idx`(`kodeObat`),
    INDEX `Obat_nama_idx`(`nama`),
    INDEX `Obat_stokSekarang_idx`(`stokSekarang`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LogStokObat` (
    `id` VARCHAR(191) NOT NULL,
    `obatId` VARCHAR(191) NOT NULL,
    `tipe` VARCHAR(191) NOT NULL,
    `jumlah` INTEGER NOT NULL,
    `keterangan` VARCHAR(191) NULL,
    `tanggal` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `LogStokObat_obatId_idx`(`obatId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Resep` (
    `id` VARCHAR(191) NOT NULL,
    `nomorResep` VARCHAR(191) NOT NULL,
    `pasienId` VARCHAR(191) NOT NULL,
    `dokterDinas` VARCHAR(191) NOT NULL,
    `tanggalResep` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `catatanResep` VARCHAR(191) NULL,
    `statusResep` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Resep_nomorResep_key`(`nomorResep`),
    INDEX `Resep_pasienId_idx`(`pasienId`),
    INDEX `Resep_nomorResep_idx`(`nomorResep`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ResepObat` (
    `id` VARCHAR(191) NOT NULL,
    `resepId` VARCHAR(191) NOT NULL,
    `obatId` VARCHAR(191) NOT NULL,
    `jumlah` INTEGER NOT NULL,
    `aturan` VARCHAR(191) NOT NULL,

    INDEX `ResepObat_resepId_idx`(`resepId`),
    INDEX `ResepObat_obatId_idx`(`obatId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PermintaanLab` (
    `id` VARCHAR(191) NOT NULL,
    `nomorPermintaan` VARCHAR(191) NOT NULL,
    `pasienId` VARCHAR(191) NOT NULL,
    `dokterDinas` VARCHAR(191) NOT NULL,
    `jenisPermintaan` VARCHAR(191) NOT NULL,
    `tipePermeriksaan` VARCHAR(191) NOT NULL,
    `indikasi` VARCHAR(191) NULL,
    `prioritas` VARCHAR(191) NOT NULL DEFAULT 'NORMAL',
    `statusPermintaan` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    `tanggalPermintaan` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `PermintaanLab_nomorPermintaan_key`(`nomorPermintaan`),
    INDEX `PermintaanLab_pasienId_idx`(`pasienId`),
    INDEX `PermintaanLab_nomorPermintaan_idx`(`nomorPermintaan`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HasilLab` (
    `id` VARCHAR(191) NOT NULL,
    `nomorHasil` VARCHAR(191) NOT NULL,
    `permintaanId` VARCHAR(191) NOT NULL,
    `pasienId` VARCHAR(191) NOT NULL,
    `petugasInput` VARCHAR(191) NOT NULL,
    `hasil` VARCHAR(191) NOT NULL,
    `nilaiReferensi` VARCHAR(191) NULL,
    `kesimpulan` VARCHAR(191) NULL,
    `tanggalHasil` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `statusHasil` VARCHAR(191) NOT NULL DEFAULT 'PROSES',
    `fileHasil` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `HasilLab_nomorHasil_key`(`nomorHasil`),
    INDEX `HasilLab_pasienId_idx`(`pasienId`),
    INDEX `HasilLab_permintaanId_idx`(`permintaanId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Kamar` (
    `id` VARCHAR(191) NOT NULL,
    `nomorKamar` VARCHAR(191) NOT NULL,
    `tipeKamar` VARCHAR(191) NOT NULL,
    `kapasitas` INTEGER NOT NULL DEFAULT 1,
    `terisiSekarang` INTEGER NOT NULL DEFAULT 0,
    `hargaPerHari` DOUBLE NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'KOSONG',
    `fasilitas` VARCHAR(191) NULL,
    `catatan` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Kamar_nomorKamar_key`(`nomorKamar`),
    INDEX `Kamar_nomorKamar_idx`(`nomorKamar`),
    INDEX `Kamar_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RawatInap` (
    `id` VARCHAR(191) NOT NULL,
    `pasienId` VARCHAR(191) NOT NULL,
    `kamarId` VARCHAR(191) NOT NULL,
    `tanggalMasuk` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `tanggalKeluar` DATETIME(3) NULL,
    `diagnosaAwal` VARCHAR(191) NOT NULL,
    `statusRawatInap` VARCHAR(191) NOT NULL DEFAULT 'MASUK',
    `catatan` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `RawatInap_pasienId_idx`(`pasienId`),
    INDEX `RawatInap_kamarId_idx`(`kamarId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Visiasi` (
    `id` VARCHAR(191) NOT NULL,
    `rawatInapId` VARCHAR(191) NOT NULL,
    `pasienId` VARCHAR(191) NOT NULL,
    `dokterDinas` VARCHAR(191) NOT NULL,
    `tanggalVisite` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `subjektif` VARCHAR(191) NULL,
    `objektif` VARCHAR(191) NULL,
    `asesment` VARCHAR(191) NULL,
    `planning` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Visiasi_rawatInapId_idx`(`rawatInapId`),
    INDEX `Visiasi_pasienId_idx`(`pasienId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Barang` (
    `id` VARCHAR(191) NOT NULL,
    `kodeBarang` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `kategori` VARCHAR(191) NOT NULL,
    `satuan` VARCHAR(191) NOT NULL,
    `harga` DOUBLE NOT NULL,
    `stokSekarang` INTEGER NOT NULL,
    `stokMinimal` INTEGER NOT NULL DEFAULT 5,
    `lokasi` VARCHAR(191) NULL,
    `supplier` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Barang_kodeBarang_key`(`kodeBarang`),
    INDEX `Barang_kodeBarang_idx`(`kodeBarang`),
    INDEX `Barang_nama_idx`(`nama`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LogStokBarang` (
    `id` VARCHAR(191) NOT NULL,
    `barangId` VARCHAR(191) NOT NULL,
    `tipe` VARCHAR(191) NOT NULL,
    `jumlah` INTEGER NOT NULL,
    `keterangan` VARCHAR(191) NULL,
    `tanggal` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `LogStokBarang_barangId_idx`(`barangId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PermintaanBarang` (
    `id` VARCHAR(191) NOT NULL,
    `nomorPermintaan` VARCHAR(191) NOT NULL,
    `barangId` VARCHAR(191) NOT NULL,
    `unitPeminta` VARCHAR(191) NOT NULL,
    `jumlah` INTEGER NOT NULL,
    `keperluan` VARCHAR(191) NULL,
    `prioritas` VARCHAR(191) NOT NULL DEFAULT 'NORMAL',
    `statusPermintaan` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    `tanggalPermintaan` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `PermintaanBarang_nomorPermintaan_key`(`nomorPermintaan`),
    INDEX `PermintaanBarang_barangId_idx`(`barangId`),
    INDEX `PermintaanBarang_nomorPermintaan_idx`(`nomorPermintaan`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Statistik` (
    `id` VARCHAR(191) NOT NULL,
    `tipe` VARCHAR(191) NOT NULL,
    `bulan` INTEGER NOT NULL,
    `tahun` INTEGER NOT NULL,
    `jumlah` INTEGER NOT NULL,
    `data` VARCHAR(191) NULL,
    `lastUpdated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Statistik_tipe_bulan_tahun_key`(`tipe`, `bulan`, `tahun`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `AuditTrail` ADD CONSTRAINT `AuditTrail_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Kunjungan` ADD CONSTRAINT `Kunjungan_pasienId_fkey` FOREIGN KEY (`pasienId`) REFERENCES `Pasien`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Dokter` ADD CONSTRAINT `Dokter_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JadwalDokter` ADD CONSTRAINT `JadwalDokter_dokterID_fkey` FOREIGN KEY (`dokterID`) REFERENCES `Dokter`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LogStokObat` ADD CONSTRAINT `LogStokObat_obatId_fkey` FOREIGN KEY (`obatId`) REFERENCES `Obat`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Resep` ADD CONSTRAINT `Resep_pasienId_fkey` FOREIGN KEY (`pasienId`) REFERENCES `Pasien`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ResepObat` ADD CONSTRAINT `ResepObat_resepId_fkey` FOREIGN KEY (`resepId`) REFERENCES `Resep`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ResepObat` ADD CONSTRAINT `ResepObat_obatId_fkey` FOREIGN KEY (`obatId`) REFERENCES `Obat`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PermintaanLab` ADD CONSTRAINT `PermintaanLab_pasienId_fkey` FOREIGN KEY (`pasienId`) REFERENCES `Pasien`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HasilLab` ADD CONSTRAINT `HasilLab_permintaanId_fkey` FOREIGN KEY (`permintaanId`) REFERENCES `PermintaanLab`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HasilLab` ADD CONSTRAINT `HasilLab_pasienId_fkey` FOREIGN KEY (`pasienId`) REFERENCES `Pasien`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RawatInap` ADD CONSTRAINT `RawatInap_pasienId_fkey` FOREIGN KEY (`pasienId`) REFERENCES `Pasien`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RawatInap` ADD CONSTRAINT `RawatInap_kamarId_fkey` FOREIGN KEY (`kamarId`) REFERENCES `Kamar`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Visiasi` ADD CONSTRAINT `Visiasi_rawatInapId_fkey` FOREIGN KEY (`rawatInapId`) REFERENCES `RawatInap`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Visiasi` ADD CONSTRAINT `Visiasi_pasienId_fkey` FOREIGN KEY (`pasienId`) REFERENCES `Pasien`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LogStokBarang` ADD CONSTRAINT `LogStokBarang_barangId_fkey` FOREIGN KEY (`barangId`) REFERENCES `Barang`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PermintaanBarang` ADD CONSTRAINT `PermintaanBarang_barangId_fkey` FOREIGN KEY (`barangId`) REFERENCES `Barang`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
