import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useResources } from '@/hooks/useResources';
import { useAction } from '@/hooks/useAction';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { publishGlobalNotification } from '@/api/services';
import { byKey, formatDateTime, fullName, isUnseen, sortDesc, stamp } from '@/utils/format';
import { gate } from '@/components/ui/Async';
import PageHeader from '@/components/ui/PageHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Field from '@/components/ui/Field';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import Alert from '@/components/ui/Alert';

/**
 * Institute-wide notices. A null "last seen" id means nothing has been read yet, so every notice is new.
 * Opening the page moves the marker forward to the newest notice. Notices can never be deleted.
 */
export default function GlobalNotifications() {
  useDocumentTitle('Notifications');
  const { user, lastSeen, markGlobalSeen } = useAuth();
  const s = useResources(['globalNotification', 'assistant']);
  const [run, busy] = useAction();
  const [baseline] = useState(lastSeen); // what was already read when the page was opened
  const [f, setF] = useState({ title: '', description: '' });
  const canSee = user.role !== 'admin';
  const canPublish = user.role === 'assistant';

  const list = s.d.globalNotification;
  useEffect(() => {
    if (!canSee || !list?.length) return;
    markGlobalSeen(Math.max(...list.map((n) => Number(n.Notification_id)))).catch((e) => console.error('[notifications] could not save the last-seen marker', e));
  }, [list, canSee, markGlobalSeen]);

  const g = gate(s);
  if (g) return g;
  const rows = sortDesc(list, (n) => stamp(n, 'Notification_date', 'Notification_time'));
  const isNew = (n) => canSee && isUnseen(n.Notification_id, baseline);
  const newCount = rows.filter(isNew).length;

  const publish = async (e) => {
    e.preventDefault();
    const r = await run(() => publishGlobalNotification(user.id, f), 'Notification published');
    if (r.ok) { setF({ title: '', description: '' }); s.reload(); }
  };

  return (
    <>
      <PageHeader title="Global notifications" subtitle="Announcements for everyone at the institute." />
      {canSee && newCount > 0 && <Alert tone="info" className="mb">{newCount} new notification{newCount === 1 ? '' : 's'} since you last looked.</Alert>}
      {user.role === 'admin' && <Alert tone="info" className="mb">Admins can read notifications but cannot publish them. Only assistants publish.</Alert>}

      {canPublish && (
        <Card title="Publish a notification" subtitle="Published notifications cannot be edited or deleted, so check the wording first." className="mb">
          <form className="stack" onSubmit={publish}>
            <Field label="Title" required><input required maxLength={255} value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} /></Field>
            <Field label="Message" required><textarea rows={4} required value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} /></Field>
            <div className="form-actions"><Button type="submit" icon="send" loading={busy}>Publish</Button></div>
          </form>
        </Card>
      )}

      {rows.length === 0 ? (
        <Card><EmptyState icon="bell" title="No notifications yet" text="Announcements from the institute will appear here." /></Card>
      ) : (
        <div className="stack">
          {rows.map((n) => (
            <Card key={n.Notification_id} className={`notice ${isNew(n) ? 'notice--new' : ''}`}>
              <div className="spread">
                <h3 className="notice__title">{n.Notification_title}</h3>
                {isNew(n) && <Badge tone="accent">New</Badge>}
              </div>
              <p className="notice__text">{n.Description}</p>
              <span className="notice__meta">
                {formatDateTime(n.Notification_date, n.Notification_time)}
                {byKey(s.d.assistant, 'Assistant_id', n.Assistant_id) && ` · posted by ${fullName(byKey(s.d.assistant, 'Assistant_id', n.Assistant_id))}`}
              </span>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
