import { useEffect, useMemo, useState } from 'react';
import { useResources } from '@/hooks/useResources';
import { useAction } from '@/hooks/useAction';
import { saveStudentAttendance } from '@/api/services';
import { STUDENT_ATTENDANCE_STATES } from '@/utils/constants';
import { formatDate, today } from '@/utils/format';
import { gate } from '@/components/ui/Async';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Field from '@/components/ui/Field';
import Badge from '@/components/ui/Badge';
import DataTable from '@/components/ui/DataTable';
import Segmented from '@/components/ui/Segmented';
import EmptyState from '@/components/ui/EmptyState';
import PersonCell from '@/components/people/PersonCell';

/**
 * Mark attendance for the students of ONE batch on a chosen date.
 * Re-opening a date shows what was saved; saving again overwrites it (insert-or-update).
 * students = [{ e: enrollment, s: student }]
 */
export default function AttendanceSheet({ batchId, students }) {
  const s = useResources(['studentAttendance']);
  const [run, busy] = useAction();
  const [date, setDate] = useState(today());
  const [marks, setMarks] = useState({});

  const rows = useMemo(() => (s.loading || s.error ? [] : s.d.studentAttendance.filter((a) => a.batch_id === batchId)), [s, batchId]);
  const forDate = useMemo(() => rows.filter((a) => a.date === date), [rows, date]);

  useEffect(() => {
    const next = {};
    students.forEach(({ e }) => {
      const saved = forDate.find((a) => a.student_id === e.student_id);
      next[e.student_id] = saved ? Number(saved.status) : 1;
    });
    setMarks(next);
  }, [forDate, students]);

  const g = gate(s);
  if (g) return g;

  const save = async () => {
    const r = await run(() => saveStudentAttendance(batchId, date, marks), `Attendance saved for ${formatDate(date)}`);
    if (r.ok) s.reload();
  };
  const setAll = (v) => setMarks(Object.fromEntries(students.map(({ e }) => [e.student_id, v])));

  const history = [...new Set(rows.map((a) => a.date))].sort().reverse().map((d) => {
    const day = rows.filter((a) => a.date === d);
    return { date: d, present: day.filter((a) => Number(a.status) === 1).length, total: day.length };
  });

  return (
    <div className="stack">
      <Card
        title="Mark attendance"
        subtitle={forDate.length ? `Already saved for ${formatDate(date)}. Saving again will update it.` : `Nothing saved yet for ${formatDate(date)}.`}
        actions={<Badge tone={forDate.length ? 'success' : 'warning'}>{forDate.length ? 'Saved' : 'Not saved yet'}</Badge>}
      >
        <div className="row-end mb">
          <Field label="Date"><input type="date" max={today()} value={date} onChange={(e) => e.target.value && setDate(e.target.value)} /></Field>
          <Button variant="subtle" size="sm" onClick={() => setAll(1)}>Mark all present</Button>
          <Button variant="subtle" size="sm" onClick={() => setAll(0)}>Mark all absent</Button>
        </div>
        {students.length === 0 ? (
          <EmptyState icon="users" title="No students in this batch" text="Enroll students first, then you can mark their attendance." />
        ) : (
          <>
            <DataTable
              pageSize={0}
              rows={students}
              rowKey={({ e }) => e.student_id}
              columns={[
                { key: 'name', header: 'Student', sortValue: ({ s: st }) => st.first_name, render: ({ s: st }) => <PersonCell person={st} size={30} /> },
                { key: 'status', header: 'Status', render: ({ e }) => <Segmented label={`Attendance for ${e.student_id}`} options={STUDENT_ATTENDANCE_STATES} value={marks[e.student_id] ?? 1} onChange={(v) => setMarks({ ...marks, [e.student_id]: v })} /> },
              ]}
            />
            <div className="form-actions"><Button icon="check" onClick={save} loading={busy}>Save attendance</Button></div>
          </>
        )}
      </Card>

      <Card title="Earlier dates" subtitle="Select a date to review or correct it." flush>
        <DataTable
          pageSize={8}
          rows={history}
          rowKey={(h) => h.date}
          empty={<EmptyState icon="calendar" title="No attendance recorded yet" />}
          columns={[
            { key: 'date', header: 'Date', sortValue: (h) => h.date, render: (h) => formatDate(h.date) },
            { key: 'p', header: 'Present', align: 'num', render: (h) => `${h.present} of ${h.total}` },
            { key: 'a', header: '', actions: true, render: (h) => <Button size="sm" variant="secondary" onClick={() => { setDate(h.date); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Open</Button> },
          ]}
          initialSort={{ key: 'date', dir: 'desc' }}
        />
      </Card>
    </div>
  );
}
