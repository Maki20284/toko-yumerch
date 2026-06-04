import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { StoreProvider, useStore } from './context/StoreContext';
import { ToastProvider } from './context/ToastContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Persediaan from './pages/Persediaan';
import Kategori from './pages/Kategori';
import Barang from './pages/Barang';
import Pengguna from './pages/Pengguna';
import Laporan from './pages/Laporan';

function Protected() {
  const { user, loading } = useStore();
  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-slate-100">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <span className="w-8 h-8 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
          <p className="text-sm">Memuat data…</p>
        </div>
      </div>
    );
  }
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

function OwnerOnly() {
  const { user } = useStore();
  return user?.role === 'owner' ? <Outlet /> : <Navigate to="/dashboard" replace />;
}

export default function App() {
  return (
    <StoreProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<Protected />}>
              <Route element={<Layout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/persediaan" element={<Persediaan />} />
                <Route path="/kategori" element={<Kategori />} />
                <Route path="/barang" element={<Barang />} />
                <Route element={<OwnerOnly />}>
                  <Route path="/pengguna" element={<Pengguna />} />
                </Route>
                <Route path="/laporan" element={<Laporan />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </StoreProvider>
  );
}
