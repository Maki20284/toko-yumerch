import { useMemo, useState } from 'react';
import { Search, Plus, Pencil, Trash2, Eye } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useToast } from '../context/ToastContext';
import { Modal, ConfirmDialog, Field, inputCls, Button } from '../components/ui';

const empty = { nama_kategori: '', deskripsi: '' };

export default function Kategori() {
  const { db, addKategori, updateKategori, deleteKategori, can } = useStore();
  const toast = useToast();
  const [q, setQ] = useState('');
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [detail, setDetail] = useState(null);
  const [hapus, setHapus] = useState(null);

  const list = useMemo(() => {
    const s = q.toLowerCase();
    return db.kategori
      .map((k) => ({ ...k, jumlah: db.barang.filter((b) => b.id_kategori === k.id_kategori).length }))
      .filter((k) => k.nama_kategori.toLowerCase().includes(s))
      .sort((a, b) => b.id_kategori - a.id_kategori);
  }, [db, q]);

  const openTambah = () => { setForm(empty); setEditId(null); setShowForm(true); };
  const openEdit = (k) => { setForm({ nama_kategori: k.nama_kategori, deskripsi: k.deskripsi || '' }); setEditId(k.id_kategori); setShowForm(true); };

  const submit = (e) => {
    e.preventDefault();
    if (editId) { updateKategori(editId, form); toast('Kategori diperbarui.'); }
    else { addKategori(form); toast('Kategori ditambahkan.'); }
    setShowForm(false);
  };

  const confirmHapus = () => {
    const res = deleteKategori(hapus.id_kategori);
    toast(res.ok ? 'Kategori dihapus.' : res.message, res.ok ? 'success' : 'error');
    setHapus(null);
  };

  return (
    <div className="bg-white rounded-2xl shadow-soft p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <h2 className="font-display font-bold text-xl text-ink-900">Daftar Kategori</h2>
        <div className="flex gap-2">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari kategori…"
              className="pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-400 outline-none text-sm" />
          </div>
          <Button variant="brand" onClick={openTambah} className={can.editMaster ? '' : 'hidden'}><Plus size={16} /> Tambah Kategori</Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-400 border-b border-slate-100">
              <th className="py-3 px-3 font-medium w-12">ID</th>
              <th className="py-3 px-3 font-medium">Nama Kategori</th>
              <th className="py-3 px-3 font-medium">Deskripsi</th>
              <th className="py-3 px-3 font-medium text-center">Jumlah Barang</th>
              <th className="py-3 px-3 font-medium text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {list.map((k) => (
              <tr key={k.id_kategori} className="border-b border-slate-50 hover:bg-slate-50/60">
                <td className="py-3 px-3 text-slate-400">{k.id_kategori}</td>
                <td className="py-3 px-3 font-semibold text-ink-900">{k.nama_kategori}</td>
                <td className="py-3 px-3 text-slate-600 max-w-md truncate">{k.deskripsi || '-'}</td>
                <td className="py-3 px-3 text-center">{k.jumlah}</td>
                <td className="py-3 px-3">
                  <div className="flex items-center justify-center gap-1.5">
                    <button onClick={() => setDetail(k)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"><Eye size={16} /></button>
                    {can.editMaster && <>
                      <button onClick={() => openEdit(k)} className="p-2 rounded-lg hover:bg-blue-50 text-blue-600"><Pencil size={16} /></button>
                      <button onClick={() => setHapus(k)} className="p-2 rounded-lg hover:bg-rose-50 text-accent-500"><Trash2 size={16} /></button>
                    </>}
                  </div>
                </td>
              </tr>
            ))}
            {list.length === 0 && <tr><td colSpan={5} className="py-10 text-center text-slate-400">Tidak ada kategori.</td></tr>}
          </tbody>
        </table>
      </div>

      {/* Form tambah/edit */}
      <Modal open={showForm} onClose={() => setShowForm(false)} title={editId ? 'Edit Kategori' : 'Tambah Kategori'}
        footer={<><Button variant="ghost" onClick={() => setShowForm(false)}>Batal</Button><Button variant="brand" form="katForm" type="submit">Simpan</Button></>}>
        <form id="katForm" onSubmit={submit} className="space-y-4">
          <Field label="Nama Kategori"><input required className={inputCls} value={form.nama_kategori} onChange={(e) => setForm({ ...form, nama_kategori: e.target.value })} /></Field>
          <Field label="Deskripsi"><textarea rows={3} className={inputCls} value={form.deskripsi} onChange={(e) => setForm({ ...form, deskripsi: e.target.value })} /></Field>
        </form>
      </Modal>

      {/* Detail */}
      <Modal open={!!detail} onClose={() => setDetail(null)} title="Detail Kategori"
        footer={<Button variant="outline" onClick={() => setDetail(null)}>Tutup</Button>}>
        {detail && (
          <dl className="space-y-3 text-sm">
            <Row label="ID" value={detail.id_kategori} />
            <Row label="Nama Kategori" value={detail.nama_kategori} />
            <Row label="Deskripsi" value={detail.deskripsi || '-'} />
            <Row label="Jumlah Barang" value={detail.jumlah} />
          </dl>
        )}
      </Modal>

      <ConfirmDialog open={!!hapus} onClose={() => setHapus(null)} onConfirm={confirmHapus}
        title="Hapus Kategori?" message={hapus ? `Kategori "${hapus.nama_kategori}" akan dihapus permanen.` : ''} />
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-4 py-2 border-b border-slate-50">
      <dt className="text-slate-500">{label}</dt>
      <dd className="font-semibold text-ink-900 text-right">{value}</dd>
    </div>
  );
}
