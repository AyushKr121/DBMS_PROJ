import { useEffect, useState } from 'react';
import { useResources } from '@/hooks/useResources';
import { useAction } from '@/hooks/useAction';
import { markBatchNoticesSeen, postBatchNotification } from '@/api/services';
import { gate } from '@/components/ui/Async';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Field from '@/components/ui/Field';
import Alert from '@/components/ui/Alert';
import EmptyState from '@/components/ui/EmptyState';
import { useBatch } from './BatchLayout';

/**
 * Notices for this batch only. Enrollment.Batch_Notification_Status: null/false = unread, true = read.
 * Posting resets everyone in the batch to unread. Notices cannot be deleted.
 */
export default function BatchNotifications() {
  const { role, perms, bid, me, user, reload } = useBatch();
  const s = useResources(['batchNotification']);
  const [run, busy] = useAction();
  const [f, setF] = useState({ title: '', description: '' });
  const [wasUnread] = useState(role === 'student' && me?.Batch_Notification_Status !== true);
  const list = (s.d.batchNotification || []).filter((n) => n.Batch_id === bid).sort((a, b) => b.Notification_id - a.Notification_id);

  useEffect(() => {
    if (role === 'student' && list.length && me.Batch_Notification_Status !== true) {
      markBatchNoticesSeen(user.id, bid).then(reload).catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list.length]);

  const g = gate(s);
  if (g) return g;

  const post = async (e) => {
    e.preventDefault();
    const r = await run(() => postBatchNotification(bid, f), 'Notice posted to the batch');
    if (r.ok) { setF({ title: '', description: '' }); s.reload(); reload(); }
  };

  return (
    <div className="stack">
      {wasUnread && list.length > 0 && <Alert tone="info">You have new notices in this batch.</Alert>}
      {perms.teach && (
        <Card title="Post a notice" subtitle="Everyone enrolled sees it. Posted notices cannot be edited or deleted.">
          <form className="stack" onSubmit={post}>
            <Field label="Title" required><input required maxLength={255} value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} /></Field>
            <Field label="Message"><textarea rows={3} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} /></Field>
            <div className="form-actions"><Button type="submit" icon="send" loading={busy}>Post notice</Button></div>
          </form>
        </Card>
      )}
      {list.length === 0 ? (
        <Card><EmptyState icon="bell" title="No notices for this batch" /></Card>
      ) : list.map((n) => (
        <Card key={n.Notification_id} className="notice">
          <h3 className="notice__title">{n.Title}</h3>
          {n.Description && <p className="notice__text">{n.Description}</p>}
        </Card>
      ))}
    </div>
  );
}
