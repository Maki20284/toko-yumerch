import express from 'express';
import cors from 'cors';
import 'express-async-errors';
import 'dotenv/config';

import authRoutes from './src/routes/auth.js';
import kategoriRoutes from './src/routes/kategori.js';
import barangRoutes from './src/routes/barang.js';
import usersRoutes from './src/routes/users.js';
import transaksiRoutes from './src/routes/transaksi.js';

const app = express();

const origins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((s) => s.trim());

app.use(cors({ origin: origins }));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api', authRoutes);
app.use('/api/kategori', kategoriRoutes);
app.use('/api/barang', barangRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/transaksi', transaksiRoutes);

// Penangan error global -> selalu kembalikan JSON { message }
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Yumerch API berjalan di http://localhost:${PORT}/api`);
});
