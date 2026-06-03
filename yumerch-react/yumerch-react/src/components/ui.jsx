import { useEffect } from 'react';
import { X, AlertTriangle } from 'lucide-react';

/* ---------- Modal (pop-up form) ---------- */
export function Modal({ open, onClose, title, children, footer, size = 'md' }) {
  useEffect(() => {
    const onEsc = (e) => e.key === 'Escape' && onClose();
    if (open) document.addEventListener('keydown', onEsc);
    return () => document.removeEventListener('keydown', onEsc);
  }, [open, onClose]);

  if (!open) return null;
  const w = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl' }[size];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full ${w} bg-white rounded-2xl shadow-2xl animate-[pop_.15s_ease-out]`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-display font-bold text-lg text-ink-900">{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400">
            <X size={20} />
          </button>
        </div>
        <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">{children}</div>
        {footer && <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-2">{footer}</div>}
      </div>
      <style>{`@keyframes pop{from{opacity:0;transform:translateY(8px) scale(.98)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
}

/* ---------- Konfirmasi hapus ---------- */
export function ConfirmDialog({ open, onClose, onConfirm, title = 'Hapus data?', message }) {
  if (!open) return null;
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm"
      footer={
        <>
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-sm">Batal</button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-xl bg-accent-500 hover:bg-accent-600 text-white font-semibold text-sm">Ya, Hapus</button>
        </>
      }>
      <div className="flex gap-3">
        <span className="grid place-items-center w-11 h-11 shrink-0 rounded-full bg-rose-100 text-accent-500">
          <AlertTriangle size={22} />
        </span>
        <p className="text-sm text-slate-600 pt-1">{message || 'Tindakan ini tidak dapat dibatalkan.'}</p>
      </div>
    </Modal>
  );
}

/* ---------- Tombol primary ---------- */
export function Button({ children, variant = 'primary', className = '', ...props }) {
  const styles = {
    primary: 'bg-ink-900 hover:bg-brand-600 text-white',
    brand: 'bg-brand-500 hover:bg-brand-600 text-white',
    ghost: 'text-slate-600 hover:bg-slate-100',
    outline: 'border border-slate-300 text-slate-700 hover:bg-slate-50',
  }[variant];
  return (
    <button className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition inline-flex items-center gap-2 ${styles} ${className}`} {...props}>
      {children}
    </button>
  );
}

/* ---------- Input field ---------- */
export function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</span>
      {children}
    </label>
  );
}

export const inputCls =
  'w-full rounded-xl border border-slate-300 px-4 py-2.5 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition';

/* ---------- Status badge ---------- */
export function StatusBadge({ status }) {
  const ok = status === 'tersedia';
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${ok ? 'bg-brand-100 text-brand-700' : 'bg-rose-100 text-accent-600'}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${ok ? 'bg-brand-500' : 'bg-accent-500'}`} />
      {ok ? 'Tersedia' : 'Tidak Tersedia'}
    </span>
  );
}

/* ---------- Toast ---------- */
export function Toast({ toast }) {
  if (!toast) return null;
  const ok = toast.type !== 'error';
  return (
    <div className="fixed top-5 right-5 z-[60] animate-[slide_.2s_ease-out]">
      <div className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg text-sm font-medium ${ok ? 'bg-brand-600 text-white' : 'bg-accent-500 text-white'}`}>
        {toast.message}
      </div>
      <style>{`@keyframes slide{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
}
