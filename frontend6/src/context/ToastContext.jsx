import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import Icon from '@/components/ui/Icon';

const ToastCtx = createContext(null);

export function ToastProvider({ children }) {
  const [items, setItems] = useState([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id) => setItems((l) => l.filter((t) => t.id !== id)), []);
  const push = useCallback((tone, message, ms) => {
    const id = ++idRef.current;
    setItems((l) => [...l.slice(-3), { id, tone, message }]);
    setTimeout(() => dismiss(id), ms);
  }, [dismiss]);

  const api = useMemo(() => ({
    success: (m) => push('success', m, 3800),
    error: (m) => push('danger', m, 8000),
    info: (m) => push('info', m, 4500),
  }), [push]);

  return (
    <ToastCtx.Provider value={api}>
      {children}
      <div className="toasts" role="region" aria-live="polite" aria-label="Notifications">
        {items.map((t) => (
          <div key={t.id} className={`toast toast--${t.tone}`} role={t.tone === 'danger' ? 'alert' : 'status'}>
            <Icon name={t.tone === 'success' ? 'checkCircle' : t.tone === 'danger' ? 'alert' : 'info'} size={18} />
            <span className="toast__msg">{t.message}</span>
            <button type="button" className="toast__x" onClick={() => dismiss(t.id)} aria-label="Dismiss"><Icon name="x" size={14} /></button>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export const useToast = () => {
  const v = useContext(ToastCtx);
  if (!v) throw new Error('useToast must be used inside <ToastProvider>');
  return v;
};
