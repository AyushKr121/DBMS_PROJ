import { MONTHS_SHORT } from './constants';

const pad = (n) => String(n).padStart(2, '0');

/** Local (browser) date as yyyy-MM-dd, the format the backend's LocalDate expects. */
export const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};
/** Local time as HH:mm:ss (LocalTime). */
export const nowTime = () => {
  const d = new Date();
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

export const money = (n) =>
  '₹' + Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const round2 = (n) => Math.round((Number(n) + Number.EPSILON) * 100) / 100;
export const pct = (a, b) => (b ? Math.round((Number(a) / Number(b)) * 100) : 0);
export const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));

export const hhmm = (t) => (t ? String(t).slice(0, 5) : '—');
export const timeRange = (b) => (b && (b.start_time || b.end_time) ? `${hhmm(b.start_time)} – ${hhmm(b.end_time)}` : 'Time not set');
export const toApiTime = (t) => (!t ? null : t.length === 5 ? `${t}:00` : t);
export const toMinutes = (t) => {
  if (!t) return null;
  const [h, m] = String(t).split(':').map(Number);
  return h * 60 + (m || 0);
};

export const formatDate = (d) => {
  if (!d) return '—';
  const [y, m, day] = String(d).slice(0, 10).split('-').map(Number);
  if (!y || !m) return String(d);
  return `${day} ${MONTHS_SHORT[m - 1]} ${y}`;
};
export const formatDateTime = (d, t) => `${formatDate(d)}${t ? `, ${hhmm(t)}` : ''}`;
export const stamp = (r, dateKey, timeKey) => `${r?.[dateKey] || ''}T${r?.[timeKey] || ''}`;

/** '' / whitespace -> null, trims strings, leaves numbers/booleans alone. */
export const blankToNull = (v) => {
  if (v === undefined || v === null) return null;
  if (typeof v === 'string') { const t = v.trim(); return t === '' ? null : t; }
  return v;
};
export const numOrNull = (v) => (v === '' || v === undefined || v === null ? null : Number(v));

export const byKey = (list, field, id) => (list || []).find((x) => x[field] === id);

export const fullName = (p, middleNames = []) =>
  p ? [p.first_name, ...middleNames, p.last_name].filter(Boolean).join(' ') : '';

export const initialsOf = (p) => {
  if (!p) return '?';
  const a = (p.first_name || '').trim()[0] || '';
  const b = (p.last_name || '').trim()[0] || '';
  return (a + b).toUpperCase() || (p.email || '?')[0].toUpperCase();
};

/** Build a Map(personId -> ['Middle', 'Names']) from a *_Middle_Name list (ordered by Sequence_No). */
export const middleNameMap = (rows, idField) => {
  const map = new Map();
  [...(rows || [])]
    .sort((a, b) => a.sequence_No - b.sequence_No)
    .forEach((r) => {
      if (!map.has(r[idField])) map.set(r[idField], []);
      map.get(r[idField]).push(r.middle_Name);
    });
  return map;
};

export const randomPassword = (len = 10) => {
  const chars = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789';
  let out = '';
  const buf = new Uint32Array(len);
  (globalThis.crypto || window.crypto).getRandomValues(buf);
  for (let i = 0; i < len; i++) out += chars[buf[i] % chars.length];
  return out;
};

export const plural = (n, one, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;
export const sortDesc = (rows, fn) => [...rows].sort((a, b) => (fn(b) > fn(a) ? 1 : fn(b) < fn(a) ? -1 : 0));
export const sortAsc = (rows, fn) => [...rows].sort((a, b) => (fn(a) > fn(b) ? 1 : fn(a) < fn(b) ? -1 : 0));
