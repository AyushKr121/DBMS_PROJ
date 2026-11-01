import { useResources } from '@/hooks/useResources';
import { formatDate } from '@/utils/format';
import { attendanceTone, summarizeAttendance } from '@/utils/attendance';
import { gate } from '@/components/ui/Async';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import DataTable from '@/components/ui/DataTable';
import EmptyState from '@/components/ui/EmptyState';
import ProgressBar from '@/components/ui/ProgressBar';
import AttendanceSheet from '@/components/batch/AttendanceSheet';
import { useBatch } from './BatchLayout';

export default function BatchAttendance() {
  const { perms, bid, students } = useBatch();
  return perms.teach ? <AttendanceSheet batchId={bid} students={students} /> : <MyAttendance />;
}

/** A student's own attendance in this batch. */
function MyAttendance() {
  const { bid, user } = useBatch();
  const s = useResources(['studentAttendance']);
  const g = gate(s);
  if (g) return g;
  const mine = s.d.studentAttendance.filter((a) => a.Batch_id === bid && a.Student_id === user.id);
  const sum = summarizeAttendance(mine);

  return (
    <Card title="My attendance in this batch">
      {sum.total === 0 ? (
        <EmptyState icon="calendar" title="No attendance marked yet" text="Your teacher's records will appear here after each class." />
      ) : (
        <>
          <ProgressBar value={sum.present} max={sum.total} tone={attendanceTone(sum.percent)} label={`${sum.present} present out of ${sum.total} classes`} />
          <p className="muted small mt">{sum.percent >= 75 ? 'Your attendance is healthy.' : 'Attendance below 75% may affect your certificate. Talk to your teacher.'}</p>
          <DataTable
            rows={mine}
            rowKey={(a) => a.Date}
            pageSize={10}
            initialSort={{ key: 'date', dir: 'desc' }}
            columns={[
              { key: 'date', header: 'Date', sortValue: (a) => a.Date, render: (a) => formatDate(a.Date) },
              { key: 'status', header: 'Status', render: (a) => (Number(a.Status) === 1 ? <Badge tone="success">Present</Badge> : <Badge tone="danger">Absent</Badge>) },
            ]}
          />
        </>
      )}
    </Card>
  );
}
