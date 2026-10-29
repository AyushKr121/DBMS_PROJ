import { useMemo, useState } from 'react';
import { useAction } from '@/hooks/useAction';
import { recordFee } from '@/api/services';
import { PAYMENT_MODES } from '@/utils/constants';
import { feeSummary, paymentsOf, FEE_STATUS } from '@/utils/fees';
import { batchOptions, personOptions } from '@/utils/batch';
import { byKey, money } from '@/utils/format';
import Button from '@/components/ui/Button';
import Combobox from '@/components/ui/Combobox';
import Field from '@/components/ui/Field';
import Icon from '@/components/ui/Icon';
import Badge from '@/components/ui/Badge';

/**
 * Records a fee payment that was collected at the desk. Pick the student, then one of THEIR batches;
 * the amount due is worked out from the course price, the enrollment's discount and earlier payments.
 * Pass presetStudent / presetBatch to lock those choices (used inside a batch or enrollment page).
 */
export default function FeeForm({ students, enrollments, batches, courses, teachers = [], payments, presetStudent, presetBatch, onDone }) {
  const [studentId, setStudentId] = useState(presetStudent ?? '');
  const [batchId, setBatchId] = useState(presetBatch ?? '');
  const [amount, setAmount] = useState('');
  const [mode, setMode] = useState(PAYMENT_MODES[0]);
  const [notes, setNotes] = useState(['']);
  const [run, busy] = useAction();

  const myBatches = useMemo(() => {
    const ids = new Set(enrollments.filter((e) => e.student_id === Number(studentId)).map((e) => e.batch_id));
    return batches.filter((b) => ids.has(b.batch_id));
  }, [enrollments, batches, studentId]);

  const enrollment = enrollments.find((e) => e.student_id === Number(studentId) && e.batch_id === Number(batchId));
  const batch = byKey(batches, 'batch_id', Number(batchId));
  const course = byKey(courses, 'course_id', batch?.course_id);
  const fee = enrollment ? feeSummary(course, enrollment, paymentsOf(payments, enrollment.student_id, enrollment.batch_id)) : null;

  const submit = async (e) => {
    e.preventDefault();
    const r = await run(() => recordFee({ student_id: Number(studentId), batch_id: Number(batchId), amount, mode, notes }), 'Fee entry recorded');
    if (r.ok) {
      setAmount(''); setNotes(['']);
      if (!presetStudent) { setStudentId(''); setBatchId(''); }
      onDone?.(r.value);
    }
  };

  return (
    <form className="stack" onSubmit={submit}>
      <div className="form-grid">
        {!presetStudent && (
          <Field label="Student" required>
            <Combobox required options={personOptions(students, 'student_id')} value={studentId} onChange={(v) => { setStudentId(v); setBatchId(''); }} placeholder="Type a name or pick" />
          </Field>
        )}
        {!presetBatch && (
          <Field label="Batch" required hint={studentId && myBatches.length === 0 ? 'This student is not enrolled in any batch.' : undefined}>
            <Combobox required options={batchOptions(myBatches, courses, teachers)} value={batchId} onChange={setBatchId} disabled={!studentId} placeholder={studentId ? 'Pick one of their batches' : 'Choose a student first'} />
          </Field>
        )}
        <Field label="Amount received (₹)" required>
          <input type="number" min="0.01" step="0.01" required value={amount} onChange={(e) => setAmount(e.target.value)} />
        </Field>
        <Field label="Paid by" required>
          <select value={mode} onChange={(e) => setMode(e.target.value)}>{PAYMENT_MODES.map((m) => <option key={m}>{m}</option>)}</select>
        </Field>
      </div>

      {fee && (
        <div className="fee-strip" aria-live="polite">
          <span>Payable <strong>{money(fee.payable)}</strong>{fee.discount ? ` (after ${fee.discount}% discount)` : ''}</span>
          <span>Paid so far <strong>{money(fee.paid)}</strong></span>
          <span>Remaining <strong>{money(fee.remaining)}</strong></span>
          <Badge tone={FEE_STATUS[fee.status].tone}>{FEE_STATUS[fee.status].label}</Badge>
          {fee.remaining > 0 && <Button size="sm" variant="ghost" onClick={() => setAmount(String(fee.remaining))}>Fill remaining</Button>}
        </div>
      )}

      <fieldset className="fieldset">
        <legend>Notes on this payment (optional)</legend>
        <div className="stack-sm">
          {notes.map((n, i) => (
            <div className="pill-input" key={i}>
              <input aria-label={`Note ${i + 1}`} placeholder="e.g. First installment, receipt book 12" value={n} onChange={(e) => setNotes(notes.map((x, j) => (j === i ? e.target.value : x)))} />
              {notes.length > 1 && <Button variant="ghost" size="sm" aria-label="Remove note" onClick={() => setNotes(notes.filter((_, j) => j !== i))}><Icon name="x" size={14} /></Button>}
            </div>
          ))}
          <Button variant="ghost" size="sm" icon="plus" onClick={() => setNotes([...notes, ''])}>Add another note</Button>
        </div>
      </fieldset>

      <div className="form-actions"><Button type="submit" icon="check" loading={busy}>Record payment</Button></div>
    </form>
  );
}
