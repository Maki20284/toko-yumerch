import { seed } from './seed';

const KEY = 'yumerch_db_v1';

// Load DB dari localStorage, atau seed jika belum ada (analogi: migrate + seed)
export function loadDb() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Gagal membaca DB, memuat ulang seed.', e);
  }
  const fresh = structuredClone(seed);
  saveDb(fresh);
  return fresh;
}

export function saveDb(db) {
  localStorage.setItem(KEY, JSON.stringify(db));
}

export function resetDb() {
  const fresh = structuredClone(seed);
  saveDb(fresh);
  return fresh;
}

// Auto-increment id untuk sebuah tabel
export function nextId(rows, pk) {
  return rows.reduce((max, r) => Math.max(max, r[pk] || 0), 0) + 1;
}

export const statusFromStok = (stok) => (stok > 0 ? 'tersedia' : 'tidak_tersedia');
