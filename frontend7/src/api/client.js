const BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080').replace(/\/+$/, '');

import { FIELD_COLUMNS } from './fields';

export const API_BASE = BASE;

/* ------------------------------------------------------------------------------------------
   Property-name adapter. The database uses PascalCase columns (Student_id, First_name, DOB…).
   Depending on how the server serialises entities the JSON may arrive as student_id / Student_id /
   STUDENT_ID. The app works with ONE spelling (the keys of FIELD_COLUMNS); this layer converts
   every response to it, and converts requests back to the spelling the server is using.
   ------------------------------------------------------------------------------------------ */
const squash = (k) => String(k).toLowerCase().replace(/_/g, '');
const CANON = new Map();
Object.keys(FIELD_COLUMNS).forEach((c) => { CANON.set(String(c).toLowerCase(), c); CANON.set(squash(c), c); });
let serverStyle = 'unknown'; // 'canonical' | 'pascal' | 'unknown'

const canonicalKey = (k) => CANON.get(String(k).toLowerCase()) || CANON.get(squash(k)) || k;

export function normalizeIn(data) {
  if (Array.isArray(data)) return data.map(normalizeIn);
  if (!data || typeof data !== 'object') return data;
  const out = {};
  for (const [k, v] of Object.entries(data)) {
    const c = canonicalKey(k);
    if (c in FIELD_COLUMNS && serverStyle === 'unknown') serverStyle = k === c ? 'canonical' : k === FIELD_COLUMNS[c] ? 'pascal' : serverStyle;
    out[c] = v;
  }
  return out;
}

export function normalizeOut(body) {
  if (Array.isArray(body)) return body.map(normalizeOut);
  if (!body || typeof body !== 'object') return body;
  const out = {};
  for (const [k, v] of Object.entries(body)) {
    const col = FIELD_COLUMNS[k];
    if (!col) { out[k] = v; continue; }
    if (serverStyle === 'pascal') out[col] = v;
    else if (serverStyle === 'canonical') out[k] = v;
    else { out[k] = v; out[col] = v; } // not known yet: send both, the server ignores the one it does not use
  }
  return out;
}

export class ApiError extends Error {
  constructor(message, { status = 0, body = null, network = false } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
    this.network = network;
  }
}

let unauthorizedHandler = null;
/** Called when a data endpoint answers 401 (session expired). */
export const setUnauthorizedHandler = (fn) => { unauthorizedHandler = fn; };

/** Turn raw database messages (returned by /auth/signup as `details`) into plain language. */
export function humanizeDbError(text) {
  const t = String(text || '');
  if (/duplicate/i.test(t) && /aadhar/i.test(t)) return 'This Aadhar number is already registered.';
  if (/duplicate/i.test(t) && /primary/i.test(t)) return 'A record with the same ID already exists.';
  if (/duplicate/i.test(t)) return 'A record with the same value already exists.';
  if (/foreign key/i.test(t) && /pincode/i.test(t)) return 'That pincode is not in the system. Add it under Pincodes first.';
  if (/foreign key/i.test(t)) return 'A related record does not exist, or this record is still in use.';
  if (/cannot be null/i.test(t)) return 'A required field is missing.';
  if (/data too long/i.test(t)) return 'One of the values is too long.';
  return t;
}

// Spring's default error JSON looks like {timestamp,status,error,path}. Custom ones are {error|message}.
const isSpringDefault = (b) => b && typeof b === 'object' && 'status' in b && 'path' in b && 'timestamp' in b;

function messageFor(status, body, method) {
  if (body && typeof body === 'object') {
    if (body.details) return `${body.error || 'Request failed'}: ${humanizeDbError(body.details)}`;
    if (!isSpringDefault(body) && (body.error || body.message)) return String(body.error || body.message);
    if (isSpringDefault(body) && body.message) return String(body.message);
  } else if (typeof body === 'string' && body.trim()) {
    return body.slice(0, 200);
  }
  if (status === 400) return 'The server could not accept this data. Please check the values and try again.';
  if (status === 401) return 'Please log in again.';
  if (status === 404) return 'The requested record was not found.';
  if (status === 405) return 'This action is not supported by the server.';
  if (status >= 500) {
    return method === 'GET'
      ? 'The server had a problem loading this data.'
      : 'The server rejected this change. A database rule was probably broken (a duplicate, a missing reference or a required value).';
  }
  return `Request failed (${status}).`;
}

export async function request(method, path, body) {
  let res;
  try {
    res = await fetch(BASE + path, {
      method,
      credentials: 'include', // the backend keeps the login in an HTTP session cookie
      headers: body !== undefined ? { 'Content-Type': 'application/json' } : {},
      body: body !== undefined ? JSON.stringify(path.startsWith('/api/auth/') ? body : normalizeOut(body)) : undefined,
    });
  } catch {
    throw new ApiError(`Cannot reach the server at ${BASE}. Check that the backend is running.`, { network: true });
  }
  const text = await res.text();
  let data = null;
  if (text) {
    try { data = JSON.parse(text); } catch { data = text; }
  }
  if (!res.ok) {
    if (res.status === 401 && !path.startsWith('/api/auth/') && unauthorizedHandler) unauthorizedHandler();
    throw new ApiError(messageFor(res.status, data, method), { status: res.status, body: data });
  }
  return path.startsWith('/api/auth/') ? data : normalizeIn(data);
}
