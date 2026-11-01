import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useResources } from '@/hooks/useResources';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { byKey } from '@/utils/format';
import { daysOf } from '@/utils/batch';
import { gate } from '@/components/ui/Async';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import EmptyState from '@/components/ui/EmptyState';
import SearchInput from '@/components/ui/SearchInput';
import BatchCard from '@/components/batch/BatchCard';
import BatchForm from '@/components/batch/BatchForm';

export default function Batches() {
  useDocumentTitle('Batches');
  const { user } = useAuth();
  const navigate = useNavigate();
  const s = useResources(['batch', 'course', 'teacher', 'schedule', 'enrollment']);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const g = gate(s);
  if (g) return g;
  const { d } = s;
  const needle = q.trim().toLowerCase();
  const rows = d.batch.filter((b) => !needle || `${byKey(d.course, 'course_id', b.course_id)?.course_Name} ${b.venue || ''} ${byKey(d.teacher, 'teacher_id', b.teacher_id)?.first_name || ''}`.toLowerCase().includes(needle));
  return (
    <>
      <PageHeader title="Batches" subtitle="Open a batch to manage its students, tests, attendance, fees and notices."
        actions={<><SearchInput value={q} onChange={setQ} placeholder="Search batches…" /><Button icon="plus" onClick={() => setOpen(true)}>New batch</Button></>} />
      {rows.length === 0 ? <EmptyState icon="layers" title="No batches" text="Create a batch by choosing an existing course and teacher." /> : (
        <div className="grid-3">
          {rows.map((b) => (
            <BatchCard key={b.batch_id} to={`/${user.role}/batches/${b.batch_id}`} batch={b} course={byKey(d.course, 'course_id', b.course_id)}
              teacher={byKey(d.teacher, 'teacher_id', b.teacher_id)} days={daysOf(d.schedule, b.batch_id)} students={d.enrollment.filter((e) => e.batch_id === b.batch_id).length} />
          ))}
        </div>
      )}
      <Modal open={open} onClose={() => setOpen(false)} title="New batch" size="lg">
        <BatchForm courses={d.course} teachers={d.teacher} batches={d.batch} schedule={d.schedule} onCancel={() => setOpen(false)}
          onDone={(id) => { setOpen(false); s.reload(); if (id) navigate(`/${user.role}/batches/${id}`); }} />
      </Modal>
    </>
  );
}
