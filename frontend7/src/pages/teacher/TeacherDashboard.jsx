import { useAuth } from '@/context/AuthContext';
import { useResources } from '@/hooks/useResources';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { MONTHS } from '@/utils/constants';
import { money } from '@/utils/format';
import { gate } from '@/components/ui/Async';
import PageHeader from '@/components/ui/PageHeader';
import StatCard from '@/components/ui/StatCard';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import TodayClasses from '@/components/batch/TodayClasses';
import { Link } from 'react-router-dom';

export default function TeacherDashboard() {
  useDocumentTitle('Dashboard');
  const { user, unread } = useAuth();
  const s = useResources(['batch', 'course', 'schedule', 'enrollment', 'teacherSalary']);

  const g = gate(s);
  if (g) return g;
  const { d } = s;
  const mine = d.batch.filter((b) => b.teacher_id === user.id);
  const ids = new Set(mine.map((b) => b.batch_id));
  const students = d.enrollment.filter((e) => ids.has(e.batch_id)).length;
  const now = new Date();
  const paidThisMonth = d.teacherSalary.filter((r) => r.teacher_id === user.id && r.month === now.getMonth() + 1 && r.year === now.getFullYear());
  const paidAmount = paidThisMonth.reduce((t, r) => t + Number(r.amount), 0);

  return (
    <>
      <PageHeader title={`Hello, ${user.profile.first_name}`} subtitle="Your classes and records at a glance." />
      <div className="grid-4 mb">
        <StatCard icon="layers" label="Batches you teach" value={mine.length} to="/teacher/batches" />
        <StatCard icon="users" tone="success" label="Student enrollments" value={students} />
        <StatCard icon="dollar" tone={paidThisMonth.length ? 'success' : 'warning'} label={`${MONTHS[now.getMonth()]} salary`} value={paidThisMonth.length ? money(paidAmount) : 'Not paid yet'} to="/teacher/salary" />
        <StatCard icon="bell" tone="danger" label="Unread notifications" value={unread} to="/teacher/notifications" />
      </div>
      <div className="grid-2">
        <TodayClasses role="teacher" batches={mine} courses={d.course} schedule={d.schedule} />
        <Card title="Your batches">
          {mine.length === 0 ? <p className="muted">No batches are assigned to you yet.</p> : (
            <ul className="link-list">
              {mine.map((b) => {
                const c = d.course.find((x) => x.course_id === b.course_id);
                return (
                  <li key={b.batch_id}>
                    <Link to={`/teacher/batches/${b.batch_id}`}>{c?.course_Name}</Link>
                    <Badge>{d.enrollment.filter((e) => e.batch_id === b.batch_id).length} students</Badge>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}
