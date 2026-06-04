# Yumerch — Frontend (React + Tailwind)

Antarmuka admin kelola persediaan toko merchandise anime. Kini **terhubung ke backend Laravel + MySQL** lewat REST API (lihat folder `yumerch-api`).

## Prasyarat
Backend `yumerch-api` harus sudah berjalan lebih dulu di `http://localhost:8000` (lihat README di folder backend).

## Menjalankan
1. Buka folder ini di terminal: `cd yumerch-react`
2. (Opsional) atur URL API. Default `http://localhost:8000/api`. Untuk mengubah: `cp .env.example .env`
3. Install & jalankan:
   ```bash
   npm install
   npm run dev
   ```
4. Buka `http://localhost:5173`, login dengan akun demo:

| Username | Password | Role |
|----------|----------|------|
| owner | owner123 | Owner — akses penuh + Manajemen Pengguna |
| admin | admin123 | Administrator — CRUD barang/kategori, tanpa Pengguna |
| staff | staff123 | Staff — hanya melihat barang/kategori |

## Hak akses (ditegakkan di UI & server)
- Owner: semua fitur, termasuk CRUD Manajemen Pengguna.
- Administrator: semua kecuali Manajemen Pengguna.
- Staff: Barang & Kategori hanya bisa dilihat; menu Pengguna tersembunyi.

## Alur data
Login -> API kembalikan token (disimpan di localStorage) -> dikirim sebagai header Authorization: Bearer. Setelah login, frontend memanggil GET /api/bootstrap untuk memuat data. Tiap aksi tambah/edit/hapus/transaksi memanggil API lalu memuat ulang data.
