const BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080').replace(/\/+$/, '');

export const API_BASE = BASE;

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
      body: body !== undefined ? JSON.stringify(body) : undefined,
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
  return data;
}
