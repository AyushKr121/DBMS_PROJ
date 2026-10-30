import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useResources } from '@/hooks/useResources';
import { useAction } from '@/hooks/useAction';
import { useConfirm } from '@/context/ConfirmContext';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { accountImpact, deleteAccount } from '@/api/services';
import { ROLE_CFG } from '@/utils/constants';
import { formatDate, middleNameMap, money } from '@/utils/format';
import { gate } from '@/components/ui/Async';
import PageHeader from '@/components/ui/PageHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import DataTable from '@/components/ui/DataTable';
import EmptyState from '@/components/ui/EmptyState';
import SearchInput from '@/components/ui/SearchInput';
import PersonCell from '@/components/people/PersonCell';
import PersonForm from '@/components/people/PersonForm';
import CredentialsModal from '@/components/people/CredentialsModal';

/** List / register / open people of one role. Only admins can delete accounts. */
export default function People({ role }) {
  const cfg = ROLE_CFG[role];
  const { user } = useAuth();
  useDocumentTitle(cfg.plural);
  const perms = { register: role !== 'admin', del: user.role === 'admin' && role !== 'admin' };
  const s = useResources([cfg.resource, cfg.contacts, cfg.middle, 'pincode']);
  const confirm = useConfirm();
  const [run, busy] = useAction();
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [created, setCreated] = useState(null);

  const middle = useMemo(() => (s.loading || s.error ? new Map() : middleNameMap(s.d[cfg.middle], cfg.idField)), [s, cfg]);
  const g = gate(s);
  if (g) return g;

  const needle = q.trim().toLowerCase();
  const rows = s.d[cfg.resource].filter((p) => !needle || `${p.first_name} ${p.last_name || ''} ${p.email} ${p.aadhar_id || ''}`.toLowerCase().includes(needle));
  const phone = (p) => s.d[cfg.contacts].find((c) => c[cfg.idField] === p[cfg.idField])?.phone_no || '—';

  const del = async (p) => {
    const impact = await accountImpact(role, p[cfg.idField]);
    const ok = await confirm({
      title: `Delete ${p.first_name}'s account?`, danger: true, confirmLabel: 'Delete account',
      message: 'This permanently removes the account and cannot be undone.', items: impact,
    });
    if (!ok) return;
    const r = await run(() => deleteAccount(role, p[cfg.idField]), 'Account deleted');
    if (r.ok) s.reload();
  };

  return (
    <>
      <PageHeader
        title={cfg.plural}
        subtitle={perms.register ? `Register ${cfg.plural.toLowerCase()} here. Login details are shown after registration so you can email them.` : 'Admin accounts.'}
        actions={perms.register && <Button icon="userPlus" onClick={() => setOpen(true)}>Register {cfg.label.toLowerCase()}</Button>}
      />
      <Card flush title={`${cfg.plural} (${s.d[cfg.resource].length})`} actions={<SearchInput value={q} onChange={setQ} placeholder="Search name, email, Aadhar…" />}>
        <DataTable
          rows={rows}
          rowKey={(p) => p[cfg.idField]}
          empty={<EmptyState icon="users" title={q ? 'Nobody matches your search' : `No ${cfg.plural.toLowerCase()} yet`} />}
          columns={[
            { key: 'name', header: 'Name', sortValue: (p) => p.first_name, render: (p) => <PersonCell person={p} middle={middle.get(p[cfg.idField])} sub={p.email} /> },
            { key: 'phone', header: 'Phone', render: phone },
            { key: 'sex', header: 'Sex', render: (p) => p.sex || '—' },
            ...(cfg.hasSalary ? [{ key: 'salary', header: 'Salary', align: 'num', sortValue: (p) => Number(p.salary || 0), render: (p) => (p.salary != null ? money(p.salary) : '—') }] : []),
            ...(role === 'teacher' ? [{ key: 'joined', header: 'Joined', sortValue: (p) => p.joining_date, render: (p) => formatDate(p.joining_date) }] : []),
            {
              key: 'act', header: '', actions: true,
              render: (p) => (
                <>
                  <Button size="sm" variant="secondary" to={`/${user.role}/people/${role}/${p[cfg.idField]}`}>Open</Button>
                  {perms.del && <Button size="sm" variant="danger-outline" icon="trash" disabled={busy} onClick={() => del(p)} aria-label={`Delete ${p.first_name}`} />}
                </>
              ),
            },
          ]}
        />
      </Card>
      {perms.register && <PersonForm role={role} open={open} onClose={() => setOpen(false)} pincodes={s.d.pincode} onDone={(info) => { setOpen(false); setCreated(info); s.reload(); }} />}
      <CredentialsModal info={created} onClose={() => setCreated(null)} />
      {role === 'student' && <p className="muted small mt">Enroll students in a batch from <Link to={`/${user.role}/enrollments`}>Enrollments</Link>.</p>}
    </>
  );
}
