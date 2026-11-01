import { useState } from 'react';
import { useAction } from '@/hooks/useAction';
import { useConfirm } from '@/context/ConfirmContext';
import { findClashes, saveBatch } from '@/api/services';
import { DAYS } from '@/utils/constants';
import { byKey, fullName, today } from '@/utils/format';
import { daysOf } from '@/utils/batch';
import Button from '@/components/ui/Button';
import Combobox from '@/components/ui/Combobox';
import ChipSelect from '@/components/ui/ChipSelect';
import Field from '@/components/ui/Field';

/** Create or edit a batch by picking a course and a teacher by name. Warns about teacher/venue clashes. */
export default function BatchForm({ courses, teachers, batches, schedule, batch, onDone, onCancel }) {
  const confirm = useConfirm();
  const [run, busy] = useAction();
  const [f, setF] = useState({
    course_id: batch?.course_id ?? '', teacher_id: batch?.teacher_id ?? '', start_date: batch?.start_date || today(),
    start_time: (batch?.start_time || '09:00').slice(0, 5), end_time: (batch?.end_time || '10:00').slice(0, 5), venue: batch?.venue || '',
  });
  const [days, setDays] = useState(batch ? daysOf(schedule, batch.batch_id) : []);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    const clashes = findClashes({ batches, schedules: schedule, days, candidate: { batch_id: batch?.batch_id, teacher_id: f.teacher_id ? Number(f.teacher_id) : null, venue: f.venue, start_time: f.start_time, end_time: f.end_time } });
    if (clashes.length) {
      const items = clashes.map((c) => `${c.reason === 'teacher' ? 'Same teacher' : 'Same venue'}: ${byKey(courses, 'course_id', c.batch.course_id)?.course_Name} (${c.batch.start_time?.slice(0, 5)}–${c.batch.end_time?.slice(0, 5)})`);
      if (!(await confirm({ title: 'Possible clash', message: 'Another batch overlaps this slot on a shared day.', items, confirmLabel: 'Save anyway' }))) return;
    }
    const r = await run(() => saveBatch(f, days, batch), batch ? 'Batch updated' : 'Batch created');
    if (r.ok) onDone(r.value);
  };

  return (
    <form className="stack" onSubmit={submit}>
      <div className="form-grid">
        <Field label="Course" required>
          <Combobox required options={courses.map((c) => ({ value: c.course_id, label: c.course_Name, sub: c.category }))} value={f.course_id} onChange={(v) => setF({ ...f, course_id: v })} clearable={false} />
        </Field>
        <Field label="Teacher" hint="Optional. You can assign later.">
          <Combobox options={teachers.map((t) => ({ value: t.teacher_id, label: fullName(t), sub: t.email }))} value={f.teacher_id} onChange={(v) => setF({ ...f, teacher_id: v })} placeholder="No teacher yet" />
        </Field>
        <Field label="Start date"><input type="date" value={f.start_date} onChange={set('start_date')} /></Field>
        <Field label="Venue"><input placeholder="e.g. Room 101" value={f.venue} onChange={set('venue')} /></Field>
        <Field label="Start time"><input type="time" required value={f.start_time} onChange={set('start_time')} /></Field>
        <Field label="End time"><input type="time" required value={f.end_time} onChange={set('end_time')} /></Field>
      </div>
      <Field label="Class days"><ChipSelect label="Class days" options={DAYS} value={days} onChange={setDays} /></Field>
      <div className="form-actions">
        <Button type="submit" loading={busy}>{batch ? 'Save changes' : 'Create batch'}</Button>
        {onCancel && <Button variant="subtle" onClick={onCancel}>Cancel</Button>}
      </div>
    </form>
  );
}
