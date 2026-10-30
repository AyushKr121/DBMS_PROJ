import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useResources } from '@/hooks/useResources';
import { useAction } from '@/hooks/useAction';
import { useConfirm } from '@/context/ConfirmContext';
import { api } from '@/api';
import { saveTest } from '@/api/services';
import { formatDate, today } from '@/utils/format';
import { gate } from '@/components/ui/Async';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Field from '@/components/ui/Field';
import Modal from '@/components/ui/Modal';
import Icon from '@/components/ui/Icon';
import DataTable from '@/components/ui/DataTable';
import EmptyState from '@/components/ui/EmptyState';
import { useBatch } from './BatchLayout';

const link = (url, label) => (url ? <a href={url} target="_blank" rel="noreferrer" className="inline-link">{label} <Icon name="external" size={13} /></a> : <span className="muted">—</span>);

/** Tests of this batch. Students see links and their own score; teachers and staff create tests and enter scores. */
export default function BatchTests() {
  const { role, perms, bid, user } = useBatch();
  const s = useResources(['test', 'takes']);
  const confirm = useConfirm();
  const [run, busy] = useAction();
  const [form, setForm] = useState(null); // { existing?, Test_title, Date, ... }

  const g = gate(s);
  if (g) return g;
  const tests = s.d.test.filter((t) => t.Batch_id === bid).sort((a, b) => a.Test_id - b.Test_id);
  const myScore = (tid) => s.d.takes.find((t) => t.Student_id === user.id && t.Batch_id === bid && t.Test_id === tid)?.Score;

  const open = (t) => setForm(t
    ? { existing: t, Test_title: t.Test_title, Date: t.Date || '', Question_paper_Link: t.Question_paper_Link || '', Answerkey_Link: t.Answerkey_Link || '' }
    : { Test_title: '', Date: today(), Question_paper_Link: '', Answerkey_Link: '' });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    const r = await run(() => saveTest(bid, form, form.existing), form.existing ? 'Test updated' : 'Test created');
    if (r.ok) { setForm(null); s.reload(); }
  };
  const del = async (t) => {
    const scores = s.d.takes.filter((x) => x.Batch_id === bid && x.Test_id === t.Test_id).length;
    const ok = await confirm({ title: `Delete "${t.Test_title}"?`, danger: true, confirmLabel: 'Delete test', message: scores ? `The ${scores} score(s) entered for this test will be deleted too.` : 'This cannot be undone.' });
    if (!ok) return;
    const r = await run(() => api.remove('test', t), 'Test deleted');
    if (r.ok) s.reload();
  };

  return (
    <div className="stack">
      <Card
        title={`Tests (${tests.length})`}
        subtitle={perms.teach ? 'Create a test for this batch, share the paper links, then enter scores.' : 'Links to question papers and answer keys, with your scores.'}
        flush
        actions={perms.teach && <Button icon="plus" size="sm" onClick={() => open(null)}>New test</Button>}
      >
        <DataTable
          pageSize={10}
          rows={tests}
          rowKey={(t) => t.Test_id}
          empty={<EmptyState icon="clipboard" title="No tests yet" text={perms.teach ? 'Create the first test for this batch.' : 'Your teacher has not scheduled a test yet.'} />}
          columns={[
            { key: 'Test_title', header: 'Test', render: (t) => <strong>{t.Test_title}</strong> },
            { key: 'date', header: 'Date', sortValue: (t) => t.Date || '', render: (t) => formatDate(t.Date) },
            { key: 'q', header: 'Question paper', render: (t) => link(t.Question_paper_Link, 'Open paper') },
            { key: 'a', header: 'Answer key', render: (t) => link(t.Answerkey_Link, 'Open key') },
            ...(perms.teach
              ? [{
                key: 'act', header: '', actions: true,
                render: (t) => (
                  <>
                    <Button to={`${t.Test_id}`} size="sm" icon="list">Scores</Button>
                    <Button size="sm" variant="secondary" icon="edit" onClick={() => open(t)} aria-label={`Edit ${t.Test_title}`} />
                    {perms.deleteRecords && <Button size="sm" variant="danger-outline" icon="trash" onClick={() => del(t)} aria-label={`Delete ${t.Test_title}`} />}
                  </>
                ),
              }]
              : [{ key: 'score', header: 'My score', align: 'num', render: (t) => myScore(t.Test_id) ?? <span className="muted">Not graded</span> }]),
          ]}
        />
      </Card>
      {role === 'student' && tests.length > 0 && <p className="muted small">Scores appear here once your teacher has entered them.</p>}
      {!perms.teach ? null : <p className="muted small"><Link to="../attendance">Marking today's attendance?</Link></p>}

      <Modal
        open={!!form}
        onClose={() => setForm(null)}
        title={form?.existing ? 'Edit test' : 'New test'}
        footer={(<><Button variant="subtle" onClick={() => setForm(null)}>Cancel</Button><Button type="submit" form="test-form" loading={busy}>{form?.existing ? 'Save changes' : 'Create test'}</Button></>)}
      >
        {form && (
          <form id="test-form" className="stack" onSubmit={submit}>
            <Field label="Test title" required><input required maxLength={255} value={form.Test_title} onChange={set('Test_title')} /></Field>
            <Field label="Date"><input type="date" value={form.Date} onChange={set('Date')} /></Field>
            <Field label="Question paper link" hint="A shared link starting with https://"><input type="url" placeholder="https://" value={form.Question_paper_Link} onChange={set('Question_paper_Link')} /></Field>
            <Field label="Answer key link"><input type="url" placeholder="https://" value={form.Answerkey_Link} onChange={set('Answerkey_Link')} /></Field>
          </form>
        )}
      </Modal>
    </div>
  );
}
