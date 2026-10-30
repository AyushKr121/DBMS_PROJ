import { useEffect, useId, useMemo, useRef, useState } from 'react';

/**
 * Searchable select: click to pick or type to filter. Values keep their original type (numbers stay numbers).
 *   options: [{ value, label, sub? }]
 */
export default function Combobox({ options, value, onChange, placeholder = 'Search or choose…', disabled, required, id, emptyText = 'No matches', clearable = true }) {
  const autoId = useId();
  const listId = `${autoId}-list`;
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [hi, setHi] = useState(0);
  const wrap = useRef(null);

  const selected = options.find((o) => String(o.value) === String(value));
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? options.filter((o) => `${o.label} ${o.sub || ''}`.toLowerCase().includes(s)) : options;
  }, [options, q]);

  useEffect(() => {
    const onDown = (e) => { if (wrap.current && !wrap.current.contains(e.target)) { setOpen(false); setQ(''); } };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  const pick = (o) => { onChange(o.value); setOpen(false); setQ(''); };

  const onKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(true); setHi((h) => Math.min(h + 1, filtered.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setHi((h) => Math.max(h - 1, 0)); }
    else if (e.key === 'Enter' && open) { e.preventDefault(); if (filtered[hi]) pick(filtered[hi]); }
    else if (e.key === 'Escape' || e.key === 'Tab') { setOpen(false); setQ(''); }
  };

  return (
    <div className="combo" ref={wrap}>
      <div className="combo__control">
        <input
          id={id}
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          autoComplete="off"
          disabled={disabled}
          required={required}
          placeholder={placeholder}
          value={open ? q : selected?.label || ''}
          onChange={(e) => { setQ(e.target.value); setOpen(true); setHi(0); }}
          onFocus={() => setOpen(true)}
          onClick={() => setOpen(true)}
          onKeyDown={onKey}
        />
        {clearable && selected && !disabled && (
          <button type="button" className="combo__clear" aria-label="Clear selection" onClick={() => { onChange(''); setQ(''); }}>×</button>
        )}
      </div>
      {open && !disabled && (
        <ul className="combo__list" id={listId} role="listbox">
          {filtered.length === 0 && <li className="combo__empty">{emptyText}</li>}
          {filtered.map((o, i) => (
            <li
              key={String(o.value)}
              role="option"
              aria-selected={i === hi || String(o.value) === String(value)}
              className="combo__option"
              onMouseEnter={() => setHi(i)}
              onMouseDown={(e) => { e.preventDefault(); pick(o); }}
            >
              <span>{o.label}</span>
              {o.sub && <small>{o.sub}</small>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
