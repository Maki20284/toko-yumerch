import { useMemo, useState } from 'react';
import { Search, Printer, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Button } from '../components/ui';
import { angka, tanggalID } from '../utils/format';

export default function Laporan() {
  const { db, barangName, kategoriName } = useStore();
  const [f, setF] = useState({ dari: '', sampai: '', jenis: '', q: '' });

  const rows = useMemo(() => {
    return db.transaksi
      .map((t) => {
        const b = db.barang.find((x) => x.id_barang === t.id_barang);
        const u = db.users.find((x) => x.id_user === t.id_user);
        return {
          ...t,
          nama_barang: b?.nama_barang ?? barangName(t.id_barang),
          kategori: b ? kategoriName(b.id_kategori) : '-',
          petugas: u?.nama ?? '-',
        };
      })
      .filter((t) => {
        if (f.dari && t.tanggal < f.dari) return false;
        if (f.sampai && t.tanggal > f.sampai) return false;
        if (f.jenis && t.jenis !== f.jenis) return false;
        if (f.q && !t.nama_barang.toLowerCase().includes(f.q.toLowerCase())) return false;
        return true;
      })
      .sort((a, b) => (a.tanggal < b.tanggal ? 1 : -1) || b.id_transaksi - a.id_transaksi);
  }, [db, f, barangName, kategoriName]);

  const totalMasuk = rows.filter((r) => r.jenis === 'masuk').reduce((s, r) => s + r.jumlah, 0);
  const totalKeluar = rows.filter((r) => r.jenis === 'keluar').reduce((s, r) => s + r.jumlah, 0);

  return (
    <div className="space-y-5">
      {/* Filter */}
      <div className="bg-white rounded-2xl shadow-soft p-5">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[180px]">
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Cari barang</label>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={f.q} onChange={(e) => setF({ ...f, q: e.target.value })} placeholder="Nama barang…"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-400 outline-none text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Dari tanggal</label>
            <input type="date" value={f.dari} onChange={(e) => setF({ ...f, dari: e.target.value })}
              className="px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-400 outline-none text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Sampai tanggal</label>
            <input type="date" value={f.sampai} onChange={(e) => setF({ ...f, sampai: e.target.value })}
              className="px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-400 outline-none text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Jenis</label>
            <select value={f.jenis} onChange={(e) => setF({ ...f, jenis: e.target.value })}
              className="px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-400 outline-none text-sm">
              <option value="">Semua</option>
              <option value="masuk">Masuk</option>
              <option value="keluar">Keluar</option>
            </select>
          </div>
          <Button variant="ghost" onClick={() => setF({ dari: '', sampai: '', jenis: '', q: '' })}>Reset</Button>
          <Button variant="primary" onClick={() => window.print()}><Printer size={16} /> Cetak</Button>
        </div>
      </div>

      {/* Ringkasan */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl shadow-soft p-4 flex items-center gap-3">
          <span className="grid place-items-center w-11 h-11 rounded-xl bg-brand-100 text-brand-700"><ArrowDownToLine size={20} /></span>
          <div><p className="text-xs text-slate-500">Total Masuk</p><p className="font-display font-extrabold text-2xl text-ink-900">{angka(totalMasuk)}</p></div>
        </div>
        <div className="bg-white rounded-2xl shadow-soft p-4 flex items-center gap-3">
          <span className="grid place-items-center w-11 h-11 rounded-xl bg-rose-100 text-accent-600"><ArrowUpFromLine size={20} /></span>
          <div><p className="text-xs text-slate-500">Total Keluar</p><p className="font-display font-extrabold text-2xl text-ink-900">{angka(totalKeluar)}</p></div>
        </div>
        <div className="bg-white rounded-2xl shadow-soft p-4 flex items-center gap-3">
          <span className="grid place-items-center w-11 h-11 rounded-xl bg-slate-100 text-slate-600 font-bold">{rows.length}</span>
          <div><p className="text-xs text-slate-500">Total Transaksi</p><p className="font-display font-extrabold text-2xl text-ink-900">{angka(rows.length)}</p></div>
        </div>
      </div>

      {/* Tabel */}
      <div className="bg-white rounded-2xl shadow-soft p-6">
        <h2 className="font-display font-bold text-xl text-ink-900 mb-1">Keluar Masuk Barang</h2>
        <p className="text-sm text-slate-500 mb-5">Riwayat transaksi persediaan</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-100">
                <th className="py-3 px-3 font-medium">Tanggal</th>
                <th className="py-3 px-3 font-medium">Nama Barang</th>
                <th className="py-3 px-3 font-medium">Kategori</th>
                <th className="py-3 px-3 font-medium text-center">Jenis</th>
                <th className="py-3 px-3 font-medium text-center">Jumlah</th>
                <th className="py-3 px-3 font-medium">Keterangan</th>
                <th className="py-3 px-3 font-medium">Petugas</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((t) => (
                <tr key={t.id_transaksi} className="border-b border-slate-50 hover:bg-slate-50/60">
                  <td className="py-3 px-3 text-slate-600 whitespace-nowrap">{tanggalID(t.tanggal)}</td>
                  <td className="py-3 px-3 font-semibold text-ink-900">{t.nama_barang}</td>
                  <td className="py-3 px-3 text-slate-600">{t.kategori}</td>
                  <td className="py-3 px-3 text-center">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${t.jenis === 'masuk' ? 'bg-brand-100 text-brand-700' : 'bg-rose-100 text-accent-600'}`}>
                      {t.jenis === 'masuk' ? 'Masuk' : 'Keluar'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center font-bold">{t.jumlah}</td>
                  <td className="py-3 px-3 text-slate-600">{t.keterangan}</td>
                  <td className="py-3 px-3 text-slate-600">{t.petugas}</td>
                </tr>
              ))}
              {rows.length === 0 && <tr><td colSpan={7} className="py-10 text-center text-slate-400">Tidak ada transaksi pada filter ini.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
