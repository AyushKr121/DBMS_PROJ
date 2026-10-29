import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useResources } from '@/hooks/useResources';
import { useAction } from '@/hooks/useAction';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { saveStaffAttendance } from '@/api/services';
import { ROLE_CFG, STAFF_ATTENDANCE_STATES } from '@/utils/constants';
import { byKey, formatDate, today } from '@/utils/format';
import { batchOptions } from '@/utils/batch';
import { gate } from '@/components/ui/Async';
import PageHeader from '@/components/ui/PageHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Field from '@/components/ui/Field';
import Badge from '@/components/ui/Badge';
import Combobox from '@/components/ui/Combobox';
import DataTable from '@/components/ui/DataTable';
import Segmented from '@/components/ui/Segmented';
import PersonCell from '@/components/people/PersonCell';
import AttendanceSheet from '@/components/batch/AttendanceSheet';
import EmptyState from '@/components/ui/EmptyState';

/** kind = 'students' (pick a batch) | 'teachers' | 'assistants' (everyone, one date). */
export default function StaffAttendance({ kind }) {
  useDocumentTitle('Attendance');
  return kind === 'students' ? <StudentsByBatch /> : <StaffByDate role={kind === 'teachers' ? 'teacher' : 'assistant'} />;
}

function StudentsByBatch() {
  const { user } = useAuth();
  const s = useResources(['batch', 'course', 'teacher', 'enrollment', 'student']);
  const [bid, setBid] = useState('');
  const g = gate(s);
  if (g) return g;
  const { d } = s;
  const students = bid ? d.enrollment.filter((e) => e.batch_id === Number(bid)).map((e) => ({ e, s: byKey(d.student, 'student_id', e.student_id) })).filter((x) => x.s) : [];
  return (
    <>
      <PageHeader title="Student attendance" subtitle="Pick a batch, then mark any student present or absent for a date." />
      <Card>
        <Field label="Batch"><Combobox options={batchOptions(d.batch, d.course, d.teacher)} value={bid} onChange={setBid} placeholder="Choose a batch" /></Field>
        {bid && <p className="muted small mt"><Link to={`/${user.role}/batches/${bid}/attendance`}>Open this batch's attendance page</Link></p>}
      </Card>
      <div className="mt">{bid ? <AttendanceSheet key={bid} batchId={Number(bid)} students={students} /> : <EmptyState icon="calendar" title="Choose a batch to begin" />}</div>
    </>
  );
}

function StaffByDate({ role }) {
  const cfg = ROLE_CFG[role];
  const s = useResources([cfg.resource, cfg.attendance]);
  const [run, busy] = useAction();
  const [date, setDate] = useState(today());
  const [marks, setMarks] = useState({});
  const people = s.d[cfg.resource] || [];
  const all = s.d[cfg.attendance] || [];
  const forDate = useMemo(() => all.filter((a) => a.date === date), [all, date]);
  useEffect(() => {
    const m = {};
    people.forEach((p) => { const saved = forDate.find((a) => a[cfg.idField] === p[cfg.idField]); m[p[cfg.idField]] = saved ? Number(saved.status) : 1; });
    setMarks(m);
  }, [forDate, people, cfg.idField]);
  const g = gate(s);
  if (g) return g;

  const save = async () => { const r = await run(() => saveStaffAttendance(role, date, marks), `Attendance saved for ${formatDate(date)}`); if (r.ok) s.reload(); };
  const history = [...new Set(all.map((a) => a.date))].sort().reverse().slice(0, 14).map((dt) => {
    const day = all.filter((a) => a.date === dt);
    return { date: dt, present: day.filter((a) => Number(a.status) === 1).length, half: day.filter((a) => Number(a.status) === 0.5).length, absent: day.filter((a) => Number(a.status) === 0).length };
  });
  const setAll = (v) => setMarks(Object.fromEntries(people.map((p) => [p[cfg.idField], v])));

  return (
    <>
      <PageHeader title={`${cfg.label} attendance`} subtitle="Mark everyone for a date. Saving a date again updates it." />
      <Card title="Mark attendance" actions={<Badge tone={forDate.length ? 'success' : 'warning'}>{forDate.length ? 'Saved' : 'Not saved yet'}</Badge>}>
        <div className="row-end mb">
          <Field label="Date"><input type="date" max={today()} value={date} onChange={(e) => e.target.value && setDate(e.target.value)} /></Field>
          <Button variant="subtle" size="sm" onClick={() => setAll(1)}>All present</Button>
          <Button variant="subtle" size="sm" onClick={() => setAll(0)}>All absent</Button>
        </div>
        <DataTable pageSize={0} rows={people} rowKey={(p) => p[cfg.idField]} empty={<EmptyState icon="users" title={`No ${cfg.plural.toLowerCase()} yet`} />}
          columns={[
            { key: 'n', header: cfg.label, sortValue: (p) => p.first_name, render: (p) => <PersonCell person={p} size={30} /> },
            { key: 's', header: 'Status', render: (p) => <Segmented label="Attendance" options={STAFF_ATTENDANCE_STATES} value={marks[p[cfg.idField]] ?? 1} onChange={(v) => setMarks({ ...marks, [p[cfg.idField]]: v })} /> },
          ]} />
        {people.length > 0 && <div className="form-actions"><Button icon="check" onClick={save} loading={busy}>Save attendance</Button></div>}
      </Card>
      <Card flush title="Recent days" className="mt">
        <DataTable rows={history} rowKey={(h) => h.date} empty={<p className="muted pad">Nothing recorded yet.</p>}
          columns={[
            { key: 'd', header: 'Date', render: (h) => <button type="button" className="inline-link" onClick={() => setDate(h.date)}>{formatDate(h.date)}</button> },
            { key: 'p', header: 'Present', align: 'num', render: (h) => h.present },
            { key: 'h', header: 'Half day', align: 'num', render: (h) => h.half },
            { key: 'a', header: 'Absent', align: 'num', render: (h) => h.absent },
          ]} />
      </Card>
    </>
  );
}
