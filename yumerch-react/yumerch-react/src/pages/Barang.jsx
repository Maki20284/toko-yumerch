import { useMemo, useState } from 'react';
import { Search, Plus, Pencil, Trash2, Eye } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useToast } from '../context/ToastContext';
import { Modal, ConfirmDialog, Field, inputCls, Button, StatusBadge } from '../components/ui';
import { rupiah } from '../utils/format';

const empty = { kode_barang: '', nama_barang: '', id_kategori: '', harga: '', stok: '' };

export default function Barang() {
  const { db, kategoriName, addBarang, updateBarang, deleteBarang, can } = useStore();
  const toast = useToast();
  const [q, setQ] = useState('');
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [detail, setDetail] = useState(null);
  const [hapus, setHapus] = useState(null);

  const list = useMemo(() => {
    const s = q.toLowerCase();
    return db.barang
      .filter((b) => b.nama_barang.toLowerCase().includes(s) || b.kode_barang.toLowerCase().includes(s))
      .sort((a, b) => b.id_barang - a.id_barang);
  }, [db.barang, q]);

  const openTambah = () => { setForm(empty); setEditId(null); setShowForm(true); };
  const openEdit = (b) => {
    setForm({ kode_barang: b.kode_barang, nama_barang: b.nama_barang, id_kategori: b.id_kategori, harga: b.harga, stok: b.stok });
    setEditId(b.id_barang); setShowForm(true);
  };

  const submit = (e) => {
    e.preventDefault();
    const payload = { ...form, id_kategori: Number(form.id_kategori), harga: Number(form.harga), stok: Number(form.stok) };
    if (editId) { updateBarang(editId, payload); toast('Barang diperbarui.'); }
    else { addBarang(payload); toast('Barang ditambahkan.'); }
    setShowForm(false);
  };

  const confirmHapus = () => { deleteBarang(hapus.id_barang); toast('Barang dihapus.'); setHapus(null); };

  return (
    <div className="bg-white rounded-2xl shadow-soft p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <h2 className="font-display font-bold text-xl text-ink-900">Daftar Barang</h2>
        <div className="flex gap-2">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari barang…"
              className="pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-400 outline-none text-sm" />
          </div>
          <Button variant="brand" onClick={openTambah} className={can.editMaster ? '' : 'hidden'}><Plus size={16} /> Tambah Barang</Button>
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
              <th className="py-3 px-3 font-medium text-center">Stok</th>
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
                <td className="py-3 px-3 text-center font-bold">{b.stok}</td>
                <td className="py-3 px-3 text-center"><StatusBadge status={b.status} /></td>
                <td className="py-3 px-3">
                  <div className="flex items-center justify-center gap-1.5">
                    <button onClick={() => setDetail(b)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"><Eye size={16} /></button>
                    {can.editMaster && <>
                      <button onClick={() => openEdit(b)} className="p-2 rounded-lg hover:bg-blue-50 text-blue-600"><Pencil size={16} /></button>
                      <button onClick={() => setHapus(b)} className="p-2 rounded-lg hover:bg-rose-50 text-accent-500"><Trash2 size={16} /></button>
                    </>}
                  </div>
                </td>
              </tr>
            ))}
            {list.length === 0 && <tr><td colSpan={7} className="py-10 text-center text-slate-400">Tidak ada barang.</td></tr>}
          </tbody>
        </table>
      </div>

      {/* Form tambah/edit */}
      <Modal open={showForm} onClose={() => setShowForm(false)} title={editId ? 'Edit Barang' : 'Tambah Barang'} size="lg"
        footer={<><Button variant="ghost" onClick={() => setShowForm(false)}>Batal</Button><Button variant="brand" form="brgForm" type="submit">Simpan</Button></>}>
        <form id="brgForm" onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Kode Barang"><input required className={inputCls} value={form.kode_barang} onChange={(e) => setForm({ ...form, kode_barang: e.target.value })} /></Field>
          <Field label="Nama Barang"><input required className={inputCls} value={form.nama_barang} onChange={(e) => setForm({ ...form, nama_barang: e.target.value })} /></Field>
          <Field label="Kategori">
            <select required className={inputCls} value={form.id_kategori} onChange={(e) => setForm({ ...form, id_kategori: e.target.value })}>
              <option value="">— Pilih Kategori —</option>
              {db.kategori.map((k) => <option key={k.id_kategori} value={k.id_kategori}>{k.nama_kategori}</option>)}
            </select>
          </Field>
          <Field label="Harga (Rp)"><input type="number" min="0" required className={inputCls} value={form.harga} onChange={(e) => setForm({ ...form, harga: e.target.value })} /></Field>
          <Field label="Stok"><input type="number" min="0" required className={inputCls} value={form.stok} onChange={(e) => setForm({ ...form, stok: e.target.value })} /></Field>
        </form>
      </Modal>

      {/* Detail */}
      <Modal open={!!detail} onClose={() => setDetail(null)} title="Detail Barang"
        footer={<Button variant="outline" onClick={() => setDetail(null)}>Tutup</Button>}>
        {detail && (
          <dl className="space-y-1 text-sm">
            <Row label="Kode Barang" value={detail.kode_barang} />
            <Row label="Nama Barang" value={detail.nama_barang} />
            <Row label="Kategori" value={kategoriName(detail.id_kategori)} />
            <Row label="Harga" value={rupiah(detail.harga)} />
            <Row label="Stok" value={detail.stok} />
            <Row label="Status" value={<StatusBadge status={detail.status} />} />
          </dl>
        )}
      </Modal>

      <ConfirmDialog open={!!hapus} onClose={() => setHapus(null)} onConfirm={confirmHapus}
        title="Hapus Barang?" message={hapus ? `Barang "${hapus.nama_barang}" beserta riwayat transaksinya akan dihapus.` : ''} />
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between items-center gap-4 py-2 border-b border-slate-50">
      <dt className="text-slate-500">{label}</dt>
      <dd className="font-semibold text-ink-900 text-right">{value}</dd>
    </div>
  );
}
