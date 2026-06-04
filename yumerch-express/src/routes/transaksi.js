import { Router } from 'express';
import { pool } from '../db.js';
import { authRequired } from '../auth.js';

const router = Router();
router.use(authRequired);

// POST /api/transaksi  { id_barang, jenis, jumlah, tanggal, keterangan }
router.post('/', async (req, res) => {
  const { id_barang, jenis, tanggal } = req.body || {};
  const jumlah = Number(req.body?.jumlah);

  if (!id_barang || !['masuk', 'keluar'].includes(jenis) || !jumlah || jumlah < 1 || !tanggal) {
    return res.status(422).json({ message: 'Data transaksi tidak lengkap.' });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [rows] = await conn.query('SELECT stok, nama_barang FROM barang WHERE id_barang = ? FOR UPDATE', [id_barang]);
    const barang = rows[0];
    if (!barang) { await conn.rollback(); return res.status(404).json({ message: 'Barang tidak ditemukan.' }); }

    if (jenis === 'keluar' && jumlah > barang.stok) {
      await conn.rollback();
      return res.status(422).json({ message: `Stok tidak cukup. Stok ${barang.nama_barang} saat ini ${barang.stok}.` });
    }

    const keterangan = req.body.keterangan || (jenis === 'masuk' ? 'Barang masuk' : 'Barang keluar');
    await conn.query(
      'INSERT INTO transaksi (id_barang, id_user, jenis, jumlah, tanggal, keterangan) VALUES (?,?,?,?,?,?)',
      [id_barang, req.user.id_user, jenis, jumlah, tanggal, keterangan]
    );

    const stokBaru = barang.stok + (jenis === 'masuk' ? jumlah : -jumlah);
    const status = stokBaru > 0 ? 'tersedia' : 'tidak_tersedia';
    await conn.query('UPDATE barang SET stok = ?, status = ? WHERE id_barang = ?', [stokBaru, status, id_barang]);

    await conn.commit();
    res.status(201).json({ message: 'Transaksi dicatat.' });
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
});

export default router;
