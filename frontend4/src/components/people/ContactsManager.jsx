import { useState } from 'react';
import { useResources } from '@/hooks/useResources';
import { useAction } from '@/hooks/useAction';
import { addPhone, removePhone } from '@/api/services';
import { ROLE_CFG } from '@/utils/constants';
import { gate } from '@/components/ui/Async';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';

/** Phone numbers are a multi-valued attribute: each one is its own row in <Role>_Contacts. */
export default function ContactsManager({ role, id, canEdit = true }) {
  const cfg = ROLE_CFG[role];
  const s = useResources([cfg.contacts]);
  const [run, busy] = useAction();
  const [phone, setPhone] = useState('');

  const g = gate(s);
  if (g) return g;
  const mine = s.d[cfg.contacts].filter((r) => r[cfg.idField] === id);

  const add = async (e) => {
    e.preventDefault();
    const r = await run(() => addPhone(role, id, phone), 'Phone number added');
    if (r.ok) { setPhone(''); s.reload(); }
  };
  const del = async (p) => {
    const r = await run(() => removePhone(role, id, p), 'Phone number removed');
    if (r.ok) s.reload();
  };

  return (
    <div className="stack-sm">
      {mine.length === 0 ? <p className="muted small">No phone numbers saved.</p> : (
        <div className="tags">
          {mine.map((c) => (
            <span className="tag" key={c.phone_no}>
              <Icon name="phone" size={13} /> {c.phone_no}
              {canEdit && <button type="button" onClick={() => del(c.phone_no)} aria-label={`Remove ${c.phone_no}`} disabled={busy}><Icon name="x" size={13} /></button>}
            </span>
          ))}
        </div>
      )}
      {canEdit && (
        <form className="pill-input" onSubmit={add}>
          <input type="tel" inputMode="tel" placeholder="Add a phone number, e.g. 9876543210" aria-label="New phone number" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          <Button type="submit" size="sm" icon="plus" loading={busy}>Add</Button>
        </form>
      )}
    </div>
  );
}
