import { useEffect, useId, useRef } from 'react';
import Icon from './Icon';

export default function Modal({ open, onClose, title, children, footer, size = 'md' }) {
  const titleId = useId();
  const panel = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const prev = document.activeElement;
    const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    const first = panel.current?.querySelector('input, select, textarea, button:not(.modal__x)');
    first?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      prev?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="modal" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose?.(); }}>
      <div className={`modal__panel modal__panel--${size}`} role="dialog" aria-modal="true" aria-labelledby={titleId} ref={panel}>
        <header className="modal__head">
          <h3 id={titleId}>{title}</h3>
          <button type="button" className="modal__x" onClick={onClose} aria-label="Close"><Icon name="x" size={18} /></button>
        </header>
        <div className="modal__body">{children}</div>
        {footer && <footer className="modal__foot">{footer}</footer>}
      </div>
    </div>
  );
}
