import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useResources } from '@/hooks/useResources';
import { useAction } from '@/hooks/useAction';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { suggestCertificateNumber, updateEnrollment } from '@/api/services';
import { byKey, fullName } from '@/utils/format';
import { isComplete } from '@/utils/batch';
import { gate } from '@/components/ui/Async';
import PageHeader from '@/components/ui/PageHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import DataTable from '@/components/ui/DataTable';
import SearchInput from '@/components/ui/SearchInput';
import EmptyState from '@/components/ui/EmptyState';

/** Issue / change / revoke certificate numbers across all enrollments. */
export default function Certificates() {
  useDocumentTitle('Certificates');
  const { user } = useAuth();
  const s = useResources(['enrollment', 'student', 'batch', 'course']);
  const [run, busy] = useAction();
  const [q, setQ] = useState('');
  const [onlyDone, setOnlyDone] = useState(false);
  const [draft, setDraft] = useState({});
  const g = gate(s);
  if (g) return g;
  const { d } = s;
  const used = d.enrollment.map((e) => e.certificate);
  const k = (e) => `${e.student_id}-${e.batch_id}`;
  const ctx = (e) => { const b = byKey(d.batch, 'batch_id', e.batch_id); const c = byKey(d.course, 'course_id', b?.course_id); return { b, c, st: byKey(d.student, 'student_id', e.student_id) }; };
  const needle = q.trim().toLowerCase();
  const rows = d.enrollment.filter((e) => { const { b, c, st } = ctx(e); return (!onlyDone || isComplete(b || {}, c)) && (!needle || `${st ? fullName(st) : ''} ${c?.course_Name || ''} ${e.certificate || ''}`.toLowerCase().includes(needle)); });

  const save = async (e, value) => {
    const r = await run(() => updateEnrollment(e.student_id, e.batch_id, { certificate: value }), value ? 'Certificate saved' : 'Certificate removed');
    if (r.ok) { setDraft((x) => { const n = { ...x }; delete n[k(e)]; return n; }); s.reload(); }
  };

  return (
    <>
      <PageHeader title="Certificates" subtitle="Issue a certificate number to an enrollment. Each number can be used once." />
      <Card flush title="Enrollments" actions={<><label className="check"><input type="checkbox" checked={onlyDone} onChange={(e) => setOnlyDone(e.target.checked)} /> Course completed only</label><SearchInput value={q} onChange={setQ} placeholder="Search…" /></>}>
        <DataTable rows={rows} rowKey={k} empty={<EmptyState icon="award" title="Nothing to show" />}
          columns={[
            { key: 's', header: 'Student', render: (e) => <Link to={`/${user.role}/batches/${e.batch_id}/students/${e.student_id}`}>{fullName(ctx(e).st || {})}</Link> },
            { key: 'c', header: 'Course', render: (e) => ctx(e).c?.course_Name },
            { key: 'p', header: 'Progress', render: (e) => (isComplete(ctx(e).b || {}, ctx(e).c) ? <Badge tone="success">Completed</Badge> : <Badge tone="neutral">{ctx(e).b?.modules_Completed || 0} / {ctx(e).c?.no_of_modules ?? '?'}</Badge>) },
            { key: 'n', header: 'Certificate no.', render: (e) => (
              <span className="row">
                <input aria-label="Certificate number" className="mono" value={draft[k(e)] ?? e.certificate ?? ''} onChange={(ev) => setDraft({ ...draft, [k(e)]: ev.target.value })} placeholder="Not issued" />
              </span>) },
            { key: 'a', header: '', actions: true, render: (e) => (
              <>
                <Button size="sm" variant="subtle" onClick={() => setDraft({ ...draft, [k(e)]: suggestCertificateNumber(used) })}>Suggest</Button>
                <Button size="sm" disabled={busy || draft[k(e)] === undefined || draft[k(e)] === (e.certificate ?? '')} onClick={() => save(e, draft[k(e)])}>Save</Button>
                {e.certificate && <Button size="sm" variant="danger-outline" disabled={busy} onClick={() => save(e, '')}>Revoke</Button>}
              </>) },
          ]} />
      </Card>
    </>
  );
}
