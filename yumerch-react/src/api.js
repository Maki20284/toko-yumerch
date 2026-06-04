const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

let token = localStorage.getItem('yumerch_token') || null;

export const getToken = () => token;
export const setToken = (t) => {
  token = t;
  if (t) localStorage.setItem('yumerch_token', t);
  else localStorage.removeItem('yumerch_token');
};

export async function api(path, { method = 'GET', body } = {}) {
  const res = await fetch(BASE + path, {
    method,
    headers: {
      Accept: 'application/json',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try { data = await res.json(); } catch { /* respons tanpa body */ }

  if (!res.ok) {
    if (res.status === 401) {
      // sesi tidak valid / kedaluwarsa -> bersihkan dan kembali ke login
      setToken(null);
      localStorage.removeItem('yumerch_user');
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    const message =
      data?.message ||
      (data?.errors ? Object.values(data.errors)[0][0] : 'Terjadi kesalahan pada server.');
    const err = new Error(message);
    err.status = res.status;
    throw err;
  }
  return data;
}
