import crypto from 'crypto';

// Penyimpanan token sederhana di memori: token -> { id_user, nama, role }
// (untuk pengembangan; setelah server restart, user cukup login ulang)
const tokens = new Map();

export const createToken = (user) => {
  const token = crypto.randomBytes(40).toString('hex');
  tokens.set(token, { id_user: user.id_user, nama: user.nama, role: user.role });
  return token;
};

export const revokeToken = (token) => tokens.delete(token);

// Middleware: wajib login (Bearer token)
export function authRequired(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  const user = token ? tokens.get(token) : null;
  if (!user) return res.status(401).json({ message: 'Tidak terautentikasi.' });
  req.user = user;
  req.token = token;
  next();
}

// Hanya owner & administrator yang boleh menulis master data (staff = view only)
export function requireWrite(req, res, next) {
  if (req.user.role === 'staff') return res.status(403).json({ message: 'Anda tidak punya akses.' });
  next();
}

// Hanya owner
export function requireOwner(req, res, next) {
  if (req.user.role !== 'owner') return res.status(403).json({ message: 'Hanya owner yang dapat mengelola pengguna.' });
  next();
}
