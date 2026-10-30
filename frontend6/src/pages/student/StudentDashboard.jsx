import { useAuth } from '@/context/AuthContext';
import { useResources } from '@/hooks/useResources';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { byKey, money, plural } from '@/utils/format';
import { summarizeAttendance } from '@/utils/attendance';
import { feeSummary, paymentsOf } from '@/utils/fees';
import { gate } from '@/components/ui/Async';
import PageHeader from '@/components/ui/PageHeader';
import StatCard from '@/components/ui/StatCard';
import Card from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';
import TodayClasses from '@/components/batch/TodayClasses';
import { Link } from 'react-router-dom';

export default function StudentDashboard() {
  useDocumentTitle('Dashboard');
  const { user, unread } = useAuth();
  const s = useResources(['enrollment', 'batch', 'course', 'schedule', 'studentAttendance', 'feePayment', 'batchNotification']);

  const g = gate(s);
  if (g) return g;
  const { d } = s;
  const mine = d.enrollment.filter((e) => e.Student_id === user.id);
  const batches = mine.map((e) => byKey(d.batch, 'Batch_id', e.Batch_id)).filter(Boolean);

  const att = summarizeAttendance(d.studentAttendance.filter((a) => a.Student_id === user.id));
  const dues = mine.map((e) => {
    const b = byKey(d.batch, 'Batch_id', e.Batch_id);
    const c = byKey(d.course, 'Course_id', b?.Course_id);
    return { e, b, c, fee: feeSummary(c, e, paymentsOf(d.feePayment, user.id, e.Batch_id)) };
  });
  const totalDue = dues.reduce((t, x) => t + x.fee.remaining, 0);
  const newNotices = mine.filter((e) => e.Batch_Notification_Status !== true && d.batchNotification.some((n) => n.Batch_id === e.Batch_id));

  return (
    <>
      <PageHeader title={`Hello, ${user.profile.First_name}`} subtitle="Here is where your batches stand today." />
      <div className="grid-4 mb">
        <StatCard icon="layers" label="Batches joined" value={mine.length} to="/student/batches" />
        <StatCard icon="check" tone="success" label="Attendance" value={att.total ? `${att.percent}%` : '—'} hint={att.total ? `${att.present} of ${att.total} classes` : 'No classes marked yet'} />
        <StatCard icon="card" tone={totalDue > 0 ? 'warning' : 'success'} label="Fees remaining" value={money(totalDue)} hint={totalDue > 0 ? 'Pay at the front desk' : 'Nothing due'} />
        <StatCard icon="bell" tone="danger" label="New notices" value={unread + newNotices.length} hint={`${unread} global · ${plural(newNotices.length, 'batch notice')}`} to="/student/notifications" />
      </div>

      <div className="grid-2">
        <TodayClasses role="student" batches={batches} courses={d.course} schedule={d.schedule} />
        <Card title="Fee status by batch">
          {dues.length === 0 ? <EmptyState icon="layers" title="No batches yet" text="Ask the front desk to enroll you in a batch." /> : (
            <ul className="link-list">
              {dues.map(({ e, c, fee }) => (
                <li key={e.Batch_id}>
                  <Link to={`/student/batches/${e.Batch_id}/fees`}>{c?.Course_Name}</Link>
                  <span className={fee.remaining > 0 ? 'text-warn' : 'text-ok'}>{fee.remaining > 0 ? `${money(fee.remaining)} due` : 'Paid in full'}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}
