import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useResources } from '@/hooks/useResources';
import { useAction } from '@/hooks/useAction';
import { enrollStudent } from '@/api/services';
import { formatDate, money } from '@/utils/format';
import { summarizeAttendance, attendanceTone } from '@/utils/attendance';
import { feeSummary, paymentsOf, FEE_STATUS } from '@/utils/fees';
import { personOptions } from '@/utils/batch';
import { gate } from '@/components/ui/Async';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Combobox from '@/components/ui/Combobox';
import Field from '@/components/ui/Field';
import DataTable from '@/components/ui/DataTable';
import EmptyState from '@/components/ui/EmptyState';
import SearchInput from '@/components/ui/SearchInput';
import PersonCell from '@/components/people/PersonCell';
import { useBatch } from './BatchLayout';

/** Students enrolled in this batch. Teachers can look; assistants and admins can also enroll people. */
export default function BatchStudents() {
  const { role, perms, bid, batch, course, students, enrollments, reload } = useBatch();
  const s = useResources(['studentAttendance', 'takes', 'feePayment', ...(perms.enroll ? ['student'] : [])]);
  const [run, busy] = useAction();
  const [pick, setPick] = useState('');
  const [discount, setDiscount] = useState('0');
  const [q, setQ] = useState('');

  const rows = useMemo(() => {
    if (s.loading || s.error) return [];
    const needle = q.trim().toLowerCase();
    return students
      .filter(({ s: st }) => !needle || `${st.first_name} ${st.last_name || ''} ${st.email}`.toLowerCase().includes(needle))
      .map(({ e, s: st }) => {
        const att = summarizeAttendance(s.d.studentAttendance.filter((a) => a.batch_id === bid && a.student_id === e.student_id));
        const scores = s.d.takes.filter((t) => t.batch_id === bid && t.student_id === e.student_id).map((t) => Number(t.score));
        const avg = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : null;
        const fee = feeSummary(course, e, paymentsOf(s.d.feePayment, e.student_id, bid));
        return { e, st, att, avg, fee };
      });
  }, [s, students, q, bid, course]);

  const g = gate(s);
  if (g) return g;

  const enrolledIds = new Set(enrollments.map((e) => e.student_id));
  const candidates = perms.enroll ? s.d.student.filter((x) => !enrolledIds.has(x.student_id)) : [];

  const enroll = async (e) => {
    e.preventDefault();
    const r = await run(() => enrollStudent({ student_id: pick, batch_id: bid, discount }), 'Student enrolled');
    if (r.ok) { setPick(''); setDiscount('0'); reload(); s.reload(); }
  };

  return (
    <div className="stack">
      {perms.enroll && (
        <Card title="Enroll a student in this batch" subtitle="Students must already be registered. Pick from the list or type a name.">
          <form className="row-end" onSubmit={enroll}>
            <Field label="Student" required className="grow">
              <Combobox required options={personOptions(candidates, 'student_id')} value={pick} onChange={setPick} placeholder="Type a name or pick" emptyText="Everyone registered is already in this batch" />
            </Field>
            <Field label="Discount (%)"><input type="number" min="0" max="100" step="0.01" value={discount} onChange={(e) => setDiscount(e.target.value)} /></Field>
            <Button type="submit" icon="plus" loading={busy}>Enroll</Button>
          </form>
        </Card>
      )}

      <Card title={`Enrolled students (${students.length})`} flush actions={<SearchInput value={q} onChange={setQ} placeholder="Search students…" />}>
        <DataTable
          rows={rows}
          rowKey={(r) => r.e.student_id}
          empty={<EmptyState icon="users" title={q ? 'No student matches' : 'Nobody is enrolled yet'} text={perms.enroll ? 'Use the form above to enroll a student.' : 'Students enrolled by the office will appear here.'} />}
          columns={[
            { key: 'name', header: 'Student', sortValue: (r) => r.st.first_name, render: (r) => <Link to={`${r.e.student_id}`} className="person-link"><PersonCell person={r.st} size={30} /></Link> },
            { key: 'on', header: 'Enrolled', sortValue: (r) => r.e.enrollment_date, render: (r) => formatDate(r.e.enrollment_date) },
            { key: 'att', header: 'Attendance', align: 'num', sortValue: (r) => r.att.percent, render: (r) => (r.att.total ? <Badge tone={attendanceTone(r.att.percent)}>{r.att.percent}%</Badge> : '—') },
            { key: 'avg', header: 'Avg. score', align: 'num', sortValue: (r) => r.avg ?? -1, render: (r) => (r.avg != null ? r.avg.toFixed(1) : '—') },
            ...(perms.staff ? [{ key: 'fee', header: 'Fees', sortValue: (r) => r.fee.remaining, render: (r) => (r.fee.remaining > 0 ? <span className="text-warn">{money(r.fee.remaining)} due</span> : <Badge tone={FEE_STATUS[r.fee.status].tone}>{FEE_STATUS[r.fee.status].label}</Badge>) }] : []),
            { key: 'cert', header: 'Certificate', render: (r) => (r.e.certificate ? <Badge tone="success">Issued</Badge> : <span className="muted">—</span>) },
            { key: 'open', header: '', actions: true, render: (r) => <Button to={`${r.e.student_id}`} size="sm" variant="secondary">Open</Button> },
          ]}
        />
      </Card>
      {role === 'teacher' && <p className="muted small">Only the office can enroll or remove students.</p>}
      {batch.teacher_id == null && perms.staff && <p className="muted small">This batch has no teacher yet. Assign one under Settings.</p>}
    </div>
  );
}
