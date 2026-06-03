export const rupiah = (n) =>
  'Rp ' + Number(n || 0).toLocaleString('id-ID');

export const angka = (n) =>
  Number(n || 0).toLocaleString('id-ID');

export const tanggalID = (s) => {
  if (!s) return '-';
  const d = new Date(s + 'T00:00:00');
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const today = () => new Date().toISOString().slice(0, 10);
