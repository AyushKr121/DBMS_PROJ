import { useMemo, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useResources } from '@/hooks/useResources';
import { useAction } from '@/hooks/useAction';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { fileComplaint } from '@/api/services';
import { ROLE_CFG } from '@/utils/constants';
import { byKey, formatDateTime, sortDesc, stamp } from '@/utils/format';
import { gate } from '@/components/ui/Async';
import PageHeader from '@/components/ui/PageHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Field from '@/components/ui/Field';
import DataTable from '@/components/ui/DataTable';
import EmptyState from '@/components/ui/EmptyState';
import SearchInput from '@/components/ui/SearchInput';
import { Tabs } from '@/components/ui/Tabs';
import PersonCell from '@/components/people/PersonCell';

export default function Complaints() {
  const { user } = useAuth();
  useDocumentTitle('Complaints');
  return user.role === 'admin' ? <AllComplaints /> : <MyComplaints />;
}

/** Student / teacher / assistant: their own complaints and a form to file a new one. */
function MyComplaints() {
  const { user } = useAuth();
  const cfg = ROLE_CFG[user.role];
  const s = useResources([cfg.complaints]);
  const [run, busy] = useAction();
  const [f, setF] = useState({ title: '', description: '' });

  const g = gate(s);
  if (g) return g;
  const mine = sortDesc(s.d[cfg.complaints].filter((c) => c[cfg.idField] === user.id), (c) => stamp(c, 'complaint_date', 'complaint_time'));

  const submit = async (e) => {
    e.preventDefault();
    const r = await run(() => fileComplaint(user.role, user.id, f), 'Complaint submitted');
    if (r.ok) { setF({ title: '', description: '' }); s.reload(); }
  };

  return (
    <>
      <PageHeader title="Complaints" subtitle="Tell the institute about a problem. Complaints are reviewed by the admin." />
      <div className="grid-2 grid-2--wide-right">
        <Card title="New complaint">
          <form className="stack" onSubmit={submit}>
            <Field label="Title" required><input required maxLength={255} value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} /></Field>
            <Field label="What happened?"><textarea rows={5} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} /></Field>
            <div className="form-actions"><Button type="submit" icon="send" loading={busy}>Submit complaint</Button></div>
          </form>
        </Card>
        <Card title={`Your complaints (${mine.length})`}>
          {mine.length === 0 ? <EmptyState icon="check" title="No complaints filed" text="Complaints you submit will be listed here." /> : (
            <div className="stack">
              {mine.map((c) => (
                <article key={c.complaint_id} className="complaint">
                  <h4>{c[cfg.complaintTitle]}</h4>
                  {c.complaint_description && <p>{c.complaint_description}</p>}
                  <span className="muted small">{formatDateTime(c.complaint_date, c.complaint_time)}</span>
                </article>
              ))}
            </div>
          )}
        </Card>
      </div>
    </>
  );
}

/** Admin: read-only view of everybody's complaints. */
function AllComplaints() {
  const [role, setRole] = useState('student');
  const [q, setQ] = useState('');
  const cfg = ROLE_CFG[role];
  const s = useResources([cfg.complaints, cfg.resource]);

  const rows = useMemo(() => {
    if (s.loading || s.error) return [];
    const needle = q.trim().toLowerCase();
    return sortDesc(s.d[cfg.complaints], (c) => stamp(c, 'complaint_date', 'complaint_time')).filter((c) => {
      if (!needle) return true;
      const who = byKey(s.d[cfg.resource], cfg.idField, c[cfg.idField]);
      return `${c[cfg.complaintTitle]} ${c.complaint_description || ''} ${who?.first_name || ''} ${who?.last_name || ''}`.toLowerCase().includes(needle);
    });
  }, [s, q, cfg]);

  return (
    <>
      <PageHeader title="Complaints" subtitle="Everything filed by students, teachers and assistants. Admins can read complaints but not file them." />
      <Tabs label="Complaints by role" value={role} onChange={(r) => { setRole(r); setQ(''); }} tabs={[{ key: 'student', label: 'Students' }, { key: 'teacher', label: 'Teachers' }, { key: 'assistant', label: 'Assistants' }]} />
      <Card flush>
        <div className="card__toolbar"><SearchInput value={q} onChange={setQ} placeholder="Search by name or text…" /></div>
        {gate(s) || (
          <DataTable
            rows={rows}
            rowKey={(c) => `${c.complaint_id}-${c[cfg.idField]}`}
            empty={<EmptyState icon="check" title="No complaints" text="Nothing matches in this group." />}
            columns={[
              { key: 'when', header: 'When', sortValue: (c) => stamp(c, 'complaint_date', 'complaint_time'), render: (c) => formatDateTime(c.complaint_date, c.complaint_time) },
              { key: 'who', header: 'From', render: (c) => <PersonCell person={byKey(s.d[cfg.resource], cfg.idField, c[cfg.idField])} size={30} /> },
              { key: 'title', header: 'Title', sortValue: (c) => c[cfg.complaintTitle], render: (c) => <strong>{c[cfg.complaintTitle]}</strong> },
              { key: 'desc', header: 'Details', render: (c) => c.complaint_description || '—' },
            ]}
          />
        )}
      </Card>
    </>
  );
}
