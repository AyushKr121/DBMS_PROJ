import { useState } from 'react';
import { useResources } from '@/hooks/useResources';
import { useAction } from '@/hooks/useAction';
import { addMiddleName, removeMiddleName, renameMiddleName } from '@/api/services';
import { ROLE_CFG } from '@/utils/constants';
import { gate } from '@/components/ui/Async';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';

/** Middle names are a multi-valued attribute (<Role>_Middle_Name, ordered by Sequence_No). Staff only. */
export default function MiddleNamesManager({ role, id, canEdit = true }) {
  const cfg = ROLE_CFG[role];
  const s = useResources([cfg.middle]);
  const [run, busy] = useAction();
  const [name, setName] = useState('');
  const [edit, setEdit] = useState(null); // { seq, value }

  const g = gate(s);
  if (g) return g;
  const mine = s.d[cfg.middle].filter((r) => r[cfg.idField] === id).sort((a, b) => a.Sequence_No - b.Sequence_No);

  const add = async (e) => {
    e.preventDefault();
    const r = await run(() => addMiddleName(role, id, name), 'Middle name added');
    if (r.ok) { setName(''); s.reload(); }
  };
  const save = async () => {
    const r = await run(() => renameMiddleName(role, id, edit.seq, edit.value), 'Middle name updated');
    if (r.ok) { setEdit(null); s.reload(); }
  };
  const del = async (seq) => {
    const r = await run(() => removeMiddleName(role, id, seq), 'Middle name removed');
    if (r.ok) s.reload();
  };

  return (
    <div className="stack-sm">
      {mine.length === 0 ? <p className="muted small">No middle names.</p> : (
        <div className="tags">
          {mine.map((m) => (
            edit?.seq === m.Sequence_No ? (
              <span className="pill-input" key={m.Sequence_No}>
                <input aria-label="Middle name" value={edit.value} onChange={(e) => setEdit({ ...edit, value: e.target.value })} />
                <Button size="sm" onClick={save} loading={busy}>Save</Button>
                <Button size="sm" variant="subtle" onClick={() => setEdit(null)}>Cancel</Button>
              </span>
            ) : (
              <span className="tag" key={m.Sequence_No}>
                {m.Middle_Name}
                {canEdit && (
                  <>
                    <button type="button" onClick={() => setEdit({ seq: m.Sequence_No, value: m.Middle_Name })} aria-label={`Edit ${m.Middle_Name}`}><Icon name="edit" size={13} /></button>
                    <button type="button" onClick={() => del(m.Sequence_No)} aria-label={`Remove ${m.Middle_Name}`} disabled={busy}><Icon name="x" size={13} /></button>
                  </>
                )}
              </span>
            )
          ))}
        </div>
      )}
      {canEdit && (
        <form className="pill-input" onSubmit={add}>
          <input placeholder="Add a middle name" aria-label="New middle name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Button type="submit" size="sm" icon="plus" loading={busy}>Add</Button>
        </form>
      )}
    </div>
  );
}
