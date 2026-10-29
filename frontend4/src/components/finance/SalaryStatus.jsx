import { useMemo, useState } from 'react';
import { useResources } from '@/hooks/useResources';
import { ROLE_CFG, MONTHS } from '@/utils/constants';
import { formatDate, money } from '@/utils/format';
import { gate } from '@/components/ui/Async';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Field from '@/components/ui/Field';
import DataTable from '@/components/ui/DataTable';
import StatCard from '@/components/ui/StatCard';

/**
 * Month-by-month salary view for one teacher or assistant: paid or not, how much, and the reference
 * number (the receipt id, the only database key the interface shows).
 */
export default function SalaryStatus({ role, id }) {
  const cfg = ROLE_CFG[role];
  const s = useResources([cfg.salary, cfg.salaryDetails]);
  const thisYear = new Date().getFullYear();
  const [year, setYear] = useState(thisYear);

  const mine = useMemo(() => (s.loading || s.error ? [] : s.d[cfg.salary].filter((r) => r[cfg.idField] === id)), [s, cfg, id]);

  const g = gate(s);
  if (g) return g;
  const years = [...new Set([thisYear, ...mine.map((r) => r.year)])].sort((a, b) => b - a);
  const inYear = mine.filter((r) => r.year === Number(year));
  const total = inYear.reduce((t, r) => t + Number(r.amount), 0);

  const rows = MONTHS.map((name, i) => {
    const recs = inYear.filter((r) => r.month === i + 1);
    return {
      name, month: i + 1, recs,
      amount: recs.reduce((t, r) => t + Number(r.amount), 0),
      notes: recs.flatMap((r) => s.d[cfg.salaryDetails].filter((x) => x.receipt_id === r.receipt_id).map((x) => x.description)),
    };
  });

  return (
    <div className="stack">
      <div className="row-end">
        <Field label="Year">
          <select value={year} onChange={(e) => setYear(Number(e.target.value))}>{years.map((y) => <option key={y}>{y}</option>)}</select>
        </Field>
        <StatCard icon="dollar" tone="success" label={`Received in ${year}`} value={money(total)} hint={`${rows.filter((r) => r.recs.length).length} of 12 months paid`} />
      </div>
      <Card flush>
        <DataTable
          pageSize={12}
          stack
          rows={rows}
          rowKey={(r) => r.month}
          columns={[
            { key: 'name', header: 'Month' },
            { key: 'status', header: 'Status', render: (r) => (r.recs.length ? <Badge tone="success">Paid</Badge> : <Badge tone="warning">Not paid</Badge>) },
            { key: 'amount', header: 'Amount', align: 'num', render: (r) => (r.recs.length ? money(r.amount) : '—') },
            { key: 'date', header: 'Paid on', render: (r) => (r.recs.length ? r.recs.map((x) => formatDate(x.salary_payment_date)).join(', ') : '—') },
            { key: 'ref', header: 'Reference no.', render: (r) => (r.recs.length ? r.recs.map((x) => `#${x.receipt_id}`).join(', ') : '—') },
            { key: 'notes', header: 'Note', render: (r) => (r.notes.length ? r.notes.join('; ') : '—') },
          ]}
        />
      </Card>
    </div>
  );
}
