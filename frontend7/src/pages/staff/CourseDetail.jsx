import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useResources } from '@/hooks/useResources';
import { useAction } from '@/hooks/useAction';
import { useConfirm } from '@/context/ConfirmContext';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { api } from '@/api';
import { addCourseModule, deleteCourseImpact } from '@/api/services';
import { byKey, money } from '@/utils/format';
import { gate } from '@/components/ui/Async';
import PageHeader from '@/components/ui/PageHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import Field from '@/components/ui/Field';
import { CourseForm } from './Courses';

export default function CourseDetail() {
  const cid = Number(useParams().courseId);
  const { user } = useAuth();
  const navigate = useNavigate();
  const confirm = useConfirm();
  const [run, busy] = useAction();
  const [m, setM] = useState({ title: '', description: '' });
  const [editing, setEditing] = useState(null);
  const s = useResources(['course', 'courseModule']);
  const course = byKey(s.d.course, 'course_id', cid);
  useDocumentTitle(course?.course_Name || 'Course');
  const g = gate(s);
  if (g) return g;
  if (!course) return <Alert tone="danger">This course no longer exists.</Alert>;
  const mods = s.d.courseModule.filter((x) => x.course_id === cid).sort((a, b) => a.module_id - b.module_id);
  const cats = [...new Set(s.d.course.map((c) => c.category).filter(Boolean))];

  const add = async (e) => {
    e.preventDefault();
    const r = await run(() => addCourseModule(cid, m), 'Module added');
    if (r.ok) { setM({ title: '', description: '' }); s.reload(); }
  };
  const saveMod = async (mod) => {
    const r = await run(() => api.save('courseModule', { ...mod, module_title: editing.title, module_description: editing.description || null }), 'Module updated');
    if (r.ok) { setEditing(null); s.reload(); }
  };
  const rmMod = async (mod) => {
    if (!(await confirm({ title: 'Delete this module?', danger: true, confirmLabel: 'Delete', message: mod.module_title }))) return;
    const r = await run(() => api.remove('courseModule', [mod.module_id, cid]), 'Module deleted');
    if (r.ok) s.reload();
  };
  const del = async () => {
    const i = await deleteCourseImpact(cid);
    if (!(await confirm({ title: 'Delete this course?', danger: true, confirmLabel: 'Delete course', message: 'Everything below is removed with it:', items: [`${mods.length} module(s)`, `${i.batches} batch(es)`, `${i.enrollments} enrollment(s)`] }))) return;
    const r = await run(() => api.remove('course', [cid]), 'Course deleted');
    if (r.ok) navigate(`/${user.role}/courses`);
  };

  return (
    <>
      <PageHeader title={course.course_Name} subtitle={`${course.category}${course.price != null ? ` · ${money(course.price)}` : ''}`} back={{ to: `/${user.role}/courses`, label: 'Courses' }}
        actions={<Button variant="danger-outline" icon="trash" onClick={del} loading={busy}>Delete course</Button>} />
      <div className="grid-2 grid-2--wide-right">
        <Card title="Course details"><CourseForm course={course} categories={cats} onDone={s.reload} /></Card>
        <Card title={`Modules (${mods.length})`} subtitle="Shown to students inside their batch, in this order.">
          <ol className="module-list">
            {mods.map((x, i) => (
              <li key={x.module_id} className="module-list__item">
                {editing?.id === x.module_id ? (
                  <div className="stack">
                    <input aria-label="Module title" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
                    <textarea aria-label="Module description" rows={2} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
                    <div className="form-actions"><Button size="sm" onClick={() => saveMod(x)} loading={busy}>Save</Button><Button size="sm" variant="subtle" onClick={() => setEditing(null)}>Cancel</Button></div>
                  </div>
                ) : (
                  <>
                    <span className="module-list__num">{i + 1}</span>
                    <div className="module-list__body"><strong>{x.module_title}</strong>{x.module_description && <p className="muted small">{x.module_description}</p>}</div>
                    <div className="row">
                      <Button size="sm" variant="subtle" icon="edit" aria-label="Edit module" onClick={() => setEditing({ id: x.module_id, title: x.module_title, description: x.module_description || '' })} />
                      <Button size="sm" variant="danger-outline" icon="trash" aria-label="Delete module" onClick={() => rmMod(x)} />
                    </div>
                  </>
                )}
              </li>
            ))}
            {mods.length === 0 && <li className="muted">No modules yet.</li>}
          </ol>
          <form className="stack mt" onSubmit={add}>
            <Field label="New module title" required><input required maxLength={150} value={m.title} onChange={(e) => setM({ ...m, title: e.target.value })} /></Field>
            <Field label="Description"><textarea rows={2} value={m.description} onChange={(e) => setM({ ...m, description: e.target.value })} /></Field>
            <div className="form-actions"><Button type="submit" icon="plus" loading={busy}>Add module</Button></div>
          </form>
        </Card>
      </div>
    </>
  );
}
