// Membuat database, tabel, dan data awal (dari toko_merch_anime.sql) dengan password ter-hash.
// Jalankan: npm run init-db
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const DB = process.env.DB_NAME || 'toko_merch_anime';

const run = async () => {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true,
  });

  console.log('Membuat database & tabel…');
  await conn.query(`CREATE DATABASE IF NOT EXISTS \`${DB}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;`);
  await conn.query(`USE \`${DB}\`;`);

  await conn.query(`
    SET FOREIGN_KEY_CHECKS = 0;
    DROP TABLE IF EXISTS transaksi;
    DROP TABLE IF EXISTS barang;
    DROP TABLE IF EXISTS kategori;
    DROP TABLE IF EXISTS users;
    SET FOREIGN_KEY_CHECKS = 1;

    CREATE TABLE kategori (
      id_kategori INT(11) NOT NULL AUTO_INCREMENT,
      nama_kategori VARCHAR(80) NOT NULL,
      deskripsi TEXT NULL,
      PRIMARY KEY (id_kategori)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

    CREATE TABLE users (
      id_user INT(11) NOT NULL AUTO_INCREMENT,
      nama VARCHAR(100) NOT NULL,
      username VARCHAR(50) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role ENUM('administrator','owner','staff') NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id_user)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

    CREATE TABLE barang (
      id_barang INT(11) NOT NULL AUTO_INCREMENT,
      kode_barang VARCHAR(30) NOT NULL UNIQUE,
      nama_barang VARCHAR(150) NOT NULL,
      id_kategori INT(11) NOT NULL,
      harga DECIMAL(12,2) NOT NULL DEFAULT 0.00,
      stok INT(11) NOT NULL DEFAULT 0,
      gambar VARCHAR(255) NULL,
      status ENUM('tersedia','tidak_tersedia') NOT NULL DEFAULT 'tidak_tersedia',
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id_barang),
      CONSTRAINT fk_barang_kategori FOREIGN KEY (id_kategori) REFERENCES kategori (id_kategori) ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

    CREATE TABLE transaksi (
      id_transaksi INT(11) NOT NULL AUTO_INCREMENT,
      id_barang INT(11) NOT NULL,
      id_user INT(11) NOT NULL,
      jenis ENUM('masuk','keluar') NOT NULL,
      jumlah INT(11) NOT NULL,
      tanggal DATE NOT NULL,
      keterangan VARCHAR(255) NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id_transaksi),
      CONSTRAINT fk_transaksi_barang FOREIGN KEY (id_barang) REFERENCES barang (id_barang) ON DELETE CASCADE ON UPDATE CASCADE,
      CONSTRAINT fk_transaksi_user FOREIGN KEY (id_user) REFERENCES users (id_user) ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  console.log('Mengisi data awal…');
  await conn.query(
    `INSERT INTO kategori (id_kategori, nama_kategori, deskripsi) VALUES
      (1,'Figure','Action figure dan nendoroid karakter anime'),
      (2,'Poster','Poster dan wall scroll'),
      (3,'Photocard','Photocard dan sticker'),
      (4,'Apparel','Kaos, hoodie, dan merchandise pakaian');`
  );

  const hash = (p) => bcrypt.hashSync(p, 10);
  await conn.query(
    `INSERT INTO users (id_user, nama, username, password, role) VALUES (1,?,?,?,?),(2,?,?,?,?),(3,?,?,?,?);`,
    [
      'Pemilik Toko', 'owner', hash('owner123'), 'owner',
      'Admin Gudang', 'admin', hash('admin123'), 'administrator',
      'Staff Kasir', 'staff', hash('staff123'), 'staff',
    ]
  );

  await conn.query(
    `INSERT INTO barang (id_barang, kode_barang, nama_barang, id_kategori, harga, stok, gambar, status) VALUES
      (1,'FG-001','Nendoroid Gojo Satoru',1,450000,8,'gojo.jpg','tersedia'),
      (2,'FG-002','Figure Nezuko Kamado',1,380000,15,'nezuko.jpg','tersedia'),
      (3,'PS-001','Poster Attack on Titan A2',2,55000,5,'aot.jpg','tersedia'),
      (4,'PC-001','Photocard Set Frieren',3,35000,8,'frieren.jpg','tersedia'),
      (5,'AP-001','Kaos One Piece Luffy',4,120000,8,'luffy.jpg','tersedia');`
  );

  await conn.query(
    `INSERT INTO transaksi (id_barang, id_user, jenis, jumlah, tanggal, keterangan) VALUES
      (1,2,'masuk',20,'2026-05-01','Stok awal'),
      (2,2,'masuk',15,'2026-05-01','Stok awal'),
      (3,2,'masuk',50,'2026-05-02','Restok poster'),
      (4,2,'masuk',8,'2026-05-02','Stok awal'),
      (5,2,'masuk',30,'2026-05-03','Stok awal'),
      (1,3,'keluar',12,'2026-05-10','Penjualan'),
      (3,3,'keluar',45,'2026-05-12','Penjualan event'),
      (5,3,'keluar',22,'2026-05-15','Penjualan');`
  );

  await conn.end();
  console.log('Selesai! Database "%s" siap. Akun: owner/owner123, admin/admin123, staff/staff123', DB);
};

run().catch((e) => { console.error('Gagal init DB:', e.message); process.exit(1); });
