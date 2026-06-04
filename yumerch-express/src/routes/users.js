import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { pool } from '../db.js';
import { authRequired, requireOwner } from '../auth.js';

const router = Router();
router.use(authRequired, requireOwner);

const ROLES = ['administrator', 'owner', 'staff'];

// GET /api/users
router.get('/', async (req, res) => {
  const [rows] = await pool.query('SELECT id_user, nama, username, role FROM users ORDER BY id_user');
  res.json(rows);
});

// POST /api/users
router.post('/', async (req, res) => {
  const { nama, username, password, role } = req.body || {};
  if (!nama || !username || !password || !ROLES.includes(role)) {
    return res.status(422).json({ message: 'Data pengguna tidak lengkap / role tidak valid.' });
  }
  try {
    const hash = bcrypt.hashSync(password, 10);
    const [r] = await pool.query('INSERT INTO users (nama, username, password, role) VALUES (?,?,?,?)', [nama, username, hash, role]);
    res.status(201).json({ id_user: r.insertId, nama, username, role });
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') return res.status(422).json({ message: 'Username sudah dipakai.' });
    throw e;
  }
});

// PUT /api/users/:id
router.put('/:id', async (req, res) => {
  const { nama, username, password, role } = req.body || {};
  if (!nama || !username || !ROLES.includes(role)) {
    return res.status(422).json({ message: 'Data pengguna tidak lengkap / role tidak valid.' });
  }
  try {
    if (password) {
      const hash = bcrypt.hashSync(password, 10);
      await pool.query('UPDATE users SET nama=?, username=?, password=?, role=? WHERE id_user=?', [nama, username, hash, role, req.params.id]);
    } else {
      await pool.query('UPDATE users SET nama=?, username=?, role=? WHERE id_user=?', [nama, username, role, req.params.id]);
    }
    res.json({ message: 'Pengguna diperbarui.' });
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') return res.status(422).json({ message: 'Username sudah dipakai.' });
    throw e;
  }
});

// DELETE /api/users/:id
router.delete('/:id', async (req, res) => {
  if (Number(req.params.id) === Number(req.user.id_user)) {
    return res.status(422).json({ message: 'Tidak bisa menghapus akun yang sedang dipakai.' });
  }
  await pool.query('DELETE FROM users WHERE id_user = ?', [req.params.id]);
  res.json({ message: 'Pengguna dihapus.' });
});

export default router;
