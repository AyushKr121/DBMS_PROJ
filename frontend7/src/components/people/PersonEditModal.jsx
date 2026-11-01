import { useEffect, useState } from 'react';
import { useAction } from '@/hooks/useAction';
import { updatePerson } from '@/api/services';
import { ROLE_CFG, SEX_OPTIONS } from '@/utils/constants';
import { blankToNull, numOrNull, today } from '@/utils/format';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Field from '@/components/ui/Field';
import PincodeFields from './PincodeFields';

const init = (p) => ({
  first_name: p.first_name || '', last_name: p.last_name || '', email: p.email || '', sex: p.sex || '', dob: p.dob || '',
  aadhar_id: p.aadhar_id || '', house_no: p.house_no || '', street: p.street || '', pincode: p.pincode || '', city: '', state: '',
  salary: p.salary ?? '',
});

/** Staff edit of a person's identity and address (users cannot change these themselves). */
export default function PersonEditModal({ role, person, open, onClose, onDone, pincodes }) {
  const cfg = ROLE_CFG[role];
  const [f, setF] = useState(() => init(person));
  const [run, busy] = useAction();
  useEffect(() => { if (open) setF(init(person)); }, [open, person]);
  const set = (k) => (e) => setF((v) => ({ ...v, [k]: e.target.value }));
  const patch = (p) => setF((v) => ({ ...v, ...p }));

  const submit = async (e) => {
    e.preventDefault();
    const body = {
      first_name: f.first_name.trim(), last_name: blankToNull(f.last_name), email: f.email.trim(), sex: blankToNull(f.sex), dob: blankToNull(f.dob),
      aadhar_id: blankToNull(f.aadhar_id), house_no: blankToNull(f.house_no), street: blankToNull(f.street), pincode: blankToNull(f.pincode), _city: f.city, _state: f.state,
      ...(cfg.hasSalary ? { salary: numOrNull(f.salary) } : {}),
    };
    const r = await run(() => updatePerson(role, person[cfg.idField], body), 'Details saved');
    if (r.ok) { onDone(); onClose(); }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={`Edit ${cfg.label.toLowerCase()} details`}
      footer={(
        <>
          <Button variant="subtle" onClick={onClose}>Cancel</Button>
          <Button type="submit" form="person-edit" loading={busy}>Save changes</Button>
        </>
      )}
    >
      <form id="person-edit" className="form-grid" onSubmit={submit}>
        <Field label="First name" required><input required value={f.first_name} onChange={set('first_name')} /></Field>
        <Field label="Last name"><input value={f.last_name} onChange={set('last_name')} /></Field>
        <Field label="Email" required><input type="email" required value={f.email} onChange={set('email')} /></Field>
        <Field label="Sex">
          <select value={f.sex} onChange={set('sex')}>
            <option value="">Not specified</option>
            {SEX_OPTIONS.map((x) => <option key={x}>{x}</option>)}
          </select>
        </Field>
        <Field label="Date of birth"><input type="date" max={today()} value={f.dob} onChange={set('dob')} /></Field>
        <Field label="Aadhar number"><input value={f.aadhar_id} onChange={set('aadhar_id')} /></Field>
        {cfg.hasSalary && <Field label="Monthly salary (₹)"><input type="number" min="0" step="0.01" value={f.salary} onChange={set('salary')} /></Field>}
        <Field label="House no."><input value={f.house_no} onChange={set('house_no')} /></Field>
        <Field label="Street"><input value={f.street} onChange={set('street')} /></Field>
        <PincodeFields values={f} onChange={patch} pincodes={pincodes} />
      </form>
    </Modal>
  );
}
