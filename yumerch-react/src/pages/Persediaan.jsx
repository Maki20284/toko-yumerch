import { useMemo, useState } from 'react';
import { Search, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useToast } from '../context/ToastContext';
import { Modal, Field, inputCls, StatusBadge, Button } from '../components/ui';
import { rupiah, today } from '../utils/format';

export default function Persediaan() {
  const { db, kategoriName, catatTransaksi } = useStore();
  const toast = useToast();
  const [q, setQ] = useState('');
  const [modal, setModal] = useState(null); // { jenis, barang }
  const [form, setForm] = useState({ jumlah: '', tanggal: today(), keterangan: '' });

  const list = useMemo(() => {
    const s = q.toLowerCase();
    return db.barang.filter((b) =>
      b.nama_barang.toLowerCase().includes(s) || b.kode_barang.toLowerCase().includes(s));
  }, [db.barang, q]);

  const openModal = (jenis, barang) => {
    setForm({ jumlah: '', tanggal: today(), keterangan: '' });
    setModal({ jenis, barang });
  };

  const submit = async (e) => {
    e.preventDefault();
    const res = await catatTransaksi({ id_barang: modal.barang.id_barang, jenis: modal.jenis, ...form });
    if (res.ok) {
      toast(`Barang ${modal.jenis} berhasil dicatat.`);
      setModal(null);
    } else {
      toast(res.message, 'error');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-soft p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <h2 className="font-display font-bold text-xl text-ink-900">Daftar Persediaan Barang</h2>
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari barang…"
            className="pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-400 outline-none text-sm w-full sm:w-64" />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-400 border-b border-slate-100">
              <th className="py-3 px-3 font-medium">Kode</th>
              <th className="py-3 px-3 font-medium">Nama Barang</th>
              <th className="py-3 px-3 font-medium">Kategori</th>
              <th className="py-3 px-3 font-medium">Harga</th>
              <th className="py-3 px-3 font-medium text-center">Stok Saat Ini</th>
              <th className="py-3 px-3 font-medium text-center">Status</th>
              <th className="py-3 px-3 font-medium text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {list.map((b) => (
              <tr key={b.id_barang} className="border-b border-slate-50 hover:bg-slate-50/60">
                <td className="py-3 px-3 font-mono text-xs text-slate-500">{b.kode_barang}</td>
                <td className="py-3 px-3 font-semibold text-ink-900">{b.nama_barang}</td>
                <td className="py-3 px-3 text-slate-600">{kategoriName(b.id_kategori)}</td>
                <td className="py-3 px-3 text-slate-600">{rupiah(b.harga)}</td>
                <td className="py-3 px-3 text-center">
                  <span className={`font-bold ${b.stok < 10 ? 'text-amber-600' : 'text-ink-900'}`}>{b.stok}</span>
                </td>
                <td className="py-3 px-3 text-center"><StatusBadge status={b.status} stok={b.stok} /></td>
                <td className="py-3 px-3">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => openModal('masuk', b)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-brand-50 text-brand-700 hover:bg-brand-100 text-xs font-semibold">
                      <ArrowDownToLine size={14} /> Masuk
                    </button>
                    <button onClick={() => openModal('keluar', b)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-50 text-accent-600 hover:bg-rose-100 text-xs font-semibold">
                      <ArrowUpFromLine size={14} /> Keluar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr><td colSpan={7} className="py-10 text-center text-slate-400">Tidak ada barang.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal masuk/keluar */}
      <Modal open={!!modal} onClose={() => setModal(null)}
        title={modal ? `Barang ${modal.jenis === 'masuk' ? 'Masuk' : 'Keluar'} — ${modal.barang.nama_barang}` : ''}
        footer={
          <>
            <Button variant="ghost" onClick={() => setModal(null)}>Batal</Button>
            <Button variant={modal?.jenis === 'masuk' ? 'brand' : 'primary'} form="trxForm" type="submit">Simpan</Button>
          </>
        }>
        {modal && (
          <form id="trxForm" onSubmit={submit} className="space-y-4">
            <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm">
              <span className="text-slate-500">Stok saat ini</span>
              <span className="font-bold text-ink-900">{modal.barang.stok} unit</span>
            </div>
            <Field label="Jumlah">
              <input type="number" min="1" required className={inputCls} value={form.jumlah}
                onChange={(e) => setForm({ ...form, jumlah: e.target.value })} />
            </Field>
            <Field label="Tanggal">
              <input type="date" required className={inputCls} value={form.tanggal}
                onChange={(e) => setForm({ ...form, tanggal: e.target.value })} />
            </Field>
            <Field label="Keterangan">
              <input className={inputCls} placeholder="Opsional" value={form.keterangan}
                onChange={(e) => setForm({ ...form, keterangan: e.target.value })} />
            </Field>
          </form>
        )}
      </Modal>
    </div>
  );
}
