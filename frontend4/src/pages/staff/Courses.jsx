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
    course_Name: course?.course_Name || '', category: course?.category || '', description: course?.description || '', price: course?.price ?? '',
    no_of_modules: course?.no_of_modules ?? '', no_of_weeks: course?.no_of_weeks ?? '', material: course?.material || '',
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
        <Field label="Course name" required><input required maxLength={100} value={f.course_Name} onChange={set('course_Name')} /></Field>
        <Field label="Category" required hint="Courses are grouped by category in the public catalog.">
          <input required list="course-cats" maxLength={100} value={f.category} onChange={set('category')} />
        </Field>
        <Field label="Price (₹)"><input type="number" min="0" step="0.01" value={f.price} onChange={set('price')} /></Field>
        <Field label="Duration (weeks)"><input type="number" min="0" value={f.no_of_weeks} onChange={set('no_of_weeks')} /></Field>
        <Field label="Number of modules"><input type="number" min="0" value={f.no_of_modules} onChange={set('no_of_modules')} /></Field>
        <Field label="Study material link"><input type="url" placeholder="https://…" value={f.material} onChange={set('material')} /></Field>
      </div>
      <Field label="Description"><textarea rows={4} value={f.description} onChange={set('description')} /></Field>
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
  const rows = s.d.course.filter((c) => !needle || `${c.course_Name} ${c.category}`.toLowerCase().includes(needle));
  const cats = [...new Set(s.d.course.map((c) => c.category).filter(Boolean))];

  const del = async (c) => {
    const i = await deleteCourseImpact(c.course_id);
    if (!(await confirm({ title: `Delete "${c.course_Name}"?`, danger: true, confirmLabel: 'Delete course', message: 'Its modules are removed. Batches of this course and everything inside them are removed too:', items: [`${i.batches} batch(es)`, `${i.enrollments} enrollment(s)`] }))) return;
    const r = await run(() => api.remove('course', [c.course_id]), 'Course deleted');
    if (r.ok) s.reload();
  };

  return (
    <>
      <PageHeader title="Courses" subtitle="Create, search and update the course catalog." actions={<Button icon="plus" onClick={() => setOpen(true)}>New course</Button>} />
      <Card flush title={`Courses (${s.d.course.length})`} actions={<SearchInput value={q} onChange={setQ} placeholder="Search name or category…" />}>
        <DataTable rows={rows} rowKey={(c) => c.course_id} empty={<EmptyState icon="book" title="No courses found" />}
          columns={[
            { key: 'n', header: 'Course', sortValue: (c) => c.course_Name, render: (c) => <Link to={`/${user.role}/courses/${c.course_id}`}>{c.course_Name}</Link> },
            { key: 'cat', header: 'Category', sortValue: (c) => c.category, render: (c) => c.category },
            { key: 'p', header: 'Price', align: 'num', sortValue: (c) => Number(c.price || 0), render: (c) => (c.price != null ? money(c.price) : '—') },
            { key: 'm', header: 'Modules', align: 'num', render: (c) => c.no_of_modules ?? '—' },
            { key: 'b', header: 'Batches', align: 'num', render: (c) => s.d.batch.filter((b) => b.course_id === c.course_id).length },
            { key: 'a', header: '', actions: true, render: (c) => (<><Button size="sm" variant="secondary" to={`/${user.role}/courses/${c.course_id}`}>Open</Button><Button size="sm" variant="danger-outline" icon="trash" disabled={busy} aria-label={`Delete ${c.course_Name}`} onClick={() => del(c)} /></>) },
          ]} />
      </Card>
      <Modal open={open} onClose={() => setOpen(false)} title="New course" size="lg">
        <CourseForm categories={cats} onCancel={() => setOpen(false)} onDone={() => { setOpen(false); s.reload(); }} />
      </Modal>
    </>
  );
}
