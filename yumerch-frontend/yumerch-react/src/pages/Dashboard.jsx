import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Package, ArrowDownToLine, ArrowUpFromLine, TrendingUp } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { angka } from '../utils/format';

export default function Dashboard() {
  const { db, kategoriName } = useStore();

  const stats = useMemo(() => {
    const totalBarang = db.barang.length;
    const totalMasuk = db.transaksi.filter((t) => t.jenis === 'masuk').reduce((s, t) => s + t.jumlah, 0);
    const totalKeluar = db.transaksi.filter((t) => t.jenis === 'keluar').reduce((s, t) => s + t.jumlah, 0);
    const stokRendah = db.barang.filter((b) => b.stok < 10).sort((a, b) => a.stok - b.stok);
    const stokTertinggi = [...db.barang].sort((a, b) => b.stok - a.stok)[0];
    const chart = [...db.barang].sort((a, b) => b.stok - a.stok).slice(0, 8)
      .map((b) => ({ nama: b.nama_barang.length > 14 ? b.nama_barang.slice(0, 14) + '…' : b.nama_barang, stok: b.stok }));
    return { totalBarang, totalMasuk, totalKeluar, stokRendah, stokTertinggi, chart };
  }, [db]);

  const cards = [
    { label: 'Total Barang', value: stats.totalBarang, sub: 'jenis barang', grad: 'from-sky-500 to-blue-600', Icon: Package },
    { label: 'Total Stok Masuk', value: stats.totalMasuk, sub: 'unit', grad: 'from-emerald-500 to-green-600', Icon: ArrowDownToLine },
    { label: 'Total Stok Keluar', value: stats.totalKeluar, sub: 'unit', grad: 'from-rose-500 to-red-600', Icon: ArrowUpFromLine },
    { label: 'Stok Tertinggi', value: stats.stokTertinggi?.stok ?? 0, sub: stats.stokTertinggi?.nama_barang ?? '-', grad: 'from-amber-500 to-orange-600', Icon: TrendingUp },
  ];

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
        {cards.map(({ label, value, sub, grad, Icon }) => (
          <div key={label} className="bg-white rounded-2xl shadow-soft p-5">
            <div className="flex items-start justify-between">
              <div className="min-w-0">
                <p className="text-sm text-slate-500">{label}</p>
                <p className="font-display font-extrabold text-3xl text-ink-900 mt-1">{angka(value)}</p>
                <p className="text-xs text-slate-400 mt-1 truncate max-w-[10rem]">{sub}</p>
              </div>
              <span className={`grid place-items-center w-11 h-11 rounded-xl bg-gradient-to-br ${grad} text-white shadow-lg`}>
                <Icon size={20} />
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-soft p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display font-bold text-lg text-ink-900">Stok per Barang</h2>
              <p className="text-sm text-slate-500">Sisa stok terkini di gudang</p>
            </div>
            <Link to="/persediaan" className="text-sm font-semibold text-brand-600 hover:text-brand-700">Kelola persediaan →</Link>
          </div>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={stats.chart} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="nama" tick={{ fontSize: 11 }} interval={0} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="stok" fill="#10b981" radius={[8, 8, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-soft p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-lg text-ink-900">Stok Menipis</h2>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-100 text-rose-600">&lt; 10 · {stats.stokRendah.length}</span>
          </div>
          <div className="space-y-3">
            {stats.stokRendah.length === 0 && <p className="text-sm text-slate-400 py-6 text-center">Semua stok aman 🎉</p>}
            {stats.stokRendah.map((b) => (
              <div key={b.id_barang} className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink-900 truncate">{b.nama_barang}</p>
                  <p className="text-xs text-slate-400">{kategoriName(b.id_kategori)}</p>
                </div>
                <span className={`shrink-0 text-sm font-bold px-2.5 py-1 rounded-lg ${b.stok === 0 ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'}`}>{b.stok}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
