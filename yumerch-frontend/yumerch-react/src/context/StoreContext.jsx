import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { loadDb, saveDb, resetDb, nextId, statusFromStok } from '../db/store';

const StoreContext = createContext(null);
export const useStore = () => useContext(StoreContext);

const AUTH_KEY = 'yumerch_auth';

export function StoreProvider({ children }) {
  const [db, setDb] = useState(loadDb);
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem(AUTH_KEY)) || null; } catch { return null; }
  });

  // Persist setiap perubahan db
  useEffect(() => { saveDb(db); }, [db]);

  const update = useCallback((fn) => {
    setDb((prev) => {
      const draft = structuredClone(prev);
      fn(draft);
      return draft;
    });
  }, []);

  /* ---------------- AUTH ---------------- */
  const login = (username, password) => {
    const found = db.users.find(
      (u) => u.username.toLowerCase() === username.trim().toLowerCase() && u.password === password
    );
    if (!found) return { ok: false, message: 'Username atau password salah.' };
    const sess = { id_user: found.id_user, nama: found.nama, role: found.role };
    setUser(sess);
    localStorage.setItem(AUTH_KEY, JSON.stringify(sess));
    return { ok: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_KEY);
  };

  /* ---------------- HELPER ---------------- */
  const kategoriName = (id) => db.kategori.find((k) => k.id_kategori === id)?.nama_kategori ?? '-';
  const barangName = (id) => db.barang.find((b) => b.id_barang === id)?.nama_barang ?? '-';

  /* ---------------- KATEGORI ---------------- */
  const addKategori = (data) =>
    update((d) => { d.kategori.push({ id_kategori: nextId(d.kategori, 'id_kategori'), ...data }); });

  const updateKategori = (id, data) =>
    update((d) => {
      const i = d.kategori.findIndex((k) => k.id_kategori === id);
      if (i >= 0) d.kategori[i] = { ...d.kategori[i], ...data };
    });

  const deleteKategori = (id) => {
    const dipakai = db.barang.some((b) => b.id_kategori === id);
    if (dipakai) return { ok: false, message: 'Kategori masih dipakai oleh barang.' };
    update((d) => { d.kategori = d.kategori.filter((k) => k.id_kategori !== id); });
    return { ok: true };
  };

  /* ---------------- BARANG ---------------- */
  const addBarang = (data) =>
    update((d) => {
      d.barang.push({
        id_barang: nextId(d.barang, 'id_barang'),
        ...data,
        status: statusFromStok(Number(data.stok)),
      });
    });

  const updateBarang = (id, data) =>
    update((d) => {
      const i = d.barang.findIndex((b) => b.id_barang === id);
      if (i >= 0) d.barang[i] = { ...d.barang[i], ...data, status: statusFromStok(Number(data.stok)) };
    });

  const deleteBarang = (id) =>
    update((d) => {
      d.barang = d.barang.filter((b) => b.id_barang !== id);
      d.transaksi = d.transaksi.filter((t) => t.id_barang !== id);
    });

  /* ---------------- PENGGUNA ---------------- */

  // if (user.role !== 'owner') {
  //   return{
  //     ok: false,
  //     message: "Tidak memiliki hak akses"
  //   };

  //   const addUser = (data) => {
  //     update((d) => { d.users.push({ id_user: nextId(d.users, 'id_user'), ...data }); });
  //   };
    
  //   const updateUser = (id, data) => {
  //     update((d) => {
  //       const i = d.users.findIndex((u) => u.id_user === id);
  //       if (i >= 0) {
  //         const patch = { ...data };
  //         if (!patch.password) delete patch.password; // jangan timpa password jika kosong
  //         d.users[i] = { ...d.users[i], ...patch };
  //       }
  //     });
  //   };

  //   const deleteUser = (id) => {
  //     if (id === user?.id_user) return { ok: false, message: 'Tidak bisa menghapus akun yang sedang dipakai.' };
  //     update((d) => { d.users = d.users.filter((u) => u.id_user !== id); });
  //     return { ok: true };
  //   };
  // }

  const addUser = (data) => {
  if (user.role !== 'owner') {
    return {
      ok: false,
      message: 'Tidak memiliki hak akses'
    };
  }
    update((d) => { d.users.push({ id_user: nextId(d.users, 'id_user'), ...data }); });
  };
  
  const updateUser = (id, data) => {
    if (user.role !== 'owner') {
      return {
        ok: false,
        message: 'Tidak memiliki hak akses'
      };
    }
    update((d) => {
      const i = d.users.findIndex((u) => u.id_user === id);
      if (i >= 0) {
        const patch = { ...data };
        if (!patch.password) delete patch.password; // jangan timpa password jika kosong
        d.users[i] = { ...d.users[i], ...patch };
      }
    });
  };

  const deleteUser = (id) => {
    if (user.role !== 'owner') {
      return {
        ok: false,
        message: 'Tidak memiliki hak akses'
      };
    }
    if (id === user?.id_user) return { ok: false, message: 'Tidak bisa menghapus akun yang sedang dipakai.' };
    update((d) => { d.users = d.users.filter((u) => u.id_user !== id); });
    return { ok: true };
  };

  /* ---------------- TRANSAKSI (stok masuk/keluar) ---------------- */
  const catatTransaksi = ({ id_barang, jenis, jumlah, tanggal, keterangan }) => {
    id_barang = Number(id_barang);
    jumlah = Number(jumlah);
    const barang = db.barang.find((b) => b.id_barang === id_barang);
    if (!barang) return { ok: false, message: 'Barang tidak ditemukan.' };
    if (jenis === 'keluar' && jumlah > barang.stok)
      return { ok: false, message: `Stok tidak cukup. Stok ${barang.nama_barang} saat ini ${barang.stok}.` };

    update((d) => {
      d.transaksi.push({
        id_transaksi: nextId(d.transaksi, 'id_transaksi'),
        id_barang, id_user: user?.id_user ?? 0,
        jenis, jumlah, tanggal,
        keterangan: keterangan || (jenis === 'masuk' ? 'Barang masuk' : 'Barang keluar'),
      });
      const b = d.barang.find((x) => x.id_barang === id_barang);
      b.stok += jenis === 'masuk' ? jumlah : -jumlah;
      b.status = statusFromStok(b.stok);
    });
    return { ok: true };
  };

  const reset = () => { setDb(resetDb()); };

  const value = {
    db, user, login, logout, reset,
    kategoriName, barangName,
    addKategori, updateKategori, deleteKategori,
    addBarang, updateBarang, deleteBarang,
    addUser, updateUser, deleteUser,
    catatTransaksi,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}
