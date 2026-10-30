import { useAuth } from '@/context/AuthContext';
import { useResources } from '@/hooks/useResources';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { byKey, plural } from '@/utils/format';
import { daysOf } from '@/utils/batch';
import { gate } from '@/components/ui/Async';
import PageHeader from '@/components/ui/PageHeader';
import EmptyState from '@/components/ui/EmptyState';
import Badge from '@/components/ui/Badge';
import BatchCard from '@/components/batch/BatchCard';

/** Only the batches assigned to this teacher. */
export default function TeacherBatches() {
  useDocumentTitle('My batches');
  const { user } = useAuth();
  const s = useResources(['batch', 'course', 'schedule', 'enrollment']);

  const g = gate(s);
  if (g) return g;
  const { d } = s;
  const mine = d.batch.filter((b) => b.Teacher_id === user.id);

  return (
    <>
      <PageHeader title="My batches" subtitle="Batches assigned to you. Open one to teach it: tests, scores, attendance and notices." />
      {mine.length === 0 ? (
        <EmptyState icon="layers" title="No batches assigned" text="When the office assigns you a batch it will appear here." />
      ) : (
        <div className="grid-3">
          {mine.map((b) => (
            <BatchCard
              key={b.Batch_id}
              to={`/teacher/batches/${b.Batch_id}`}
              batch={b}
              course={byKey(d.course, 'Course_id', b.Course_id)}
              days={daysOf(d.schedule, b.Batch_id)}
              badges={<Badge>{plural(d.enrollment.filter((e) => e.Batch_id === b.Batch_id).length, 'student')}</Badge>}
            />
          ))}
        </div>
      )}
    </>
  );
}
