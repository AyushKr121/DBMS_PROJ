import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useResources } from '@/hooks/useResources';
import { useAction } from '@/hooks/useAction';
import { useConfirm } from '@/context/ConfirmContext';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { api } from '@/api';
import { addPaymentNote, removePaymentNote } from '@/api/services';
import { byKey, formatDate, fullName, money } from '@/utils/format';
import { FEE_STATUS, feeSummary, paymentsOf } from '@/utils/fees';
import { gate } from '@/components/ui/Async';
import PageHeader from '@/components/ui/PageHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Tabs } from '@/components/ui/Tabs';
import DataTable from '@/components/ui/DataTable';
import SearchInput from '@/components/ui/SearchInput';
import EmptyState from '@/components/ui/EmptyState';
import FeeForm from '@/components/finance/FeeForm';

/** Fee desk: record payments, see who owes what, and edit the notes on each receipt. */
export default function Fees() {
  useDocumentTitle('Fees');
  const { user } = useAuth();
  const s = useResources(['feePayment', 'feeDetails', 'enrollment', 'student', 'batch', 'course', 'teacher']);
  const confirm = useConfirm();
  const [run, busy] = useAction();
  const [tab, setTab] = useState('dues');
  const [q, setQ] = useState('');
  const [note, setNote] = useState({});
  const g = gate(s);
  if (g) return g;
  const { d } = s;
  const needle = q.trim().toLowerCase();
  const ctx = (sid, bid) => { const b = byKey(d.batch, 'Batch_id', bid); return { st: byKey(d.student, 'Student_id', sid), b, c: byKey(d.course, 'Course_id', b?.Course_id) }; };

  const dues = d.enrollment.map((e) => {
    const { st, b, c } = ctx(e.Student_id, e.Batch_id);
    return { e, st, b, c, fee: feeSummary(c, e, paymentsOf(d.feePayment, e.Student_id, e.Batch_id)) };
  }).filter((r) => !needle || `${r.st ? fullName(r.st) : ''} ${r.c?.Course_Name || ''}`.toLowerCase().includes(needle));
  const receipts = [...d.feePayment].sort((a, b) => b.Receipt_id - a.Receipt_id)
    .filter((p) => { const { st, c } = ctx(p.Student_id, p.Batch_id); return !needle || `${p.Receipt_id} ${st ? fullName(st) : ''} ${c?.Course_Name || ''}`.toLowerCase().includes(needle); });

  const addNote = async (p) => {
    const r = await run(() => addPaymentNote('fee', p.Receipt_id, note[p.Receipt_id] || ''), 'Note added');
    if (r.ok) { setNote({ ...note, [p.Receipt_id]: '' }); s.reload(); }
  };
  const rmNote = async (n) => { const r = await run(() => removePaymentNote('fee', n.Receipt_id, n.Description), 'Note removed'); if (r.ok) s.reload(); };
  const delReceipt = async (p) => {
    if (!(await confirm({ title: `Delete receipt #${p.Receipt_id}?`, danger: true, confirmLabel: 'Delete receipt', message: `${money(p.Amount)} paid on ${formatDate(p.Payment_date)}. The student's dues will go up by this amount.` }))) return;
    const r = await run(() => api.remove('feePayment', [p.Receipt_id]), 'Receipt deleted');
    if (r.ok) s.reload();
  };

  return (
    <>
      <PageHeader title="Fees" subtitle="Payable = course price less the enrollment's discount. Dues are worked out from the payments recorded." />
      <Card title="Record a payment">
        <FeeForm students={d.student} enrollments={d.enrollment} batches={d.batch} courses={d.course} teachers={d.teacher} payments={d.feePayment} onDone={s.reload} />
      </Card>
      <div className="mt">
        <div className="row-between mb">
          <Tabs value={tab} onChange={setTab} label="Fee views" tabs={[{ key: 'dues', label: 'Dues by enrollment' }, { key: 'receipts', label: 'Receipts' }]} />
          <SearchInput value={q} onChange={setQ} placeholder="Search student, course or receipt…" />
        </div>
        {tab === 'dues' ? (
          <Card flush>
            <DataTable rows={dues} rowKey={(r) => `${r.e.Student_id}-${r.e.Batch_id}`} empty={<EmptyState icon="card" title="No enrollments" />}
              columns={[
                { key: 's', header: 'Student', sortValue: (r) => r.st?.First_name, render: (r) => <Link to={`/${user.role}/batches/${r.e.Batch_id}/students/${r.e.Student_id}`}>{fullName(r.st || {})}</Link> },
                { key: 'c', header: 'Course', render: (r) => r.c?.Course_Name },
                { key: 'pay', header: 'Payable', align: 'num', sortValue: (r) => r.fee.payable, render: (r) => money(r.fee.payable) },
                { key: 'paid', header: 'Paid', align: 'num', sortValue: (r) => r.fee.paid, render: (r) => money(r.fee.paid) },
                { key: 'rem', header: 'Remaining', align: 'num', sortValue: (r) => r.fee.remaining, render: (r) => money(r.fee.remaining) },
                { key: 'st', header: 'Status', render: (r) => <Badge tone={FEE_STATUS[r.fee.status].tone}>{FEE_STATUS[r.fee.status].label}</Badge> },
              ]} />
          </Card>
        ) : (
          <Card flush>
            <DataTable rows={receipts} rowKey={(p) => p.Receipt_id} empty={<EmptyState icon="card" title="No payments yet" />}
              columns={[
                { key: 'r', header: 'Receipt no.', sortValue: (p) => p.Receipt_id, render: (p) => <span className="mono">#{p.Receipt_id}</span> },
                { key: 's', header: 'Student', render: (p) => fullName(ctx(p.Student_id, p.Batch_id).st || {}) },
                { key: 'c', header: 'Course', render: (p) => ctx(p.Student_id, p.Batch_id).c?.Course_Name },
                { key: 'a', header: 'Amount', align: 'num', sortValue: (p) => Number(p.Amount), render: (p) => money(p.Amount) },
                { key: 'd', header: 'Date', sortValue: (p) => `${p.Payment_date}${p.Payment_time}`, render: (p) => formatDate(p.Payment_date) },
                { key: 'm', header: 'Mode', render: (p) => p.Mode_of_payment },
                { key: 'n', header: 'Notes', render: (p) => (
                  <div className="stack-sm">
                    {d.feeDetails.filter((n) => n.Receipt_id === p.Receipt_id).map((n) => (
                      <span key={n.Description} className="chip-note">{n.Description}<button type="button" aria-label="Remove note" onClick={() => rmNote(n)}>×</button></span>
                    ))}
                    <span className="row"><input aria-label="Add note" placeholder="Add note" value={note[p.Receipt_id] || ''} onChange={(e) => setNote({ ...note, [p.Receipt_id]: e.target.value })} /><Button size="sm" variant="subtle" disabled={busy || !(note[p.Receipt_id] || '').trim()} onClick={() => addNote(p)}>Add</Button></span>
                  </div>) },
                { key: 'x', header: '', actions: true, render: (p) => <Button size="sm" variant="danger-outline" icon="trash" aria-label="Delete receipt" onClick={() => delReceipt(p)} /> },
              ]} />
          </Card>
        )}
      </div>
    </>
  );
}
