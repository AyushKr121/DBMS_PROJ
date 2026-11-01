import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useResources } from '@/hooks/useResources';
import { useAction } from '@/hooks/useAction';
import { useConfirm } from '@/context/ConfirmContext';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { api } from '@/api';
import { enrollStudent, updateEnrollment } from '@/api/services';
import { byKey, formatDate, fullName } from '@/utils/format';
import { batchOptions, personOptions } from '@/utils/batch';
import { gate } from '@/components/ui/Async';
import PageHeader from '@/components/ui/PageHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Field from '@/components/ui/Field';
import Combobox from '@/components/ui/Combobox';
import DataTable from '@/components/ui/DataTable';
import SearchInput from '@/components/ui/SearchInput';
import EmptyState from '@/components/ui/EmptyState';

/** Enroll a student into a batch (pick both by name) and review / edit / remove enrollments. */
export default function Enrollments() {
  useDocumentTitle('Enrollments');
  const { user } = useAuth();
  const s = useResources(['enrollment', 'student', 'batch', 'course', 'teacher']);
  const confirm = useConfirm();
  const [run, busy] = useAction();
  const [f, setF] = useState({ Student_id: '', Batch_id: '', discount: '0' });
  const [q, setQ] = useState('');
  const [edit, setEdit] = useState(null);
  const g = gate(s);
  if (g) return g;
  const { d } = s;
  const bOpts = batchOptions(d.batch, d.course, d.teacher);
  const label = (e) => { const st = byKey(d.student, 'Student_id', e.Student_id); const b = byKey(d.batch, 'Batch_id', e.Batch_id); return `${st ? fullName(st) : 'Student'} · ${byKey(d.course, 'Course_id', b?.Course_id)?.Course_Name || 'Batch'}`; };
  const needle = q.trim().toLowerCase();
  const rows = d.enrollment.filter((e) => !needle || label(e).toLowerCase().includes(needle));

  const enroll = async (e) => {
    e.preventDefault();
    const r = await run(() => enrollStudent(f), 'Student enrolled');
    if (r.ok) { setF({ ...f, Student_id: '' }); s.reload(); }
  };
  const saveEdit = async () => {
    const r = await run(() => updateEnrollment(edit.Student_id, edit.Batch_id, { Discount: edit.discount }), 'Discount updated');
    if (r.ok) { setEdit(null); s.reload(); }
  };
  const remove = async (e) => {
    if (!(await confirm({ title: 'Remove this enrollment?', danger: true, confirmLabel: 'Remove', message: label(e), items: ['Scores, attendance and fee payments of this student in this batch are removed with it.'] }))) return;
    const r = await run(() => api.remove('enrollment', [e.Student_id, e.Batch_id]), 'Enrollment removed');
    if (r.ok) s.reload();
  };

  return (
    <>
      <PageHeader title="Enrollments" subtitle="Each enrollment is separate: a student in two batches has two enrollments with their own fees, attendance and certificate." />
      <Card title="Enroll a student">
        <form className="form-grid" onSubmit={enroll}>
          <Field label="Student" required><Combobox required options={personOptions(d.student, 'Student_id')} value={f.Student_id} onChange={(v) => setF({ ...f, Student_id: v })} clearable={false} /></Field>
          <Field label="Batch" required><Combobox required options={bOpts} value={f.Batch_id} onChange={(v) => setF({ ...f, Batch_id: v })} clearable={false} /></Field>
          <Field label="Discount (%)"><input type="number" min="0" max="100" step="0.5" value={f.Discount} onChange={(e) => setF({ ...f, discount: e.target.value })} /></Field>
          <div className="form-actions align-end"><Button type="submit" icon="plus" loading={busy}>Enroll</Button></div>
        </form>
      </Card>
      <Card flush title={`All enrollments (${d.enrollment.length})`} className="mt" actions={<SearchInput value={q} onChange={setQ} placeholder="Search student or course…" />}>
        <DataTable rows={rows} rowKey={(e) => `${e.Student_id}-${e.Batch_id}`} empty={<EmptyState icon="clipboard" title="No enrollments" />}
          columns={[
            { key: 's', header: 'Student', sortValue: (e) => byKey(d.student, 'Student_id', e.Student_id)?.First_name, render: (e) => <Link to={`/${user.role}/batches/${e.Batch_id}/students/${e.Student_id}`}>{fullName(byKey(d.student, 'Student_id', e.Student_id) || {})}</Link> },
            { key: 'b', header: 'Batch', render: (e) => { const b = byKey(d.batch, 'Batch_id', e.Batch_id); return <Link to={`/${user.role}/batches/${e.Batch_id}`}>{byKey(d.course, 'Course_id', b?.Course_id)?.Course_Name}</Link>; } },
            { key: 'on', header: 'Enrolled', sortValue: (e) => e.Enrollment_date, render: (e) => formatDate(e.Enrollment_date) },
            { key: 'disc', header: 'Discount', align: 'num', render: (e) => (edit && edit.Student_id === e.Student_id && edit.Batch_id === e.Batch_id
              ? <span className="row"><input className="score-input" type="number" min="0" max="100" value={edit.discount} onChange={(ev) => setEdit({ ...edit, discount: ev.target.value })} /><Button size="sm" onClick={saveEdit} loading={busy}>Save</Button></span>
              : <button type="button" className="inline-link" onClick={() => setEdit({ Student_id: e.Student_id, Batch_id: e.Batch_id, discount: e.Discount ?? 0 })}>{Number(e.Discount || 0)}%</button>) },
            { key: 'c', header: 'Certificate', render: (e) => e.Certificate || '—' },
            { key: 'a', header: '', actions: true, render: (e) => <Button size="sm" variant="danger-outline" icon="trash" aria-label="Remove enrollment" onClick={() => remove(e)} /> },
          ]} />
      </Card>
    </>
  );
}
