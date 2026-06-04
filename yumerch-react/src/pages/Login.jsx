import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { inputCls } from '../components/ui';
import { AlertTriangle } from 'lucide-react';

export default function Login() {
  const { login } = useStore();
  const nav = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    const res = await login(form.username, form.password);
    if (res.ok) nav('/dashboard');
    else setError(res.message);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-100">
      {/* Panel visual */}
      <div className="hidden lg:flex relative overflow-hidden bg-gradient-to-br from-[#0f1b2d] via-[#11324a] to-[#047857] p-12 flex-col justify-between text-white">
        <div className="flex items-center gap-2.5">
          <span className="grid place-items-center w-11 h-11 rounded-xl bg-brand-400 text-[#0f1b2d] font-display font-extrabold">YM</span>
          <span className="font-display font-extrabold text-xl">Yumerch</span>
        </div>
        <div>
          <h1 className="font-display font-extrabold text-4xl leading-tight">Kelola persediaan<br/>merchandise anime<br/>dengan rapi.</h1>
          <p className="mt-4 text-emerald-100/80 max-w-sm">Pantau stok masuk, stok keluar, dan laporan transaksi toko Anda dalam satu dashboard.</p>
        </div>
        <div className="flex gap-8 text-sm text-emerald-100/70">
          <div><p className="font-display font-extrabold text-2xl text-white">Stok</p>Real-time</div>
          <div><p className="font-display font-extrabold text-2xl text-white">Laporan</p>Filter tanggal</div>
          <div><p className="font-display font-extrabold text-2xl text-white">Master</p>Data lengkap</div>
        </div>
        <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-brand-400/20 blur-2xl" />
      </div>

      {/* Panel form */}
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2.5 mb-8 justify-center">
            <span className="grid place-items-center w-10 h-10 rounded-xl bg-brand-500 text-white font-extrabold">YM</span>
            <span className="font-display font-extrabold text-xl text-ink-900">Yumerch</span>
          </div>

          <h1 className="font-display font-extrabold text-3xl text-ink-900">Login Admin</h1>
          <p className="text-slate-500 mt-1 mb-7">Masuk untuk mengelola persediaan barang.</p>

          {error && (
            <div className="mb-5 flex items-center gap-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 text-sm">
              <AlertTriangle size={18} className="shrink-0" /> {error}
            </div>
          )}

          <form onSubmit={submit} className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 p-7 space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Username</label>
              <input className={inputCls} placeholder="admin" autoFocus
                value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
              <input type="password" className={inputCls} placeholder="Masukkan password"
                value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
            <button className="w-full py-3 rounded-xl bg-ink-900 hover:bg-brand-600 text-white font-semibold transition">Login</button>
          </form>

          <div className="mt-5 text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-xl p-3">
            <p className="font-semibold text-slate-600 mb-1">Akun demo:</p>
            admin / admin123 &nbsp;·&nbsp; owner / owner123 &nbsp;·&nbsp; staff / staff123
          </div>
        </div>
      </div>
    </div>
  );
}
