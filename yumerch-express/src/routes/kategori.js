import { Router } from 'express';
import { pool } from '../db.js';
import { authRequired, requireWrite } from '../auth.js';

const router = Router();
router.use(authRequired);

// POST /api/kategori
router.post('/', requireWrite, async (req, res) => {
  const { nama_kategori, deskripsi } = req.body || {};
  if (!nama_kategori) return res.status(422).json({ message: 'Nama kategori wajib diisi.' });
  const [r] = await pool.query('INSERT INTO kategori (nama_kategori, deskripsi) VALUES (?, ?)', [nama_kategori, deskripsi || null]);
  res.status(201).json({ id_kategori: r.insertId, nama_kategori, deskripsi });
});

// PUT /api/kategori/:id
router.put('/:id', requireWrite, async (req, res) => {
  const { nama_kategori, deskripsi } = req.body || {};
  if (!nama_kategori) return res.status(422).json({ message: 'Nama kategori wajib diisi.' });
  await pool.query('UPDATE kategori SET nama_kategori = ?, deskripsi = ? WHERE id_kategori = ?', [nama_kategori, deskripsi || null, req.params.id]);
  res.json({ message: 'Kategori diperbarui.' });
});

// DELETE /api/kategori/:id
router.delete('/:id', requireWrite, async (req, res) => {
  const [used] = await pool.query('SELECT COUNT(*) AS n FROM barang WHERE id_kategori = ?', [req.params.id]);
  if (used[0].n > 0) return res.status(422).json({ message: 'Kategori masih dipakai oleh barang.' });
  await pool.query('DELETE FROM kategori WHERE id_kategori = ?', [req.params.id]);
  res.json({ message: 'Kategori dihapus.' });
});

export default router;
