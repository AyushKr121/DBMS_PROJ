import { useState } from 'react';
import { useResources } from '@/hooks/useResources';
import { useAction } from '@/hooks/useAction';
import { useConfirm } from '@/context/ConfirmContext';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { api } from '@/api';
import { blankToNull } from '@/utils/format';
import { gate } from '@/components/ui/Async';
import PageHeader from '@/components/ui/PageHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Field from '@/components/ui/Field';
import DataTable from '@/components/ui/DataTable';
import SearchInput from '@/components/ui/SearchInput';
import EmptyState from '@/components/ui/EmptyState';

/** Pincode → city/state directory used by every address. */
export default function Pincodes() {
  useDocumentTitle('Pincodes');
  const s = useResources(['pincode', 'student', 'teacher', 'assistant', 'admin']);
  const confirm = useConfirm();
  const [run, busy] = useAction();
  const [f, setF] = useState({ Pincode: '', City: '', State: '' });
  const [editing, setEditing] = useState(false);
  const [q, setQ] = useState('');
  const g = gate(s);
  if (g) return g;
  const { d } = s;
  const usage = (p) => ['student', 'teacher', 'assistant', 'admin'].reduce((t, r) => t + d[r].filter((x) => x.Pincode === p.Pincode).length, 0);
  const needle = q.trim().toLowerCase();
  const rows = d.pincode.filter((p) => !needle || `${p.Pincode} ${p.City} ${p.State}`.toLowerCase().includes(needle));

  const submit = async (e) => {
    e.preventDefault();
    const pin = f.Pincode.trim();
    const city = blankToNull(f.City); const state = blankToNull(f.State);
    const r = await run(async () => {
      if (!/^[0-9A-Za-z -]{3,20}$/.test(pin)) throw new Error('Enter a valid pincode.');
      if (!city || !state) throw new Error('City and state are required.');
      await api.save('pincode', { Pincode: pin, City: city, State: state });
    }, editing ? 'Pincode updated' : 'Pincode saved');
    if (r.ok) { setF({ Pincode: '', City: '', State: '' }); setEditing(false); s.reload(); }
  };
  const del = async (p) => {
    const n = usage(p);
    if (!(await confirm({ title: `Delete pincode ${p.Pincode}?`, danger: true, confirmLabel: 'Delete', message: n ? `${n} account(s) use it; their address pincode will be cleared.` : 'No account uses it.' }))) return;
    const r = await run(() => api.remove('pincode', [p.Pincode]), 'Pincode deleted');
    if (r.ok) s.reload();
  };

  return (
    <>
      <PageHeader title="Pincodes" subtitle="City and state for each pincode used in addresses." />
      <Card title={editing ? 'Edit pincode' : 'Add a pincode'}>
        <form className="form-grid" onSubmit={submit}>
          <Field label="Pincode" required><input required readOnly={editing} value={f.Pincode} onChange={(e) => setF({ ...f, Pincode: e.target.value })} /></Field>
          <Field label="City" required><input required value={f.City} onChange={(e) => setF({ ...f, City: e.target.value })} /></Field>
          <Field label="State" required><input required value={f.State} onChange={(e) => setF({ ...f, State: e.target.value })} /></Field>
          <div className="form-actions align-end"><Button type="submit" loading={busy}>{editing ? 'Save' : 'Add'}</Button>{editing && <Button variant="subtle" onClick={() => { setEditing(false); setF({ Pincode: '', City: '', State: '' }); }}>Cancel</Button>}</div>
        </form>
      </Card>
      <Card flush className="mt" title={`Pincodes (${d.pincode.length})`} actions={<SearchInput value={q} onChange={setQ} placeholder="Search…" />}>
        <DataTable rows={rows} rowKey={(p) => p.Pincode} empty={<EmptyState icon="pin" title="No pincodes" />}
          columns={[
            { key: 'p', header: 'Pincode', sortValue: (p) => p.Pincode, render: (p) => <span className="mono">{p.Pincode}</span> },
            { key: 'c', header: 'City', sortValue: (p) => p.City, render: (p) => p.City },
            { key: 's', header: 'State', sortValue: (p) => p.State, render: (p) => p.State },
            { key: 'u', header: 'Accounts', align: 'num', render: usage },
            { key: 'a', header: '', actions: true, render: (p) => (<><Button size="sm" variant="secondary" onClick={() => { setF({ Pincode: p.Pincode, City: p.City, State: p.State }); setEditing(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Edit</Button><Button size="sm" variant="danger-outline" icon="trash" aria-label="Delete pincode" onClick={() => del(p)} /></>) },
          ]} />
      </Card>
    </>
  );
}
