import { useState } from 'react';
import { useResources } from '@/hooks/useResources';
import { useAction } from '@/hooks/useAction';
import { useConfirm } from '@/context/ConfirmContext';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { api } from '@/api';
import { addPaymentNote, recordSalary, removePaymentNote } from '@/api/services';
import { MONTHS, ROLE_CFG } from '@/utils/constants';
import { formatDate, fullName, money } from '@/utils/format';
import { personOptions } from '@/utils/batch';
import { gate } from '@/components/ui/Async';
import PageHeader from '@/components/ui/PageHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Field from '@/components/ui/Field';
import Combobox from '@/components/ui/Combobox';
import { Tabs } from '@/components/ui/Tabs';
import DataTable from '@/components/ui/DataTable';
import EmptyState from '@/components/ui/EmptyState';
import SalaryStatus from '@/components/finance/SalaryStatus';

/** Pay and review monthly salaries of teachers or assistants. */
export default function Salaries() {
  useDocumentTitle('Salaries');
  const [role, setRole] = useState('teacher');
  return (
    <>
      <PageHeader title="Salaries" subtitle="Record the salary paid for a month. Each entry gets a reference number." />
      <Tabs value={role} onChange={setRole} label="Staff type" tabs={[{ key: 'teacher', label: 'Teachers' }, { key: 'assistant', label: 'Assistants' }]} />
      <SalaryDesk key={role} role={role} />
    </>
  );
}

function SalaryDesk({ role }) {
  const cfg = ROLE_CFG[role];
  const s = useResources([cfg.resource, cfg.salary, cfg.salaryDetails]);
  const confirm = useConfirm();
  const [run, busy] = useAction();
  const now = new Date();
  const [f, setF] = useState({ person_id: '', month: now.getMonth() + 1, year: now.getFullYear(), amount: '', note: '' });
  const [view, setView] = useState('');
  const [note, setNote] = useState({});
  const g = gate(s);
  if (g) return g;
  const { d } = s;
  const people = d[cfg.resource];
  const pick = people.find((p) => String(p[cfg.idField]) === String(f.person_id));
  const nameOf = (id) => { const p = people.find((x) => x[cfg.idField] === id); return p ? fullName(p) : '—'; };

  const submit = async (e) => {
    e.preventDefault();
    const r = await run(() => recordSalary(role, { person_id: Number(f.person_id), month: f.month, year: f.year, amount: f.amount, notes: f.note ? [f.note] : [] }), 'Salary entry recorded');
    if (r.ok) { setF({ ...f, amount: '', note: '' }); s.reload(); }
  };
  const del = async (p) => {
    if (!(await confirm({ title: `Delete reference #${p.Receipt_id}?`, danger: true, confirmLabel: 'Delete', message: `${nameOf(p[cfg.idField])} · ${MONTHS[p.Month - 1]} ${p.Year} · ${money(p.Amount)}` }))) return;
    const r = await run(() => api.remove(cfg.salary, [p.Receipt_id]), 'Entry deleted');
    if (r.ok) s.reload();
  };
  const addN = async (p) => { const r = await run(() => addPaymentNote(role, p.Receipt_id, note[p.Receipt_id] || ''), 'Note added'); if (r.ok) { setNote({ ...note, [p.Receipt_id]: '' }); s.reload(); } };
  const rmN = async (n) => { const r = await run(() => removePaymentNote(role, n.Receipt_id, n.Description), 'Note removed'); if (r.ok) s.reload(); };
  const rows = [...d[cfg.salary]].sort((a, b) => b.Receipt_id - a.Receipt_id);

  return (
    <div className="stack mt">
      <Card title={`Record a ${cfg.label.toLowerCase()} salary`}>
        <form className="form-grid" onSubmit={submit}>
          <Field label={cfg.label} required><Combobox required options={personOptions(people, cfg.idField)} value={f.person_id} onChange={(v) => setF({ ...f, person_id: v, amount: pick?.Salary ?? f.amount })} clearable={false} /></Field>
          <Field label="Month" required><select value={f.month} onChange={(e) => setF({ ...f, month: Number(e.target.value) })}>{MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}</select></Field>
          <Field label="Year" required><input type="number" min="2000" max="2100" value={f.year} onChange={(e) => setF({ ...f, year: e.target.value })} /></Field>
          <Field label="Amount (₹)" required hint={pick?.Salary != null ? `Agreed salary: ${money(pick.Salary)}` : undefined}><input required type="number" min="0" step="0.01" value={f.amount} onChange={(e) => setF({ ...f, amount: e.target.value })} /></Field>
          <Field label="Note"><input maxLength={255} value={f.note} onChange={(e) => setF({ ...f, note: e.target.value })} placeholder="e.g. Includes bonus" /></Field>
          <div className="form-actions align-end"><Button type="submit" icon="check" loading={busy}>Record</Button></div>
        </form>
      </Card>
      <Card title="Month-by-month status" subtitle="Pick a person to see which months are paid.">
        <Field label={cfg.label}><Combobox options={personOptions(people, cfg.idField)} value={view} onChange={setView} placeholder={`Choose a ${cfg.label.toLowerCase()}`} /></Field>
        {view ? <SalaryStatus role={role} id={Number(view)} /> : null}
      </Card>
      <Card flush title="All entries">
        <DataTable rows={rows} rowKey={(p) => p.Receipt_id} empty={<EmptyState icon="dollar" title="No salary entries yet" />}
          columns={[
            { key: 'r', header: 'Reference no.', sortValue: (p) => p.Receipt_id, render: (p) => <span className="mono">#{p.Receipt_id}</span> },
            { key: 'p', header: cfg.label, render: (p) => nameOf(p[cfg.idField]) },
            { key: 'm', header: 'For', sortValue: (p) => p.Year * 12 + p.Month, render: (p) => `${MONTHS[p.Month - 1]} ${p.Year}` },
            { key: 'a', header: 'Amount', align: 'num', sortValue: (p) => Number(p.Amount), render: (p) => money(p.Amount) },
            { key: 'd', header: 'Paid on', render: (p) => formatDate(p.Salary_payment_date) },
            { key: 'n', header: 'Notes', render: (p) => (
              <div className="stack-sm">
                {d[cfg.salaryDetails].filter((n) => n.Receipt_id === p.Receipt_id).map((n) => <span key={n.Description} className="chip-note">{n.Description}<button type="button" aria-label="Remove note" onClick={() => rmN(n)}>×</button></span>)}
                <span className="row"><input aria-label="Add note" placeholder="Add note" value={note[p.Receipt_id] || ''} onChange={(e) => setNote({ ...note, [p.Receipt_id]: e.target.value })} /><Button size="sm" variant="subtle" disabled={busy || !(note[p.Receipt_id] || '').trim()} onClick={() => addN(p)}>Add</Button></span>
              </div>) },
            { key: 'x', header: '', actions: true, render: (p) => <Button size="sm" variant="danger-outline" icon="trash" aria-label="Delete entry" onClick={() => del(p)} /> },
          ]} />
      </Card>
    </div>
  );
}
