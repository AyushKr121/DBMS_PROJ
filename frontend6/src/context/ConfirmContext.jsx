import { createContext, useCallback, useContext, useRef, useState } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

const ConfirmCtx = createContext(null);

/**
 *  const confirm = useConfirm();
 *  if (await confirm({ title: 'Delete batch?', message: '…', confirmLabel: 'Delete', danger: true })) { … }
 */
export function ConfirmProvider({ children }) {
  const [state, setState] = useState(null);
  const resolver = useRef(null);

  const confirm = useCallback((opts) => new Promise((resolve) => {
    resolver.current = resolve;
    setState(opts);
  }), []);

  const close = (answer) => {
    resolver.current?.(answer);
    resolver.current = null;
    setState(null);
  };

  return (
    <ConfirmCtx.Provider value={confirm}>
      {children}
      <Modal
        open={!!state}
        onClose={() => close(false)}
        title={state?.title || 'Are you sure?'}
        size="sm"
        footer={(
          <>
            <Button variant="subtle" onClick={() => close(false)}>{state?.cancelLabel || 'Cancel'}</Button>
            <Button variant={state?.danger ? 'danger' : 'primary'} onClick={() => close(true)}>{state?.confirmLabel || 'Confirm'}</Button>
          </>
        )}
      >
        {state?.message && <p className="confirm__msg">{state.message}</p>}
        {state?.items?.length > 0 && (
          <ul className="confirm__list">{state.items.map((i) => <li key={i}>{i}</li>)}</ul>
        )}
      </Modal>
    </ConfirmCtx.Provider>
  );
}

export const useConfirm = () => {
  const v = useContext(ConfirmCtx);
  if (!v) throw new Error('useConfirm must be used inside <ConfirmProvider>');
  return v;
};
