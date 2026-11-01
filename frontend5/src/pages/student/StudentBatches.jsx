import { useAuth } from '@/context/AuthContext';
import { useResources } from '@/hooks/useResources';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { byKey } from '@/utils/format';
import { daysOf } from '@/utils/batch';
import { gate } from '@/components/ui/Async';
import PageHeader from '@/components/ui/PageHeader';
import EmptyState from '@/components/ui/EmptyState';
import Badge from '@/components/ui/Badge';
import BatchCard from '@/components/batch/BatchCard';

/** The batches this student is enrolled in. Everything else lives inside each batch. */
export default function StudentBatches() {
  useDocumentTitle('My batches');
  const { user } = useAuth();
  const s = useResources(['enrollment', 'batch', 'course', 'schedule', 'batchNotification']);

  const g = gate(s);
  if (g) return g;
  const { d } = s;
  const mine = d.enrollment.filter((e) => e.student_id === user.id);

  return (
    <>
      <PageHeader title="My batches" subtitle="Open a batch to see its timing, modules, tests, attendance, fee status, certificate and notices." />
      {mine.length === 0 ? (
        <EmptyState icon="layers" title="You are not in any batch yet" text="Enrollment is done at the institute. Ask an assistant to enroll you." />
      ) : (
        <div className="grid-3">
          {mine.map((e) => {
            const b = byKey(d.batch, 'batch_id', e.batch_id);
            if (!b) return null;
            const unseen = e.batch_Notification_Status !== true && d.batchNotification.some((n) => n.batch_id === b.batch_id);
            return (
              <BatchCard
                key={b.batch_id}
                to={`/student/batches/${b.batch_id}`}
                batch={b}
                course={byKey(d.course, 'course_id', b.course_id)}
                days={daysOf(d.schedule, b.batch_id)}
                badges={unseen ? <Badge tone="accent">New notice</Badge> : null}
              />
            );
          })}
        </div>
      )}
    </>
  );
}
