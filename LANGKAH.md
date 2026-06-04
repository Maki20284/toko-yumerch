# Yumerch — Full-Stack (React + Laravel + MySQL)

Dua folder:
- `yumerch-api/`  — backend Laravel (REST API) + MySQL
- `yumerch-react/` — frontend React (Vite + Tailwind)

## Urutan menjalankan
### 1) Backend dulu
1. `composer create-project laravel/laravel yumerch-api-app`
2. Salin/timpa isi folder `yumerch-api/` ke project itu (hapus migrasi users bawaan: `database/migrations/0001_01_01_000000_create_users_table.php`).
3. Buat database MySQL `toko_merch_anime` (kosong).
4. Atur `.env` (lihat `.env.example`): DB_DATABASE, DB_USERNAME, DB_PASSWORD.
5. `php artisan key:generate`
6. `php artisan migrate --seed`
7. `php artisan serve`  -> API di http://localhost:8000

### 2) Frontend
1. `cd yumerch-react`
2. `npm install`
3. `npm run dev`  -> buka http://localhost:5173

## Akun demo
owner/owner123 (akses penuh) - admin/admin123 (tanpa Pengguna) - staff/staff123 (lihat saja)

File `toko_merch_anime.sql` disertakan di folder backend sebagai referensi skema (tidak perlu diimpor; data dibuat oleh `migrate --seed`).
Detail tiap bagian ada di README.md masing-masing folder.
