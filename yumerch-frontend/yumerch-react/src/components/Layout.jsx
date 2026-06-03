import { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Boxes, Tags, Package, Users, FileText, LogOut, Menu, X,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

const groups = [
  { title: 'MENU', items: [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/persediaan', label: 'Persediaan Barang', icon: Boxes },
  ]},
  { title: 'MASTER DATA', items: [
    { to: '/kategori', label: 'Kategori Barang', icon: Tags },
    { to: '/barang', label: 'Daftar Barang', icon: Package },
    { to: '/pengguna', label: 'Manajemen Pengguna', icon: Users },
  ]},
  { title: 'LAINNYA', items: [
    { to: '/laporan', label: 'Laporan', icon: FileText },
  ]},
];

const pageTitle = {
  '/dashboard': ['Dashboard', 'Ringkasan persediaan barang Yumerch'],
  '/persediaan': ['Persediaan Barang', 'Catat barang masuk & keluar'],
  '/kategori': ['Kategori Barang', 'Master data kategori'],
  '/barang': ['Daftar Barang', 'Master data barang'],
  '/pengguna': ['Manajemen Pengguna', 'Master data pengguna'],
  '/laporan': ['Laporan Transaksi', 'Riwayat keluar masuk barang'],
};

export default function Layout() {
  const { user, logout } = useStore();
  const nav = useNavigate();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [title, subtitle] = pageTitle[pathname] || ['Yumerch', ''];

  const doLogout = () => { logout(); nav('/login'); };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-ink-900 to-[#0b1626] text-slate-200 flex flex-col transition-transform lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="px-6 pt-7 pb-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="grid place-items-center w-10 h-10 rounded-xl bg-brand-500 text-ink-900 font-display font-extrabold text-lg">YM</span>
            <div>
              <p className="font-display font-extrabold text-white text-lg leading-none">Yumerch</p>
              <p className="text-[11px] text-slate-400 mt-1">Inventory System</p>
            </div>
          </div>
          <button className="lg:hidden text-slate-400" onClick={() => setOpen(false)}><X size={20} /></button>
        </div>

        <nav className="flex-1 px-3 py-5 space-y-5 overflow-y-auto text-sm">
          {groups.map((g) => (
            <div key={g.title}>
              <p className="px-3 text-[11px] font-semibold tracking-widest text-slate-500 mb-2">{g.title}</p>
              <div className="space-y-1">
                {g.items.map(({ to, label, icon: Icon }) => (
                  <NavLink key={to} to={to} onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl transition ${isActive ? 'bg-brand-500 text-ink-900 font-semibold shadow-soft' : 'hover:bg-white/5 text-slate-300'}`}>
                    <Icon size={18} /> {label}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <span className="grid place-items-center w-9 h-9 rounded-full bg-white/10 text-white font-semibold">
              {user?.nama?.[0]?.toUpperCase()}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.nama}</p>
              <p className="text-[11px] text-brand-300 capitalize">{user?.role}</p>
            </div>
          </div>
          <button onClick={doLogout} className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-white/5 hover:bg-accent-500 hover:text-white text-slate-300 text-sm transition">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {open && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setOpen(false)} />}

      {/* Main */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <header className="sticky top-0 z-20 bg-slate-100/80 backdrop-blur border-b border-slate-200/70 px-6 py-4 flex items-center gap-3">
          <button className="lg:hidden p-2 rounded-lg hover:bg-slate-200" onClick={() => setOpen(true)}><Menu size={20} /></button>
          <div>
            <h1 className="font-display font-extrabold text-2xl text-ink-900">{title}</h1>
            {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
        </header>
        <main className="flex-1 p-6"><Outlet /></main>
      </div>
    </div>
  );
}
