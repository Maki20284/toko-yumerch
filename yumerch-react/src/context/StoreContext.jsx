import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api, setToken, getToken } from '../api';

const StoreContext = createContext(null);
export const useStore = () => useContext(StoreContext);

const EMPTY = { kategori: [], barang: [], transaksi: [], users: [] };

export function StoreProvider({ children }) {
  const [db, setDb] = useState(EMPTY);
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('yumerch_user')) || null; } catch { return null; }
  });
  const [loading, setLoading] = useState(!!getToken());

  const refresh = useCallback(async () => {
    const data = await api('/bootstrap');
    setDb({
      kategori: data.kategori || [],
      barang: data.barang || [],
      transaksi: data.transaksi || [],
      users: data.users || [],
    });
  }, []);

  // Muat data awal bila token sudah ada (mis. setelah refresh halaman)
  useEffect(() => {
    let active = true;
    (async () => {
      if (getToken()) {
        try { await refresh(); }
        catch (e) {
          if (e.status === 401) { setToken(null); setUser(null); localStorage.removeItem('yumerch_user'); }
        }
      }
      if (active) setLoading(false);
    })();
    return () => { active = false; };
  }, [refresh]);

  // Bungkus operasi tulis -> selalu return { ok, message }
  const run = async (fn) => {
    try { await fn(); await refresh(); return { ok: true }; }
    catch (e) { return { ok: false, message: e.message }; }
  };

  /* ---------- AUTH ---------- */
  const login = async (username, password) => {
    try {
      const data = await api('/login', { method: 'POST', body: { username, password } });
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('yumerch_user', JSON.stringify(data.user));
      await refresh();
      return { ok: true };
    } catch (e) {
      return { ok: false, message: e.message };
    }
  };

  const logout = async () => {
    try { await api('/logout', { method: 'POST' }); } catch { /* abaikan */ }
    setToken(null);
    setUser(null);
    localStorage.removeItem('yumerch_user');
    setDb(EMPTY);
  };

  /* ---------- HELPER ---------- */
  const kategoriName = (id) => db.kategori.find((k) => k.id_kategori === id)?.nama_kategori ?? '-';
  const barangName = (id) => db.barang.find((b) => b.id_barang === id)?.nama_barang ?? '-';

  /* ---------- KATEGORI ---------- */
  const addKategori = (data) => run(() => api('/kategori', { method: 'POST', body: data }));
  const updateKategori = (id, data) => run(() => api(`/kategori/${id}`, { method: 'PUT', body: data }));
  const deleteKategori = (id) => run(() => api(`/kategori/${id}`, { method: 'DELETE' }));

  /* ---------- BARANG ---------- */
  const addBarang = (data) => run(() => api('/barang', { method: 'POST', body: data }));
  const updateBarang = (id, data) => run(() => api(`/barang/${id}`, { method: 'PUT', body: data }));
  const deleteBarang = (id) => run(() => api(`/barang/${id}`, { method: 'DELETE' }));

  /* ---------- PENGGUNA ---------- */
  const addUser = (data) => run(() => api('/users', { method: 'POST', body: data }));
  const updateUser = (id, data) => run(() => api(`/users/${id}`, { method: 'PUT', body: data }));
  const deleteUser = (id) => run(() => api(`/users/${id}`, { method: 'DELETE' }));

  /* ---------- TRANSAKSI (stok masuk/keluar) ---------- */
  const catatTransaksi = (payload) => run(() => api('/transaksi', { method: 'POST', body: payload }));

  // Hak akses berbasis role
  const role = user?.role;
  const can = {
    users: role === 'owner',
    editMaster: role === 'owner' || role === 'administrator',
  };

  const value = {
    db, user, loading, can,
    login, logout, refresh,
    kategoriName, barangName,
    addKategori, updateKategori, deleteKategori,
    addBarang, updateBarang, deleteBarang,
    addUser, updateUser, deleteUser,
    catatTransaksi,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}
