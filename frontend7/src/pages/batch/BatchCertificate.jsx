import { useState } from 'react';
import { useAction } from '@/hooks/useAction';
import { updateEnrollment } from '@/api/services';
import { isComplete } from '@/utils/batch';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Field from '@/components/ui/Field';
import Icon from '@/components/ui/Icon';
import { useBatch } from './BatchLayout';

/** Student: certificate issued by the office + feedback about the batch. */
export default function BatchCertificate() {
  const { bid, me, user, batch, course, reload } = useBatch();
  const [run, busy] = useAction();
  const [fb, setFb] = useState(me.feedback || '');
  const cert = me.certificate;
  const isUrl = /^https?:\/\//i.test(cert || '');

  const save = async (e) => {
    e.preventDefault();
    const r = await run(() => updateEnrollment(user.id, bid, { feedback: fb.trim() || null }), 'Feedback saved');
    if (r.ok) reload();
  };

  return (
    <div className="grid-2">
      <Card title="Certificate">
        {cert ? (
          <div className="cert">
            <Icon name="award" size={34} />
            <div>
              <Badge tone="success">Issued</Badge>
              <p className="mt">{isUrl ? <a href={cert} target="_blank" rel="noreferrer">Open your certificate</a> : <>Certificate number <strong>{cert}</strong></>}</p>
            </div>
          </div>
        ) : (
          <p className="muted">
            Your certificate has not been issued yet. {isComplete(batch, course) ? 'The course is complete, so ask the front desk about it.' : 'The office issues it after the course is complete.'}
          </p>
        )}
      </Card>
      <Card title="Your feedback" subtitle="Tell us how this batch is going.">
        <form className="stack" onSubmit={save}>
          <textarea rows={5} aria-label="Feedback" value={fb} onChange={(e) => setFb(e.target.value)} />
          <div className="form-actions"><Button type="submit" loading={busy}>Save feedback</Button></div>
        </form>
      </Card>
    </div>
  );
}
