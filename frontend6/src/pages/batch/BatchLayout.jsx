import { Outlet, useOutletContext, useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useResources } from '@/hooks/useResources';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { can } from '@/utils/permissions';
import { byKey, fullName, hhmm, formatDate } from '@/utils/format';
import { daysOf, shortDays } from '@/utils/batch';
import { gate } from '@/components/ui/Async';
import PageHeader from '@/components/ui/PageHeader';
import Alert from '@/components/ui/Alert';
import Icon from '@/components/ui/Icon';
import { TabNav } from '@/components/ui/Tabs';

export const useBatch = () => useOutletContext();

/**
 * One workspace per batch, shared by students, teachers and staff. Everything inside (modules, tests,
 * attendance, fees, notices) is scoped to this batch. Students only get their own enrollment; teachers only batches they teach.
 */
export default function BatchLayout({ role }) {
  const { batchId } = useParams();
  const bid = Number(batchId);
  const { user } = useAuth();
  const perms = can(role);
  const s = useResources(['batch', 'course', 'schedule', 'enrollment', 'teacher', 'batchNotification', ...(role === 'student' ? [] : ['student'])]);

  const batch = s.d.batch?.find((b) => b.Batch_id === bid);
  const course = batch ? byKey(s.d.course, 'Course_id', batch.Course_id) : null;
  useDocumentTitle(course?.Course_Name);

  const g = gate(s);
  if (g) return g;

  const back = { to: `/${role}/batches`, label: 'All batches' };
  const deny = (msg) => (
    <>
      <PageHeader title="Batch not available" back={back} />
      <Alert tone="danger">{msg}</Alert>
    </>
  );
  if (!batch) return deny('This batch does not exist or has been removed.');

  const enrollments = s.d.enrollment.filter((e) => e.Batch_id === bid);
  const me = enrollments.find((e) => e.Student_id === user.id);
  if (role === 'student' && !me) return deny('You are not enrolled in this batch.');
  if (role === 'teacher' && batch.Teacher_id !== user.id) return deny('This batch is not assigned to you.');

  const teacher = byKey(s.d.teacher, 'Teacher_id', batch.Teacher_id);
  const days = daysOf(s.d.schedule, bid);
  const students = enrollments.map((e) => ({ e, s: byKey(s.d.student || [], 'Student_id', e.Student_id) })).filter((x) => x.s);
  const hasNotices = s.d.batchNotification.some((n) => n.Batch_id === bid);

  const ctx = {
    role, perms, user, batch, bid, course, teacher, days, enrollments, students, me,
    courses: s.d.course, teachers: s.d.teacher, allBatches: s.d.batch, schedule: s.d.schedule, reload: s.reload,
  };

  const base = [
    { to: 'overview', label: 'Overview' },
    { to: 'modules', label: 'Modules' },
  ];
  const tabs = role === 'student'
    ? [...base, { to: 'tests', label: 'Tests' }, { to: 'attendance', label: 'Attendance' }, { to: 'fees', label: 'Fee status' }, { to: 'certificate', label: 'Certificate' },
      { to: 'notifications', label: 'Notifications', dot: hasNotices && me.Batch_Notification_Status !== true }]
    : [...base, { to: 'students', label: `Students (${enrollments.length})` }, { to: 'tests', label: 'Tests' }, { to: 'attendance', label: 'Attendance' },
      ...(perms.staff ? [{ to: 'fees', label: 'Fees' }] : []),
      { to: 'notifications', label: 'Notifications' },
      ...(perms.staff ? [{ to: 'settings', label: 'Settings' }] : [])];

  return (
    <>
      <PageHeader title={course?.Course_Name || 'Batch'} back={back}>
        <ul className="batch-meta">
          <li><Icon name="calendar" size={15} /> Starts {formatDate(batch.Start_date)}</li>
          <li><Icon name="clock" size={15} /> {hhmm(batch.Start_time)} – {hhmm(batch.End_time)} · {shortDays(days)}</li>
          <li><Icon name="pin" size={15} /> {batch.Venue || 'Venue not set'}</li>
          <li><Icon name="user" size={15} /> {teacher ? fullName(teacher) : 'No teacher assigned'}</li>
        </ul>
      </PageHeader>
      <TabNav tabs={tabs} label="Batch sections" />
      <Outlet context={ctx} />
    </>
  );
}
