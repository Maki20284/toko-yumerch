import { Router } from 'express';
import { pool } from '../db.js';
import { authRequired, requireWrite } from '../auth.js';

const router = Router();
router.use(authRequired);

function validate(body) {
  const { kode_barang, nama_barang, id_kategori, harga, stok } = body || {};
  if (!kode_barang || !nama_barang || !id_kategori || harga === undefined || stok === undefined) {
    return 'Semua field wajib diisi.';
  }
  return null;
}

// POST /api/barang
router.post('/', requireWrite, async (req, res) => {
  const err = validate(req.body);
  if (err) return res.status(422).json({ message: err });
  const { kode_barang, nama_barang, id_kategori, harga, stok, gambar } = req.body;
  const status = Number(stok) > 0 ? 'tersedia' : 'tidak_tersedia';
  try {
    const [r] = await pool.query(
      'INSERT INTO barang (kode_barang, nama_barang, id_kategori, harga, stok, gambar, status) VALUES (?,?,?,?,?,?,?)',
      [kode_barang, nama_barang, id_kategori, harga, stok, gambar || null, status]
    );
    res.status(201).json({ id_barang: r.insertId });
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') return res.status(422).json({ message: 'Kode barang sudah dipakai.' });
    throw e;
  }
});

// PUT /api/barang/:id
router.put('/:id', requireWrite, async (req, res) => {
  const err = validate(req.body);
  if (err) return res.status(422).json({ message: err });
  const { kode_barang, nama_barang, id_kategori, harga, stok, gambar } = req.body;
  const status = Number(stok) > 0 ? 'tersedia' : 'tidak_tersedia';
  try {
    await pool.query(
      'UPDATE barang SET kode_barang=?, nama_barang=?, id_kategori=?, harga=?, stok=?, gambar=?, status=? WHERE id_barang=?',
      [kode_barang, nama_barang, id_kategori, harga, stok, gambar || null, status, req.params.id]
    );
    res.json({ message: 'Barang diperbarui.' });
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') return res.status(422).json({ message: 'Kode barang sudah dipakai.' });
    throw e;
  }
});

// DELETE /api/barang/:id
router.delete('/:id', requireWrite, async (req, res) => {
  await pool.query('DELETE FROM barang WHERE id_barang = ?', [req.params.id]);
  res.json({ message: 'Barang dihapus.' });
});

export default router;
