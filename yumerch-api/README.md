# Yumerch API — Backend Laravel + MySQL

REST API untuk aplikasi Yumerch (React). Terhubung ke database MySQL `toko_merch_anime`.

## Cara pasang
File-file di folder ini adalah file kustom yang ditempelkan ke project Laravel baru.

1. Buat project Laravel baru (butuh PHP 8.2+ & Composer):
   ```bash
   composer create-project laravel/laravel yumerch-api
   cd yumerch-api
   ```
2. **Salin/timpa** file dari folder ini ke project tadi (pertahankan struktur folder):
   - `app/Models/*` , `app/Http/Controllers/Api/*` , `app/Http/Controllers/Controller.php`
   - `app/Http/Middleware/ApiAuth.php`
   - `database/migrations/2024_01_01_0000*` (hapus migrasi bawaan `0001_01_01_000000_create_users_table.php` agar tidak bentrok)
   - `database/seeders/DatabaseSeeder.php`
   - `routes/api.php`
   - `bootstrap/app.php`
   - `config/cors.php`
3. Buat database MySQL kosong bernama `toko_merch_anime` (mis. lewat phpMyAdmin).
4. Atur koneksi DB di `.env` (lihat `.env.example`):
   ```
   DB_DATABASE=toko_merch_anime
   DB_USERNAME=root
   DB_PASSWORD=
   ```
5. Generate key, migrate, dan seed:
   ```bash
   php artisan key:generate
   php artisan migrate --seed
   ```
6. Jalankan server:
   ```bash
   php artisan serve
   ```
   API aktif di `http://localhost:8000/api`.

## Endpoint
| Method | URL | Akses |
|--------|-----|-------|
| POST | `/api/login` | publik |
| GET | `/api/bootstrap` | login (semua role) |
| POST | `/api/transaksi` | login (masuk/keluar) |
| POST/PUT/DELETE | `/api/kategori` | owner, administrator |
| POST/PUT/DELETE | `/api/barang` | owner, administrator |
| GET/POST/PUT/DELETE | `/api/users` | **owner saja** |
| POST | `/api/logout` | login |

Autentikasi memakai **Bearer token** (kolom `api_token` di tabel users). Login mengembalikan `{ token, user }`; sertakan header `Authorization: Bearer <token>` pada request berikutnya.

## Catatan
- Aturan role juga ditegakkan di server (bukan cuma di UI), jadi staff/admin tidak bisa menembus lewat request langsung.
- Jika frontend (Vite) jalan di port selain 5173, tambahkan origin-nya di `config/cors.php`.
