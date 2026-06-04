import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { pool } from '../db.js';
import { createToken, revokeToken, authRequired } from '../auth.js';

const router = Router();

// Cocokkan password: dukung hash bcrypt ($2...) maupun teks biasa (jika import SQL mentah)
function passwordMatch(input, stored) {
  if (typeof stored === 'string' && stored.startsWith('$2')) {
    return bcrypt.compareSync(input, stored);
  }
  return input === stored;
}

// POST /api/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(422).json({ message: 'Username dan password wajib diisi.' });

  const [rows] = await pool.query('SELECT * FROM users WHERE username = ? LIMIT 1', [username]);
  const user = rows[0];
  if (!user || !passwordMatch(password, user.password)) {
    return res.status(422).json({ message: 'Username atau password salah.' });
  }

  const token = createToken(user);
  res.json({ token, user: { id_user: user.id_user, nama: user.nama, role: user.role } });
});

// POST /api/logout
router.post('/logout', authRequired, (req, res) => {
  revokeToken(req.token);
  res.json({ message: 'Logout berhasil.' });
});

// GET /api/me
router.get('/me', authRequired, (req, res) => res.json(req.user));

// GET /api/bootstrap -> seluruh data untuk frontend
router.get('/bootstrap', authRequired, async (req, res) => {
  const [kategori] = await pool.query('SELECT * FROM kategori ORDER BY id_kategori');
  const [barang] = await pool.query('SELECT * FROM barang ORDER BY id_barang');
  const [transaksi] = await pool.query('SELECT * FROM transaksi ORDER BY id_transaksi');

  let users = [];
  if (req.user.role === 'owner') {
    const [u] = await pool.query('SELECT id_user, nama, username, role FROM users ORDER BY id_user');
    users = u;
  }

  res.json({ kategori, barang, transaksi, users });
});

export default router;
