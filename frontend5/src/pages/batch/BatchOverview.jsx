import { useState } from 'react';
import { useResources } from '@/hooks/useResources';
import { useAction } from '@/hooks/useAction';
import { setModulesCompleted } from '@/api/services';
import { formatDate, fullName, hhmm, money, pct, plural } from '@/utils/format';
import { summarizeAttendance } from '@/utils/attendance';
import { isComplete, modulesDone } from '@/utils/batch';
import { gate } from '@/components/ui/Async';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Field from '@/components/ui/Field';
import ProgressBar from '@/components/ui/ProgressBar';
import StatCard from '@/components/ui/StatCard';
import Badge from '@/components/ui/Badge';
import { useBatch } from './BatchLayout';

export default function BatchOverview() {
  const { role, perms, batch, bid, course, teacher, days, enrollments, me, reload, user } = useBatch();
  const s = useResources(['studentAttendance', 'test', 'batchNotification']);
  const [run, busy] = useAction();
  const total = course?.no_of_modules ?? 0;
  const [n, setN] = useState(modulesDone(batch, course));

  const g = gate(s);
  if (g) return g;
  const att = summarizeAttendance(s.d.studentAttendance.filter((a) => a.batch_id === bid && (role !== 'student' || a.student_id === user.id)));
  const tests = s.d.test.filter((t) => t.batch_id === bid).length;
  const notices = s.d.batchNotification.filter((x) => x.batch_id === bid).length;
  const done = modulesDone(batch, course);

  const saveProgress = async (e) => {
    e.preventDefault();
    const r = await run(() => setModulesCompleted(batch, n, total || null), 'Progress updated');
    if (r.ok) reload();
  };

  return (
    <div className="stack">
      <div className="grid-4">
        {perms.teach ? <StatCard icon="users" label="Students enrolled" value={enrollments.length} /> : <StatCard icon="calendar" label="You enrolled on" value={formatDate(me?.enrollment_date)} />}
        <StatCard icon="check" tone="success" label={role === 'student' ? 'Your attendance' : 'Average attendance'} value={att.total ? `${att.percent}%` : '—'} hint={att.total ? `${plural(att.total, 'record')}` : 'Nothing marked yet'} />
        <StatCard icon="clipboard" tone="warning" label="Tests" value={tests} />
        <StatCard icon="bell" tone="danger" label="Batch notices" value={notices} />
      </div>

      <div className="grid-2">
        <Card title="Batch details">
          <dl className="dl">
            <div><dt>Course</dt><dd>{course?.course_Name}</dd></div>
            <div><dt>Category</dt><dd>{course?.category}</dd></div>
            <div><dt>Teacher</dt><dd>{teacher ? fullName(teacher) : 'Not assigned yet'}</dd></div>
            <div><dt>Class time</dt><dd>{hhmm(batch.start_time)} – {hhmm(batch.end_time)}</dd></div>
            <div><dt>Days</dt><dd>{days.length ? days.join(', ') : 'Not set'}</dd></div>
            <div><dt>Venue</dt><dd>{batch.venue || 'Not set'}</dd></div>
            <div><dt>Duration</dt><dd>{course?.no_of_weeks != null ? `${course.no_of_weeks} weeks` : '—'}</dd></div>
            {course?.price != null && perms.staff && <div><dt>Course fee</dt><dd>{money(course.price)}</dd></div>}
            {course?.material && <div><dt>Study material</dt><dd>{course.material}</dd></div>}
          </dl>
          {course?.description && <p className="muted mt">{course.description}</p>}
        </Card>

        <Card title="Course progress" subtitle={isComplete(batch, course) ? 'All modules have been taught.' : 'Modules the teacher has completed so far.'}>
          <ProgressBar value={done} max={total} suffix="modules" />
          {role === 'student' && me && (
            <dl className="dl mt">
              <div><dt>Your discount</dt><dd>{Number(me.discount || 0)}%</dd></div>
              <div><dt>Certificate</dt><dd>{me.certificate ? <Badge tone="success">Issued</Badge> : <Badge>Not issued yet</Badge>}</dd></div>
            </dl>
          )}
          {perms.teach && (
            <form className="row-end mt" onSubmit={saveProgress}>
              <Field label="Modules completed" hint={total ? `Out of ${total}` : 'This course has no modules yet'}>
                <input type="number" min="0" max={total || undefined} value={n} onChange={(e) => setN(e.target.value)} />
              </Field>
              <Button type="submit" loading={busy}>Update progress</Button>
              <span className="muted small">{total ? `${pct(done, total)}% complete` : ''}</span>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
