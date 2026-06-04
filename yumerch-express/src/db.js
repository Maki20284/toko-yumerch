import mysql from 'mysql2/promise';
import 'dotenv/config';

// dateStrings: true -> kolom DATE/DATETIME dikembalikan sebagai string 'YYYY-MM-DD'
// (penting agar frontend bisa membaca tanggal dengan benar)
export const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'toko_merch_anime',
  waitForConnections: true,
  connectionLimit: 10,
  dateStrings: true,
});
