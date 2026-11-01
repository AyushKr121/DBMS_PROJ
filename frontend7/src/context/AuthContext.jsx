import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api, authApi } from '@/api';
import { setUnauthorizedHandler } from '@/api/client';
import { loadLastSeen, setLastSeen as persistLastSeen } from '@/api/services';
import { stripSecrets } from '@/hooks/useResources';
import { ROLE_CFG } from '@/utils/constants';

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { id, role, email, profile }
  const [ready, setReady] = useState(false);
  const [lastSeen, setLastSeenState] = useState(null); // null = no global notification has been seen yet
  const [unread, setUnread] = useState(0);

  const hydrate = useCallback(async (session) => {
    const cfg = ROLE_CFG[session.role];
    if (!cfg) throw new Error('Unknown account type.');
    const profile = await api.get(cfg.resource, session.id);
    const seen = await loadLastSeen(session.role, session.id, profile);
    setLastSeenState(seen);
    setUser({ id: session.id, role: session.role, email: session.email || profile.email, profile: stripSecrets(profile) });
    return session.role;
  }, []);

  // Restore the login after a page refresh (the backend keeps an HTTP session).
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const me = await authApi.me();
        await hydrate({ id: me.id, role: me.role, email: me.email });
      } catch {
        if (alive) setUser(null);
      }
      if (alive) setReady(true);
    })();
    return () => { alive = false; };
  }, [hydrate]);

  useEffect(() => {
    setUnauthorizedHandler(() => { setUser(null); });
    return () => setUnauthorizedHandler(null);
  }, []);

  const login = useCallback(async (role, email, password) => {
    const r = await authApi.login(role, email, password);
    try {
      return await hydrate({ id: r.id, role: r.role, email });
    } catch (e) {
      try { await authApi.logout(); } catch { /* ignore */ }
      throw e;
    }
  }, [hydrate]);

  const logout = useCallback(async () => {
    try { await authApi.logout(); } catch { /* the session may already be gone */ }
    setUser(null);
    setLastSeenState(null);
    setUnread(0);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) await hydrate({ id: user.id, role: user.role, email: user.email });
  }, [user, hydrate]);

  /** Unread = global notifications newer than the saved "last seen" id (null means none seen). */
  const refreshUnread = useCallback(async () => {
    if (!user || user.role === 'admin') { setUnread(0); return; }
    try {
      const list = await api.list('globalNotification');
      setUnread(list.filter((n) => lastSeen == null || n.notification_id > lastSeen).length);
    } catch { /* keep the previous count */ }
  }, [user, lastSeen]);

  /** The id only ever moves forward (the schema cannot "un-see" a notification). */
  const markGlobalSeen = useCallback(async (maxId) => {
    if (!user || user.role === 'admin' || !maxId) return;
    if (lastSeen != null && maxId <= lastSeen) return;
    await persistLastSeen(user.role, user.id, maxId);
    setLastSeenState(maxId);
    setUnread(0);
  }, [user, lastSeen]);

  const value = useMemo(() => ({
    user, ready, login, logout, refreshProfile, lastSeen, unread, refreshUnread, markGlobalSeen,
  }), [user, ready, login, logout, refreshProfile, lastSeen, unread, refreshUnread, markGlobalSeen]);

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => {
  const v = useContext(AuthCtx);
  if (!v) throw new Error('useAuth must be used inside <AuthProvider>');
  return v;
};
