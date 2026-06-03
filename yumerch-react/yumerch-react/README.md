# Yumerch — Inventory (React + Tailwind)

Aplikasi web kelola persediaan barang toko merchandise anime. Dibangun dengan **React (Vite) + Tailwind CSS**. Data awal di-seed dari `toko_merch_anime.sql` dan disimpan di **localStorage** browser (berfungsi sebagai pengganti MySQL, jadi tidak perlu backend).

## Fitur
- **Login** admin (validasi gagal login ada pesannya)
- **Dashboard**: total barang, total stok masuk, total stok keluar, daftar stok < 10, stok tertinggi, grafik stok
- **Persediaan Barang**: barang masuk & keluar, stok terkini, status tersedia / tidak tersedia
- **Master Data**: Kategori, Daftar Barang, Manajemen Pengguna — masing-masing Tambah / Detail / Edit / Hapus
- **Laporan**: riwayat keluar-masuk + filter tanggal (dari–sampai), jenis, pencarian, dan cetak
- Aksi **Tambah/Edit** memakai **pop-up form**, aksi **Hapus** ada **dialog konfirmasi**

## Akun demo
| Username | Password | Role |
|----------|----------|------|
| admin | admin123 | Administrator |
| owner | owner123 | Owner |
| staff | staff123 | Staff |

## Langkah menjalankan
1. Pastikan **Node.js 18+** terpasang (cek: `node -v`).
2. Buka folder project di terminal:
   ```bash
   cd yumerch-react
   ```
3. Install dependency:
   ```bash
   npm install
   ```
4. Jalankan mode pengembangan:
   ```bash
   npm run dev
   ```
5. Buka URL yang muncul (biasanya `http://localhost:5173`), lalu login dengan akun demo di atas.

### Build untuk produksi (opsional)
```bash
npm run build     # hasil di folder dist/
npm run preview   # uji hasil build
```

## Reset data
Data tersimpan di localStorage browser. Untuk mengembalikan ke data awal: buka DevTools → Application → Local Storage → hapus key `yumerch_db_v1`, lalu refresh. (Fungsi `reset()` juga tersedia di context bila ingin dibuatkan tombol.)

## Struktur
```
src/
  db/        seed.js (data dari SQL) + store.js (localStorage)
  context/   StoreContext (data+auth+CRUD), ToastContext
  components/ Layout (sidebar), ui.jsx (Modal, Confirm, dll)
  pages/     Login, Dashboard, Persediaan, Kategori, Barang, Pengguna, Laporan
  utils/     format.js
```

## Catatan: ingin pakai MySQL asli?
Aplikasi ini frontend-only. Untuk menghubungkan ke database MySQL `toko_merch_anime`, buat REST API terpisah (mis. Express/Laravel) lalu ganti pemanggilan fungsi di `StoreContext.jsx` menjadi `fetch()` ke API tersebut. Skema tabel & nama field sudah dibuat sama persis dengan SQL Anda agar mudah disambungkan.
