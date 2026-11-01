import { useAuth } from '@/context/AuthContext';
import { useResources } from '@/hooks/useResources';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { byKey, money, today } from '@/utils/format';
import { feeSummary, paymentsOf } from '@/utils/fees';
import { gate } from '@/components/ui/Async';
import PageHeader from '@/components/ui/PageHeader';
import StatCard from '@/components/ui/StatCard';
import TodayClasses from '@/components/batch/TodayClasses';
import Card from '@/components/ui/Card';
import { Link } from 'react-router-dom';

export default function StaffDashboard() {
  useDocumentTitle('Dashboard');
  const { user } = useAuth();
  const r = user.role;
  const s = useResources(['student', 'teacher', 'assistant', 'course', 'batch', 'schedule', 'enrollment', 'feePayment', 'studentAttendance']);
  const g = gate(s);
  if (g) return g;
  const { d } = s;
  const due = d.enrollment.reduce((t, e) => {
    const b = byKey(d.batch, 'Batch_id', e.Batch_id);
    return t + feeSummary(byKey(d.course, 'Course_id', b?.Course_id), e, paymentsOf(d.feePayment, e.Student_id, e.Batch_id)).remaining;
  }, 0);
  const markedToday = new Set(d.studentAttendance.filter((a) => a.Date === today()).map((a) => a.Batch_id)).size;
  const noTeacher = d.batch.filter((b) => b.Teacher_id == null);

  return (
    <>
      <PageHeader title={`Hello, ${user.profile.First_name}`} subtitle="The institute at a glance." />
      <div className="grid-4 mb">
        <StatCard icon="users" label="Students" value={d.student.length} to={`/${r}/students`} />
        <StatCard icon="user" tone="success" label="Teachers" value={d.teacher.length} to={`/${r}/teachers`} />
        <StatCard icon="layers" tone="warning" label="Batches" value={d.batch.length} to={`/${r}/batches`} />
        <StatCard icon="book" label="Courses" value={d.course.length} to={`/${r}/courses`} />
        <StatCard icon="clipboard" label="Enrollments" value={d.enrollment.length} to={`/${r}/enrollments`} />
        <StatCard icon="card" tone={due > 0 ? 'warning' : 'success'} label="Fees outstanding" value={money(due)} to={`/${r}/fees`} />
        <StatCard icon="check" tone="success" label="Batches with attendance today" value={`${markedToday} / ${d.batch.length}`} />
        <StatCard icon="alert" tone={noTeacher.length ? 'danger' : 'success'} label="Batches without a teacher" value={noTeacher.length} />
      </div>
      <div className="grid-2">
        <TodayClasses role={r} batches={d.batch} courses={d.course} schedule={d.schedule} />
        <Card title="Quick actions">
          <ul className="link-list">
            <li><Link to={`/${r}/students`}>Register a student</Link></li>
            <li><Link to={`/${r}/enrollments`}>Enroll a student in a batch</Link></li>
            <li><Link to={`/${r}/fees`}>Record a fee payment</Link></li>
            <li><Link to={`/${r}/attendance/students`}>Mark student attendance</Link></li>
            <li><Link to={`/${r}/notifications`}>Global notifications</Link></li>
          </ul>
        </Card>
      </div>
    </>
  );
}
