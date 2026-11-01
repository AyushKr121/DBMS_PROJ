import { useState } from 'react';
import { useResources } from '@/hooks/useResources';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { RESOURCES } from '@/api/resources';
import { gate } from '@/components/ui/Async';
import PageHeader from '@/components/ui/PageHeader';
import Card from '@/components/ui/Card';
import { Tabs } from '@/components/ui/Tabs';
import DataTable from '@/components/ui/DataTable';
import SearchInput from '@/components/ui/SearchInput';
import EmptyState from '@/components/ui/EmptyState';

const GROUPS = [...new Set(Object.values(RESOURCES).map((r) => r.group))];

/** Read-only view of every table in the database. Passwords are never shown. */
export default function Explorer() {
  useDocumentTitle('All data');
  const [group, setGroup] = useState(GROUPS[0]);
  return (
    <>
      <PageHeader title="All data" subtitle="Every table, read-only. Edit records from their own pages." />
      <Tabs value={group} onChange={setGroup} label="Table groups" tabs={GROUPS.map((g) => ({ key: g, label: g }))} />
      <GroupTables key={group} group={group} />
    </>
  );
}

function GroupTables({ group }) {
  const names = Object.keys(RESOURCES).filter((k) => RESOURCES[k].group === group);
  const [name, setName] = useState(names[0]);
  const [q, setQ] = useState('');
  const s = useResources([name]);
  const g = gate(s);
  const rows = g ? [] : s.d[name];
  const cols = rows.length ? Object.keys(rows[0]) : [];
  const needle = q.trim().toLowerCase();
  const shown = rows.filter((r) => !needle || JSON.stringify(r).toLowerCase().includes(needle));
  return (
    <div className="stack mt">
      <div className="row-between">
        <select aria-label="Table" value={name} onChange={(e) => { setName(e.target.value); setQ(''); }}>{names.map((n) => <option key={n} value={n}>{RESOURCES[n].table}</option>)}</select>
        <SearchInput value={q} onChange={setQ} placeholder="Filter rows…" />
      </div>
      {g || (
        <Card flush title={`${RESOURCES[name].table} (${rows.length})`}>
          <DataTable stack={false} dense rows={shown} rowKey={(r) => JSON.stringify(RESOURCES[name].keys.map((k) => r[k]))} empty={<EmptyState icon="info" title="No rows" />}
            columns={cols.map((c) => ({ key: c, header: c, render: (r) => (r[c] == null ? '—' : String(r[c])) }))} />
        </Card>
      )}
    </div>
  );
}
