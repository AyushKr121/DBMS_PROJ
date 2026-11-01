import { useState } from 'react';
import { useResources } from '@/hooks/useResources';
import { formatDateTime, money, plural } from '@/utils/format';
import { feeSummary, paymentsOf, FEE_STATUS } from '@/utils/fees';
import { gate } from '@/components/ui/Async';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import DataTable from '@/components/ui/DataTable';
import EmptyState from '@/components/ui/EmptyState';
import StatCard from '@/components/ui/StatCard';
import PersonCell from '@/components/people/PersonCell';
import FeeForm from '@/components/finance/FeeForm';
import { useBatch } from './BatchLayout';

export default function BatchFees() {
  const { perms } = useBatch();
  return perms.staff ? <StaffFees /> : <MyFees />;
}

/** A student's own fee status for this batch. */
function MyFees() {
  const { bid, course, me, user } = useBatch();
  const s = useResources(['feePayment', 'feeDetails']);
  const g = gate(s);
  if (g) return g;
  const pays = paymentsOf(s.d.feePayment, user.id, bid).sort((a, b) => b.Receipt_id - a.Receipt_id);
  const fee = feeSummary(course, me, pays);

  return (
    <div className="stack">
      <div className="grid-4">
        <StatCard icon="book" label="Course fee" value={money(fee.price)} />
        <StatCard icon="award" tone="success" label="Your discount" value={`${fee.discount}%`} />
        <StatCard icon="card" label="Total payable" value={money(fee.payable)} />
        <StatCard icon="check" tone={fee.remaining > 0 ? 'warning' : 'success'} label="Remaining" value={money(fee.remaining)} hint={FEE_STATUS[fee.status].label} />
      </div>
      <Card title="Payments" subtitle="Fees are paid at the institute. Quote the reference number if you ever need a receipt." flush>
        <DataTable
          rows={pays}
          rowKey={(p) => p.Receipt_id}
          empty={<EmptyState icon="card" title="No payments recorded yet" text="Payments made at the front desk will show up here." />}
          columns={[
            { key: 'Receipt_id', header: 'Reference no.', render: (p) => <strong>#{p.Receipt_id}</strong> },
            { key: 'when', header: 'Paid on', render: (p) => formatDateTime(p.Payment_date, p.Payment_time) },
            { key: 'amount', header: 'Amount', align: 'num', render: (p) => money(p.Amount) },
            { key: 'mode', header: 'Mode', render: (p) => p.Mode_of_payment },
            { key: 'notes', header: 'Notes', render: (p) => s.d.feeDetails.filter((x) => x.Receipt_id === p.Receipt_id).map((x) => x.Description).join('; ') || '—' },
          ]}
        />
      </Card>
    </div>
  );
}

/** Staff: the fee position of every student in this batch, with one-click payment entry. */
function StaffFees() {
  const { bid, course, students, enrollments, courses, teachers, allBatches } = useBatch();
  const s = useResources(['feePayment', 'enrollment']);
  const [payFor, setPayFor] = useState(null);
  const g = gate(s);
  if (g) return g;

  const rows = students.map(({ e, s: st }) => ({ e, st, fee: feeSummary(course, e, paymentsOf(s.d.feePayment, e.Student_id, bid)) }));
  const collected = rows.reduce((t, r) => t + r.fee.paid, 0);
  const due = rows.reduce((t, r) => t + r.fee.remaining, 0);

  return (
    <div className="stack">
      <div className="grid-4">
        <StatCard icon="users" label="Students" value={enrollments.length} />
        <StatCard icon="card" tone="success" label="Collected" value={money(collected)} />
        <StatCard icon="alert" tone={due > 0 ? 'warning' : 'success'} label="Still due" value={money(due)} hint={plural(rows.filter((r) => r.fee.remaining > 0).length, 'student')} />
      </div>
      <Card title="Fee position by student" flush>
        <DataTable
          rows={rows}
          rowKey={(r) => r.e.Student_id}
          empty={<EmptyState icon="users" title="No students enrolled" />}
          columns={[
            { key: 'name', header: 'Student', sortValue: (r) => r.st.First_name, render: (r) => <PersonCell person={r.st} size={30} /> },
            { key: 'payable', header: 'Payable', align: 'num', sortValue: (r) => r.fee.payable, render: (r) => money(r.fee.payable) },
            { key: 'paid', header: 'Paid', align: 'num', sortValue: (r) => r.fee.paid, render: (r) => money(r.fee.paid) },
            { key: 'remaining', header: 'Remaining', align: 'num', sortValue: (r) => r.fee.remaining, render: (r) => money(r.fee.remaining) },
            { key: 'status', header: 'Status', render: (r) => <Badge tone={FEE_STATUS[r.fee.status].tone}>{FEE_STATUS[r.fee.status].label}</Badge> },
            { key: 'act', header: '', actions: true, render: (r) => <Button size="sm" icon="plus" onClick={() => setPayFor(r)}>Payment</Button> },
          ]}
        />
      </Card>
      <Modal open={!!payFor} onClose={() => setPayFor(null)} title={payFor ? `Record payment · ${payFor.st.First_name}` : ''}>
        {payFor && (
          <FeeForm
            students={[payFor.st]} enrollments={s.d.enrollment} batches={allBatches} courses={courses} teachers={teachers} payments={s.d.feePayment}
            presetStudent={payFor.e.Student_id} presetBatch={bid}
            onDone={() => { setPayFor(null); s.reload(); }}
          />
        )}
      </Modal>
    </div>
  );
}
