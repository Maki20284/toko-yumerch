<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\Kategori;
use App\Models\User;
use App\Models\Barang;
use App\Models\Transaksi;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        foreach ([
            ['id_kategori' => 1, 'nama_kategori' => 'Figure', 'deskripsi' => 'Action figure dan nendoroid karakter anime'],
            ['id_kategori' => 2, 'nama_kategori' => 'Poster', 'deskripsi' => 'Poster dan wall scroll'],
            ['id_kategori' => 3, 'nama_kategori' => 'Photocard', 'deskripsi' => 'Photocard dan sticker'],
            ['id_kategori' => 4, 'nama_kategori' => 'Apparel', 'deskripsi' => 'Kaos, hoodie, dan merchandise pakaian'],
        ] as $k) Kategori::create($k);

        foreach ([
            ['id_user' => 1, 'nama' => 'Pemilik Toko', 'username' => 'owner', 'password' => 'owner123', 'role' => 'owner'],
            ['id_user' => 2, 'nama' => 'Admin Gudang', 'username' => 'admin', 'password' => 'admin123', 'role' => 'administrator'],
            ['id_user' => 3, 'nama' => 'Staff Kasir', 'username' => 'staff', 'password' => 'staff123', 'role' => 'staff'],
        ] as $u) {
            $u['password'] = Hash::make($u['password']);
            User::create($u);
        }

        foreach ([
            ['id_barang' => 1, 'kode_barang' => 'FG-001', 'nama_barang' => 'Nendoroid Gojo Satoru', 'id_kategori' => 1, 'harga' => 450000, 'stok' => 8,  'gambar' => 'gojo.jpg',    'status' => 'tersedia'],
            ['id_barang' => 2, 'kode_barang' => 'FG-002', 'nama_barang' => 'Figure Nezuko Kamado',  'id_kategori' => 1, 'harga' => 380000, 'stok' => 15, 'gambar' => 'nezuko.jpg',  'status' => 'tersedia'],
            ['id_barang' => 3, 'kode_barang' => 'PS-001', 'nama_barang' => 'Poster Attack on Titan A2', 'id_kategori' => 2, 'harga' => 55000, 'stok' => 5, 'gambar' => 'aot.jpg', 'status' => 'tersedia'],
            ['id_barang' => 4, 'kode_barang' => 'PC-001', 'nama_barang' => 'Photocard Set Frieren', 'id_kategori' => 3, 'harga' => 35000, 'stok' => 8,  'gambar' => 'frieren.jpg', 'status' => 'tersedia'],
            ['id_barang' => 5, 'kode_barang' => 'AP-001', 'nama_barang' => 'Kaos One Piece Luffy',  'id_kategori' => 4, 'harga' => 120000, 'stok' => 8,  'gambar' => 'luffy.jpg',   'status' => 'tersedia'],
        ] as $b) Barang::create($b);

        foreach ([
            ['id_barang' => 1, 'id_user' => 2, 'jenis' => 'masuk',  'jumlah' => 20, 'tanggal' => '2026-05-01', 'keterangan' => 'Stok awal'],
            ['id_barang' => 2, 'id_user' => 2, 'jenis' => 'masuk',  'jumlah' => 15, 'tanggal' => '2026-05-01', 'keterangan' => 'Stok awal'],
            ['id_barang' => 3, 'id_user' => 2, 'jenis' => 'masuk',  'jumlah' => 50, 'tanggal' => '2026-05-02', 'keterangan' => 'Restok poster'],
            ['id_barang' => 4, 'id_user' => 2, 'jenis' => 'masuk',  'jumlah' => 8,  'tanggal' => '2026-05-02', 'keterangan' => 'Stok awal'],
            ['id_barang' => 5, 'id_user' => 2, 'jenis' => 'masuk',  'jumlah' => 30, 'tanggal' => '2026-05-03', 'keterangan' => 'Stok awal'],
            ['id_barang' => 1, 'id_user' => 3, 'jenis' => 'keluar', 'jumlah' => 12, 'tanggal' => '2026-05-10', 'keterangan' => 'Penjualan'],
            ['id_barang' => 3, 'id_user' => 3, 'jenis' => 'keluar', 'jumlah' => 45, 'tanggal' => '2026-05-12', 'keterangan' => 'Penjualan event'],
            ['id_barang' => 5, 'id_user' => 3, 'jenis' => 'keluar', 'jumlah' => 22, 'tanggal' => '2026-05-15', 'keterangan' => 'Penjualan'],
        ] as $t) Transaksi::create($t);
    }
}
