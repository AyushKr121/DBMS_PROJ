import { request, ApiError } from './client';
import { RESOURCES } from './resources';

const def = (name) => {
  const d = RESOURCES[name];
  if (!d) throw new Error(`Unknown resource "${name}"`);
  return d;
};

const seg = (v) => encodeURIComponent(String(v));

/** Key values in controller order, taken from a row object or an array of values. */
export function keyValues(name, rowOrKeys) {
  const d = def(name);
  const vals = Array.isArray(rowOrKeys) ? rowOrKeys : d.keys.map((k) => rowOrKeys?.[k]);
  if (vals.length !== d.keys.length || vals.some((v) => v === undefined || v === null || v === '')) {
    throw new Error(`Incomplete key for ${name} (needs ${d.keys.join(', ')})`);
  }
  return vals;
}
export const pathFor = (name, rowOrKeys) => `${def(name).path}/${keyValues(name, rowOrKeys).map(seg).join('/')}`;

export const api = {
  async list(name) {
    return (await request('GET', def(name).path)) || [];
  },

  async get(name, ...keys) {
    const d = def(name);
    if (d.dateKeys?.length) {
      const rows = await api.list(name);
      const hit = rows.find((r) => d.keys.every((k, i) => String(r[k]) === String(keys[i])));
      if (!hit) throw new ApiError('The requested record was not found.', { status: 404 });
      return hit;
    }
    return request('GET', pathFor(name, keys));
  },

  /**
   * POST /<resource>. The controllers call JPA save(), which behaves as insert-or-update (merge) for every
   * entity, so this is also the safe way to update rows with composite keys. (Their PUT handlers delete the
   * old row first; e.g. PUT /test would cascade-delete every score in `Takes`.)
   */
  save(name, body) {
    return request('POST', def(name).path, body);
  },
  create(name, body) {
    return api.save(name, body);
  },

  /** Update an existing row: PUT for single-key resources, upsert (POST) for composite-key ones. */
  update(name, body) {
    const d = def(name);
    return d.keys.length === 1 ? request('PUT', pathFor(name, body), body) : request('POST', d.path, body);
  },

  remove(name, rowOrKeys) {
    return request('DELETE', pathFor(name, rowOrKeys));
  },
  async removeAll(name, rows) {
    for (const r of rows) await api.remove(name, r); // sequential: some deletes cascade
  },
};

export const authApi = {
  login: (role, email, credential) => request('POST', '/api/auth/login', { role, email, credential }),
  signup: (payload) => request('POST', '/api/auth/signup', payload),
  me: () => request('GET', '/api/auth/me'),
  logout: () => request('POST', '/api/auth/logout'),
};

export { ApiError };
