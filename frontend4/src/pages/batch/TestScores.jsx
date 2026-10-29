import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useResources } from '@/hooks/useResources';
import { useAction } from '@/hooks/useAction';
import { saveScores } from '@/api/services';
import { formatDate } from '@/utils/format';
import { gate } from '@/components/ui/Async';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import StatCard from '@/components/ui/StatCard';
import DataTable from '@/components/ui/DataTable';
import EmptyState from '@/components/ui/EmptyState';
import PersonCell from '@/components/people/PersonCell';
import { useBatch } from './BatchLayout';

/** Enter or correct every enrolled student's score for one test of this batch. */
export default function TestScores() {
  const { testId } = useParams();
  const tid = Number(testId);
  const { bid, students } = useBatch();
  const s = useResources(['test', 'takes']);
  const [run, busy] = useAction();
  const [scores, setScores] = useState({});

  const test = s.d.test?.find((t) => t.batch_id === bid && t.test_id === tid);
  const saved = s.d.takes?.filter((t) => t.batch_id === bid && t.test_id === tid);

  useEffect(() => {
    if (!saved) return;
    setScores(Object.fromEntries(students.map(({ e }) => [e.student_id, saved.find((t) => t.student_id === e.student_id)?.score ?? ''])));
  }, [saved, students]);

  const g = gate(s);
  if (g) return g;
  if (!test) return <Alert tone="danger">This test does not exist in this batch.</Alert>;

  const values = Object.values(scores).filter((v) => v !== '' && Number.isFinite(Number(v))).map(Number);
  const stat = (fn) => (values.length ? fn(values).toFixed(1) : '—');

  const save = async () => {
    const r = await run(() => saveScores(bid, tid, scores, s.d.takes), 'Scores saved');
    if (r.ok) s.reload();
  };

  return (
    <div className="stack">
      <Card title={test.test_title} subtitle={`${formatDate(test.date)} · leave a score empty if the student has not taken the test`} actions={<Link to=".." relative="path" className="btn btn--subtle btn--sm">Back to tests</Link>}>
        <div className="grid-4 mb">
          <StatCard icon="users" label="Scores entered" value={`${values.length} / ${students.length}`} />
          <StatCard icon="trending" label="Average" value={stat((v) => v.reduce((a, b) => a + b, 0) / v.length)} />
          <StatCard icon="award" tone="success" label="Highest" value={stat((v) => Math.max(...v))} />
          <StatCard icon="alert" tone="warning" label="Lowest" value={stat((v) => Math.min(...v))} />
        </div>
        {students.length === 0 ? (
          <EmptyState icon="users" title="No students enrolled" text="Scores can be entered once students are enrolled in this batch." />
        ) : (
          <>
            <DataTable
              pageSize={0}
              rows={students}
              rowKey={({ e }) => e.student_id}
              columns={[
                { key: 'name', header: 'Student', sortValue: ({ s: st }) => st.first_name, render: ({ s: st }) => <PersonCell person={st} size={30} /> },
                {
                  key: 'score', header: 'Score',
                  render: ({ e }) => (
                    <input
                      className="score-input" type="number" min="0" max="999.99" step="0.01" inputMode="decimal"
                      aria-label={`Score for student ${e.student_id}`}
                      value={scores[e.student_id] ?? ''}
                      onChange={(ev) => setScores({ ...scores, [e.student_id]: ev.target.value })}
                    />
                  ),
                },
              ]}
            />
            <div className="form-actions"><Button icon="check" onClick={save} loading={busy}>Save scores</Button></div>
          </>
        )}
      </Card>
    </div>
  );
}
