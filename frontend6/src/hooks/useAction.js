import { useCallback, useRef, useState } from 'react';
import { useToast } from '@/context/ToastContext';

/**
 * Runs an async action with a busy flag; success and failure are shown as toasts.
 *   const [run, busy] = useAction();
 *   const r = await run(() => api.save(...), 'Saved');   // r.ok === true on success
 */
export function useAction() {
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const inFlight = useRef(0);

  const run = useCallback(async (fn, success) => {
    inFlight.current += 1;
    setBusy(true);
    try {
      const value = await fn();
      if (success) toast.success(success);
      return { ok: true, value };
    } catch (e) {
      console.error('[action failed]', e);
      toast.error(e?.message || 'Something went wrong.');
      return { ok: false, error: e };
    } finally {
      inFlight.current -= 1;
      if (inFlight.current === 0) setBusy(false);
    }
  }, [toast]);

  return [run, busy];
}
