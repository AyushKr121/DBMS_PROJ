import { useAuth } from '@/context/AuthContext';
import { useResources } from '@/hooks/useResources';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { summarizeAttendance, attendanceTone } from '@/utils/attendance';
import { formatDate } from '@/utils/format';
import { gate } from '@/components/ui/Async';
import PageHeader from '@/components/ui/PageHeader';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import StatCard from '@/components/ui/StatCard';
import DataTable from '@/components/ui/DataTable';
import SalaryStatus from '@/components/finance/SalaryStatus';

/** An assistant's own salary and attendance (read-only; the office marks them). */
export default function MyRecords() {
  useDocumentTitle('My salary & attendance');
  const { user } = useAuth();
  const id = user.profile.Assistant_id;
  const s = useResources(['assistantAttendance']);
  const g = gate(s);
  if (g) return g;
  const mine = s.d.assistantAttendance.filter((a) => a.Assistant_id === id).sort((a, b) => (a.Date < b.Date ? 1 : -1));
  const sum = summarizeAttendance(mine);
  const label = (v) => (Number(v) === 1 ? ['Present', 'success'] : Number(v) === 0.5 ? ['Half day', 'warning'] : ['Absent', 'danger']);
  return (
    <>
      <PageHeader title="My salary & attendance" subtitle="Your own records. Another assistant or admin marks your attendance." />
      <div className="grid-3 mb">
        <StatCard icon="check" tone={attendanceTone(sum.percent)} label="Attendance" value={`${sum.percent}%`} hint={`${sum.total} days recorded`} />
        <StatCard icon="user" tone="success" label="Present" value={sum.present} />
        <StatCard icon="alert" tone="danger" label="Absent / half" value={`${sum.absent} / ${sum.half}`} />
      </div>
      <Card title="Salary by month"><SalaryStatus role="assistant" id={id} /></Card>
      <Card flush title="Attendance history" className="mt">
        <DataTable rows={mine} rowKey={(a) => a.Date} empty={<p className="muted pad">No attendance recorded yet.</p>}
          columns={[{ key: 'd', header: 'Date', render: (a) => formatDate(a.Date) }, { key: 's', header: 'Status', render: (a) => <Badge tone={label(a.Status)[1]}>{label(a.Status)[0]}</Badge> }]} />
      </Card>
    </>
  );
}
