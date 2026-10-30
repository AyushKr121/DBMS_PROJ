import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useResources } from '@/hooks/useResources';
import { useAction } from '@/hooks/useAction';
import { useConfirm } from '@/context/ConfirmContext';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { api } from '@/api';
import { deleteCourseImpact, saveCourse } from '@/api/services';
import { money } from '@/utils/format';
import { gate } from '@/components/ui/Async';
import PageHeader from '@/components/ui/PageHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Field from '@/components/ui/Field';
import DataTable from '@/components/ui/DataTable';
import SearchInput from '@/components/ui/SearchInput';
import EmptyState from '@/components/ui/EmptyState';

export function CourseForm({ course, categories = [], onDone, onCancel }) {
  const [run, busy] = useAction();
  const [f, setF] = useState({
    Course_Name: course?.Course_Name || '', Category: course?.Category || '', Description: course?.Description || '', Price: course?.Price ?? '',
    No_of_modules: course?.No_of_modules ?? '', No_of_weeks: course?.No_of_weeks ?? '', Material: course?.Material || '',
  });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = async (e) => {
    e.preventDefault();
    const r = await run(() => saveCourse(f, course), course ? 'Course updated' : 'Course created');
    if (r.ok) onDone(r.value);
  };
  return (
    <form className="stack" onSubmit={submit}>
      <datalist id="course-cats">{categories.map((c) => <option key={c} value={c} />)}</datalist>
      <div className="form-grid">
        <Field label="Course name" required><input required maxLength={100} value={f.Course_Name} onChange={set('Course_Name')} /></Field>
        <Field label="Category" required hint="Courses are grouped by category in the public catalog.">
          <input required list="course-cats" maxLength={100} value={f.Category} onChange={set('Category')} />
        </Field>
        <Field label="Price (₹)"><input type="number" min="0" step="0.01" value={f.Price} onChange={set('Price')} /></Field>
        <Field label="Duration (weeks)"><input type="number" min="0" value={f.No_of_weeks} onChange={set('No_of_weeks')} /></Field>
        <Field label="Number of modules"><input type="number" min="0" value={f.No_of_modules} onChange={set('No_of_modules')} /></Field>
        <Field label="Study material link"><input type="url" placeholder="https://…" value={f.Material} onChange={set('Material')} /></Field>
      </div>
      <Field label="Description"><textarea rows={4} value={f.Description} onChange={set('Description')} /></Field>
      <div className="form-actions"><Button type="submit" loading={busy}>{course ? 'Save changes' : 'Create course'}</Button>{onCancel && <Button variant="subtle" onClick={onCancel}>Cancel</Button>}</div>
    </form>
  );
}

export default function Courses() {
  useDocumentTitle('Courses');
  const { user } = useAuth();
  const s = useResources(['course', 'batch']);
  const confirm = useConfirm();
  const [run, busy] = useAction();
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const g = gate(s);
  if (g) return g;
  const needle = q.trim().toLowerCase();
  const rows = s.d.course.filter((c) => !needle || `${c.Course_Name} ${c.Category}`.toLowerCase().includes(needle));
  const cats = [...new Set(s.d.course.map((c) => c.Category).filter(Boolean))];

  const del = async (c) => {
    const i = await deleteCourseImpact(c.Course_id);
    if (!(await confirm({ title: `Delete "${c.Course_Name}"?`, danger: true, confirmLabel: 'Delete course', message: 'Its modules are removed. Batches of this course and everything inside them are removed too:', items: [`${i.batches} batch(es)`, `${i.enrollments} enrollment(s)`] }))) return;
    const r = await run(() => api.remove('course', [c.Course_id]), 'Course deleted');
    if (r.ok) s.reload();
  };

  return (
    <>
      <PageHeader title="Courses" subtitle="Create, search and update the course catalog." actions={<Button icon="plus" onClick={() => setOpen(true)}>New course</Button>} />
      <Card flush title={`Courses (${s.d.course.length})`} actions={<SearchInput value={q} onChange={setQ} placeholder="Search name or category…" />}>
        <DataTable rows={rows} rowKey={(c) => c.Course_id} empty={<EmptyState icon="book" title="No courses found" />}
          columns={[
            { key: 'n', header: 'Course', sortValue: (c) => c.Course_Name, render: (c) => <Link to={`/${user.role}/courses/${c.Course_id}`}>{c.Course_Name}</Link> },
            { key: 'cat', header: 'Category', sortValue: (c) => c.Category, render: (c) => c.Category },
            { key: 'p', header: 'Price', align: 'num', sortValue: (c) => Number(c.Price || 0), render: (c) => (c.Price != null ? money(c.Price) : '—') },
            { key: 'm', header: 'Modules', align: 'num', render: (c) => c.No_of_modules ?? '—' },
            { key: 'b', header: 'Batches', align: 'num', render: (c) => s.d.batch.filter((b) => b.Course_id === c.Course_id).length },
            { key: 'a', header: '', actions: true, render: (c) => (<><Button size="sm" variant="secondary" to={`/${user.role}/courses/${c.Course_id}`}>Open</Button><Button size="sm" variant="danger-outline" icon="trash" disabled={busy} aria-label={`Delete ${c.Course_Name}`} onClick={() => del(c)} /></>) },
          ]} />
      </Card>
      <Modal open={open} onClose={() => setOpen(false)} title="New course" size="lg">
        <CourseForm categories={cats} onCancel={() => setOpen(false)} onDone={() => { setOpen(false); s.reload(); }} />
      </Modal>
    </>
  );
}
