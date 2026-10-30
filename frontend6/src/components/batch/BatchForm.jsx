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
    Course_id: batch?.Course_id ?? '', Teacher_id: batch?.Teacher_id ?? '', Start_date: batch?.Start_date || today(),
    Start_time: (batch?.Start_time || '09:00').slice(0, 5), End_time: (batch?.End_time || '10:00').slice(0, 5), Venue: batch?.Venue || '',
  });
  const [days, setDays] = useState(batch ? daysOf(schedule, batch.Batch_id) : []);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    const clashes = findClashes({ batches, schedules: schedule, days, candidate: { Batch_id: batch?.Batch_id, Teacher_id: f.Teacher_id ? Number(f.Teacher_id) : null, Venue: f.Venue, Start_time: f.Start_time, End_time: f.End_time } });
    if (clashes.length) {
      const items = clashes.map((c) => `${c.reason === 'teacher' ? 'Same teacher' : 'Same venue'}: ${byKey(courses, 'Course_id', c.batch.Course_id)?.Course_Name} (${c.batch.Start_time?.slice(0, 5)}–${c.batch.End_time?.slice(0, 5)})`);
      if (!(await confirm({ title: 'Possible clash', message: 'Another batch overlaps this slot on a shared day.', items, confirmLabel: 'Save anyway' }))) return;
    }
    const r = await run(() => saveBatch(f, days, batch), batch ? 'Batch updated' : 'Batch created');
    if (r.ok) onDone(r.value);
  };

  return (
    <form className="stack" onSubmit={submit}>
      <div className="form-grid">
        <Field label="Course" required>
          <Combobox required options={courses.map((c) => ({ value: c.Course_id, label: c.Course_Name, sub: c.Category }))} value={f.Course_id} onChange={(v) => setF({ ...f, Course_id: v })} clearable={false} />
        </Field>
        <Field label="Teacher" hint="Optional. You can assign later.">
          <Combobox options={teachers.map((t) => ({ value: t.Teacher_id, label: fullName(t), sub: t.Email }))} value={f.Teacher_id} onChange={(v) => setF({ ...f, Teacher_id: v })} placeholder="No teacher yet" />
        </Field>
        <Field label="Start date"><input type="date" value={f.Start_date} onChange={set('Start_date')} /></Field>
        <Field label="Venue"><input placeholder="e.g. Room 101" value={f.Venue} onChange={set('Venue')} /></Field>
        <Field label="Start time"><input type="time" required value={f.Start_time} onChange={set('Start_time')} /></Field>
        <Field label="End time"><input type="time" required value={f.End_time} onChange={set('End_time')} /></Field>
      </div>
      <Field label="Class days"><ChipSelect label="Class days" options={DAYS} value={days} onChange={setDays} /></Field>
      <div className="form-actions">
        <Button type="submit" loading={busy}>{batch ? 'Save changes' : 'Create batch'}</Button>
        {onCancel && <Button variant="subtle" onClick={onCancel}>Cancel</Button>}
      </div>
    </form>
  );
}
