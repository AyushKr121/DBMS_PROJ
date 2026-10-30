import { useEffect, useState } from 'react';
import { useAction } from '@/hooks/useAction';
import { updatePerson } from '@/api/services';
import { ROLE_CFG, SEX_OPTIONS } from '@/utils/constants';
import { blankToNull, dobOf, numOrNull, today } from '@/utils/format';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Field from '@/components/ui/Field';
import PincodeFields from './PincodeFields';

const init = (p) => ({
  First_name: p.First_name || '', Last_name: p.Last_name || '', Email: p.Email || '', Sex: p.Sex || '', DOB: dobOf(p) || '',
  Aadhar_id: p.Aadhar_id || '', House_no: p.House_no || '', Street: p.Street || '', Pincode: p.Pincode || '', City: '', State: '',
  Salary: p.Salary ?? '',
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
      First_name: f.First_name.trim(), Last_name: blankToNull(f.Last_name), Email: f.Email.trim(), Sex: blankToNull(f.Sex), DOB: blankToNull(f.DOB),
      Aadhar_id: blankToNull(f.Aadhar_id), House_no: blankToNull(f.House_no), Street: blankToNull(f.Street), Pincode: blankToNull(f.Pincode), _city: f.City, _state: f.State,
      ...(cfg.hasSalary ? { Salary: numOrNull(f.Salary) } : {}),
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
        <Field label="First name" required><input required value={f.First_name} onChange={set('First_name')} /></Field>
        <Field label="Last name"><input value={f.Last_name} onChange={set('Last_name')} /></Field>
        <Field label="Email" required><input type="email" required value={f.Email} onChange={set('Email')} /></Field>
        <Field label="Sex">
          <select value={f.Sex} onChange={set('Sex')}>
            <option value="">Not specified</option>
            {SEX_OPTIONS.map((x) => <option key={x}>{x}</option>)}
          </select>
        </Field>
        <Field label="Date of birth"><input type="date" max={today()} value={f.DOB} onChange={set('DOB')} /></Field>
        <Field label="Aadhar number"><input value={f.Aadhar_id} onChange={set('Aadhar_id')} /></Field>
        {cfg.hasSalary && <Field label="Monthly salary (₹)"><input type="number" min="0" step="0.01" value={f.Salary} onChange={set('Salary')} /></Field>}
        <Field label="House no."><input value={f.House_no} onChange={set('House_no')} /></Field>
        <Field label="Street"><input value={f.Street} onChange={set('Street')} /></Field>
        <PincodeFields values={f} onChange={patch} pincodes={pincodes} />
      </form>
    </Modal>
  );
}
