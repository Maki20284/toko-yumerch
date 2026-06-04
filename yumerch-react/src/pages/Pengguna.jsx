import { useMemo, useState } from 'react';
import { Search, Plus, Pencil, Trash2, Eye } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useToast } from '../context/ToastContext';
import { Modal, ConfirmDialog, Field, inputCls, Button } from '../components/ui';

const empty = { nama: '', username: '', password: '', role: 'staff' };
const roleLabel = { administrator: 'Administrator', owner: 'Owner', staff: 'Staff' };

export default function Pengguna() {
  const { db, addUser, updateUser, deleteUser } = useStore();
  const toast = useToast();
  const [q, setQ] = useState('');
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [detail, setDetail] = useState(null);
  const [hapus, setHapus] = useState(null);

  const list = useMemo(() => {
    const s = q.toLowerCase();
    return db.users
      .filter((u) => u.nama.toLowerCase().includes(s) || u.username.toLowerCase().includes(s))
      .sort((a, b) => b.id_user - a.id_user);
  }, [db.users, q]);

  const openTambah = () => { setForm(empty); setEditId(null); setShowForm(true); };
  const openEdit = (u) => { setForm({ nama: u.nama, username: u.username, password: '', role: u.role }); setEditId(u.id_user); setShowForm(true); };

  const submit = async (e) => {
    e.preventDefault();
    const res = editId ? await updateUser(editId, form) : await addUser(form);
    if (res.ok) { toast(editId ? 'Pengguna diperbarui.' : 'Pengguna ditambahkan.'); setShowForm(false); }
    else toast(res.message, 'error');
  };

  const confirmHapus = async () => {
    const res = await deleteUser(hapus.id_user);
    toast(res.ok ? 'Pengguna dihapus.' : res.message, res.ok ? 'success' : 'error');
    setHapus(null);
  };

  return (
    <div className="bg-white rounded-2xl shadow-soft p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <h2 className="font-display font-bold text-xl text-ink-900">Daftar Pengguna</h2>
        <div className="flex gap-2">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari pengguna…"
              className="pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-400 outline-none text-sm" />
          </div>
          <Button variant="brand" onClick={openTambah}><Plus size={16} /> Tambah Pengguna</Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-400 border-b border-slate-100">
              <th className="py-3 px-3 font-medium w-12">ID</th>
              <th className="py-3 px-3 font-medium">Nama</th>
              <th className="py-3 px-3 font-medium">Username</th>
              <th className="py-3 px-3 font-medium">Role</th>
              <th className="py-3 px-3 font-medium text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {list.map((u) => (
              <tr key={u.id_user} className="border-b border-slate-50 hover:bg-slate-50/60">
                <td className="py-3 px-3 text-slate-400">{u.id_user}</td>
                <td className="py-3 px-3 font-semibold text-ink-900">{u.nama}</td>
                <td className="py-3 px-3 text-slate-600">{u.username}</td>
                <td className="py-3 px-3">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">{roleLabel[u.role]}</span>
                </td>
                <td className="py-3 px-3">
                  <div className="flex items-center justify-center gap-1.5">
                    <button onClick={() => setDetail(u)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"><Eye size={16} /></button>
                    <button onClick={() => openEdit(u)} className="p-2 rounded-lg hover:bg-blue-50 text-blue-600"><Pencil size={16} /></button>
                    <button onClick={() => setHapus(u)} className="p-2 rounded-lg hover:bg-rose-50 text-accent-500"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {list.length === 0 && <tr><td colSpan={5} className="py-10 text-center text-slate-400">Tidak ada pengguna.</td></tr>}
          </tbody>
        </table>
      </div>

      {/* Form tambah/edit */}
      <Modal open={showForm} onClose={() => setShowForm(false)} title={editId ? 'Edit Pengguna' : 'Tambah Pengguna'}
        footer={<><Button variant="ghost" onClick={() => setShowForm(false)}>Batal</Button><Button variant="brand" form="usrForm" type="submit">Simpan</Button></>}>
        <form id="usrForm" onSubmit={submit} className="space-y-4">
          <Field label="Nama"><input required className={inputCls} value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} /></Field>
          <Field label="Username"><input required className={inputCls} value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} /></Field>
          <Field label={editId ? 'Password (kosongkan jika tidak diubah)' : 'Password'}>
            <input type="password" required={!editId} className={inputCls} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </Field>
          <Field label="Role">
            <select className={inputCls} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="administrator">Administrator</option>
              <option value="owner">Owner</option>
              <option value="staff">Staff</option>
            </select>
          </Field>
        </form>
      </Modal>

      {/* Detail */}
      <Modal open={!!detail} onClose={() => setDetail(null)} title="Detail Pengguna"
        footer={<Button variant="outline" onClick={() => setDetail(null)}>Tutup</Button>}>
        {detail && (
          <dl className="space-y-1 text-sm">
            <Row label="ID" value={detail.id_user} />
            <Row label="Nama" value={detail.nama} />
            <Row label="Username" value={detail.username} />
            <Row label="Role" value={roleLabel[detail.role]} />
          </dl>
        )}
      </Modal>

      <ConfirmDialog open={!!hapus} onClose={() => setHapus(null)} onConfirm={confirmHapus}
        title="Hapus Pengguna?" message={hapus ? `Pengguna "${hapus.nama}" akan dihapus permanen.` : ''} />
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
