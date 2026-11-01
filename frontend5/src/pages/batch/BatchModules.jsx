import { useResources } from '@/hooks/useResources';
import { useAction } from '@/hooks/useAction';
import { setModulesCompleted } from '@/api/services';
import { gate } from '@/components/ui/Async';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import ProgressBar from '@/components/ui/ProgressBar';
import { modulesDone } from '@/utils/batch';
import { useBatch } from './BatchLayout';

/** Course modules in order, marked done up to Batch.Modules_Completed. */
export default function BatchModules() {
  const { role, perms, batch, course, reload } = useBatch();
  const s = useResources(['courseModule']);
  const [run, busy] = useAction();

  const g = gate(s);
  if (g) return g;
  const mods = s.d.courseModule.filter((m) => m.course_id === batch.course_id).sort((a, b) => a.module_id - b.module_id);
  const done = modulesDone(batch, course);

  const markUpTo = async (count) => {
    const r = await run(() => setModulesCompleted(batch, count, mods.length || null), count === 0 ? 'Progress cleared' : `Marked ${count} module(s) as completed`);
    if (r.ok) reload();
  };

  return (
    <Card
      title="Modules"
      subtitle="Modules are taught in this order."
      actions={perms.staff && <Button variant="secondary" size="sm" to={`/${role}/courses/${batch.course_id}`}>Manage modules</Button>}
    >
      <ProgressBar value={done} max={mods.length || course?.no_of_modules || 0} suffix="modules" />
      {mods.length === 0 ? (
        <EmptyState icon="book" title="No modules added" text="The office has not listed the modules of this course yet." />
      ) : (
        <ol className="module-list">
          {mods.map((m, i) => {
            const isDone = i < done;
            return (
              <li key={m.module_id} className={isDone ? 'is-done' : ''}>
                <span className="module-list__mark" aria-hidden="true">{isDone ? '✓' : i + 1}</span>
                <div className="grow">
                  <strong>{m.module_title}</strong>
                  {m.module_description && <p className="muted small">{m.module_description}</p>}
                </div>
                {isDone ? <Badge tone="success">Completed</Badge> : <Badge>Upcoming</Badge>}
                {perms.teach && (
                  <Button variant="ghost" size="sm" disabled={busy} onClick={() => markUpTo(isDone && i === done - 1 ? i : i + 1)}>
                    {isDone && i === done - 1 ? 'Undo' : 'Completed up to here'}
                  </Button>
                )}
              </li>
            );
          })}
        </ol>
      )}
      {role === 'student' && mods.length > 0 && <p className="muted small">Your teacher updates progress as the class moves forward.</p>}
    </Card>
  );
}
