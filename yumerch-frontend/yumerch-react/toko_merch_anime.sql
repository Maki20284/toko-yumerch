-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 03, 2026 at 05:02 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `toko_merch_anime`
--

-- --------------------------------------------------------

--
-- Table structure for table `barang`
--

CREATE TABLE `barang` (
  `id_barang` int(11) NOT NULL,
  `kode_barang` varchar(30) NOT NULL,
  `nama_barang` varchar(150) NOT NULL,
  `id_kategori` int(11) NOT NULL,
  `harga` decimal(12,2) NOT NULL DEFAULT 0.00,
  `stok` int(11) NOT NULL DEFAULT 0,
  `gambar` varchar(255) DEFAULT NULL,
  `status` enum('tersedia','tidak_tersedia') NOT NULL DEFAULT 'tidak_tersedia',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `barang`
--

INSERT INTO `barang` (`id_barang`, `kode_barang`, `nama_barang`, `id_kategori`, `harga`, `stok`, `gambar`, `status`, `created_at`) VALUES
(1, 'FG-001', 'Nendoroid Gojo Satoru', 1, 450000.00, 8, 'gojo.jpg', 'tersedia', '2026-06-03 02:08:31'),
(2, 'FG-002', 'Figure Nezuko Kamado', 1, 380000.00, 15, 'nezuko.jpg', 'tersedia', '2026-06-03 02:08:31'),
(3, 'PS-001', 'Poster Attack on Titan A2', 2, 55000.00, 5, 'aot.jpg', 'tersedia', '2026-06-03 02:08:31'),
(4, 'PC-001', 'Photocard Set Frieren', 3, 35000.00, 8, 'frieren.jpg', 'tersedia', '2026-06-03 02:08:31'),
(5, 'AP-001', 'Kaos One Piece Luffy', 4, 120000.00, 8, 'luffy.jpg', 'tersedia', '2026-06-03 02:08:31');

-- --------------------------------------------------------

--
-- Table structure for table `kategori`
--

CREATE TABLE `kategori` (
  `id_kategori` int(11) NOT NULL,
  `nama_kategori` varchar(80) NOT NULL,
  `deskripsi` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `kategori`
--

INSERT INTO `kategori` (`id_kategori`, `nama_kategori`, `deskripsi`) VALUES
(1, 'Figure', 'Action figure dan nendoroid karakter anime'),
(2, 'Poster', 'Poster dan wall scroll'),
(3, 'Photocard', 'Photocard dan sticker'),
(4, 'Apparel', 'Kaos, hoodie, dan merchandise pakaian');

-- --------------------------------------------------------

--
-- Table structure for table `transaksi`
--

CREATE TABLE `transaksi` (
  `id_transaksi` int(11) NOT NULL,
  `id_barang` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `jenis` enum('masuk','keluar') NOT NULL,
  `jumlah` int(11) NOT NULL,
  `tanggal` date NOT NULL,
  `keterangan` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transaksi`
--

INSERT INTO `transaksi` (`id_transaksi`, `id_barang`, `id_user`, `jenis`, `jumlah`, `tanggal`, `keterangan`, `created_at`) VALUES
(1, 1, 2, 'masuk', 20, '2026-05-01', 'Stok awal', '2026-06-03 02:08:31'),
(2, 2, 2, 'masuk', 15, '2026-05-01', 'Stok awal', '2026-06-03 02:08:31'),
(3, 3, 2, 'masuk', 50, '2026-05-02', 'Restok poster', '2026-06-03 02:08:31'),
(4, 4, 2, 'masuk', 8, '2026-05-02', 'Stok awal', '2026-06-03 02:08:31'),
(5, 5, 2, 'masuk', 30, '2026-05-03', 'Stok awal', '2026-06-03 02:08:31'),
(6, 1, 3, 'keluar', 12, '2026-05-10', 'Penjualan', '2026-06-03 02:08:31'),
(7, 3, 3, 'keluar', 45, '2026-05-12', 'Penjualan event', '2026-06-03 02:08:31'),
(8, 5, 3, 'keluar', 22, '2026-05-15', 'Penjualan', '2026-06-03 02:08:31');

--
-- Triggers `transaksi`
--
DELIMITER $$
CREATE TRIGGER `trg_after_insert_transaksi` AFTER INSERT ON `transaksi` FOR EACH ROW BEGIN
  IF NEW.jenis = 'masuk' THEN
    UPDATE barang SET stok = stok + NEW.jumlah WHERE id_barang = NEW.id_barang;
  ELSE
    UPDATE barang SET stok = stok - NEW.jumlah WHERE id_barang = NEW.id_barang;
  END IF;

  UPDATE barang
    SET status = IF(stok > 0, 'tersedia', 'tidak_tersedia')
    WHERE id_barang = NEW.id_barang;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id_user` int(11) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('administrator','owner','staff') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id_user`, `nama`, `username`, `password`, `role`, `created_at`) VALUES
(1, 'Pemilik Toko', 'owner', 'owner123', 'owner', '2026-06-03 02:08:31'),
(2, 'Admin Gudang', 'admin', 'admin123', 'administrator', '2026-06-03 02:08:31'),
(3, 'Staff Kasir', 'staff', 'staff123', 'staff', '2026-06-03 02:08:31');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `barang`
--
ALTER TABLE `barang`
  ADD PRIMARY KEY (`id_barang`),
  ADD UNIQUE KEY `kode_barang` (`kode_barang`),
  ADD KEY `fk_barang_kategori` (`id_kategori`);

--
-- Indexes for table `kategori`
--
ALTER TABLE `kategori`
  ADD PRIMARY KEY (`id_kategori`);

--
-- Indexes for table `transaksi`
--
ALTER TABLE `transaksi`
  ADD PRIMARY KEY (`id_transaksi`),
  ADD KEY `fk_transaksi_barang` (`id_barang`),
  ADD KEY `fk_transaksi_user` (`id_user`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id_user`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `barang`
--
ALTER TABLE `barang`
  ADD CONSTRAINT `fk_barang_kategori` FOREIGN KEY (`id_kategori`) REFERENCES `kategori` (`id_kategori`) ON UPDATE CASCADE;

--
-- Constraints for table `transaksi`
--
ALTER TABLE `transaksi`
  ADD CONSTRAINT `fk_transaksi_barang` FOREIGN KEY (`id_barang`) REFERENCES `barang` (`id_barang`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_transaksi_user` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
