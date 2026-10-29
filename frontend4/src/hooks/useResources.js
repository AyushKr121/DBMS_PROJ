import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '@/api';

/** Rows never keep the password column in React state. Services re-fetch a fresh row before writing. */
export const stripSecrets = (row) => {
  if (!row || typeof row !== 'object' || !('credential' in row)) return row;
  const { credential, ...rest } = row; // eslint-disable-line no-unused-vars
  return rest;
};

/**
 * Load several lists in parallel:  const s = useResources(['batch', 'course']);  s.d.batch, s.d.course
 * `s.reload()` refreshes quietly (keeps showing the current data).
 */
export function useResources(names) {
  const key = names.join('|');
  const [state, setState] = useState({ d: {}, loading: true, error: null });
  const alive = useRef(true);

  const load = useCallback(async (quiet) => {
    const list = key ? key.split('|') : [];
    if (!quiet) setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const rows = await Promise.all(list.map((n) => api.list(n)));
      const d = Object.fromEntries(list.map((n, i) => [n, rows[i].map(stripSecrets)]));
      if (alive.current) setState({ d, loading: false, error: null });
    } catch (e) {
      if (alive.current) setState((s) => ({ ...s, loading: false, error: e.message || 'Could not load data.' }));
    }
  }, [key]);

  useEffect(() => {
    alive.current = true;
    load(false);
    return () => { alive.current = false; };
  }, [load]);

  const reload = useCallback(() => load(true), [load]);
  return { ...state, reload };
}
