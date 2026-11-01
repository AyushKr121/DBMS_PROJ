import { useNavigate } from 'react-router-dom';
import { api } from '@/api';
import { batchDeleteImpact } from '@/api/services';
import { useAction } from '@/hooks/useAction';
import { useConfirm } from '@/context/ConfirmContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import BatchForm from '@/components/batch/BatchForm';
import { useBatch } from './BatchLayout';

/** Staff: edit timing, venue, days and teacher of this batch, or delete it. */
export default function BatchSettings() {
  const { role, batch, bid, courses, teachers, allBatches, schedule, reload } = useBatch();
  const navigate = useNavigate();
  const confirm = useConfirm();
  const [run, busy] = useAction();

  const del = async () => {
    const i = await batchDeleteImpact(bid);
    const ok = await confirm({
      title: 'Delete this batch?', danger: true, confirmLabel: 'Delete batch', message: 'This cannot be undone. These records are deleted with it:',
      items: [`${i.enrollments} enrollment(s)`, `${i.tests} test(s) and their scores`, `${i.attendance} attendance record(s)`, 'its schedule and notices'],
    });
    if (!ok) return;
    const r = await run(() => api.remove('batch', [bid]), 'Batch deleted');
    if (r.ok) navigate(`/${role}/batches`);
  };

  return (
    <div className="stack">
      <Card title="Batch settings"><BatchForm courses={courses} teachers={teachers} batches={allBatches} schedule={schedule} batch={batch} onDone={reload} /></Card>
      <Card title="Delete batch" className="danger-zone">
        <p className="muted">Removing a batch also removes its enrollments, tests, scores, attendance and notices. Fee payments are deleted with the enrollment's batch too.</p>
        <Button variant="danger" icon="trash" onClick={del} loading={busy}>Delete batch</Button>
      </Card>
    </div>
  );
}
