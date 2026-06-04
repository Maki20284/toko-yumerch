# Yumerch API — Backend Express.js + MySQL

Backend REST API untuk frontend React `yumerch-react`. Tidak butuh PHP. API-nya identik dengan yang dipanggil frontend, jadi frontend tidak perlu diubah.

## Prasyarat
- Node.js 18+ (cek `node -v`)
- MySQL berjalan (mis. lewat XAMPP — nyalakan MySQL di Control Panel)

## Langkah
1. Masuk folder & install:
   ```bash
   cd yumerch-express
   npm install
   ```
2. Salin konfigurasi dan sesuaikan dengan MySQL Anda:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` -> `DB_USER`, `DB_PASSWORD` (XAMPP biasanya user `root`, password kosong).
3. Buat database + tabel + data awal (otomatis):
   ```bash
   npm run init-db
   ```
   > Alternatif: kalau mau pakai file `toko_merch_anime.sql` sendiri, impor lewat phpMyAdmin, lalu lewati langkah ini. (Login tetap jalan: server mendukung password hash maupun teks biasa.)
4. Jalankan server:
   ```bash
   npm run dev
   ```
   Aktif di `http://localhost:8000/api`. Cek `http://localhost:8000/api/health` -> `{"status":"ok"}`.

## Akun demo
owner/owner123 (akses penuh) · admin/admin123 (tanpa Pengguna) · staff/staff123 (lihat saja)

## Endpoint
| Method | URL | Akses |
|--------|-----|-------|
| POST | /api/login | publik |
| GET | /api/bootstrap | semua role |
| POST | /api/transaksi | semua role |
| POST/PUT/DELETE | /api/kategori | owner, administrator |
| POST/PUT/DELETE | /api/barang | owner, administrator |
| GET/POST/PUT/DELETE | /api/users | owner saja |
| POST | /api/logout | login |

Autentikasi: Bearer token (header `Authorization: Bearer <token>`). Aturan role ditegakkan di server. CORS mengizinkan origin di `CORS_ORIGIN` (.env), default `http://localhost:5173`.
