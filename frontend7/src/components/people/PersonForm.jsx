import { useState } from 'react';
import { useAction } from '@/hooks/useAction';
import { registerPerson } from '@/api/services';
import { ROLE_CFG, SEX_OPTIONS } from '@/utils/constants';
import { randomPassword, today } from '@/utils/format';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Field from '@/components/ui/Field';
import Icon from '@/components/ui/Icon';
import PincodeFields from './PincodeFields';

const blank = () => ({
  first_name: '', last_name: '', email: '', sex: '', dob: '', aadhar_id: '', house_no: '', street: '',
  pincode: '', city: '', state: '', salary: '', credential: randomPassword(), phones: [''], middle_names: [],
});

/** Staff-only registration (the backend's /auth/signup) plus address, phones and middle names. */
export default function PersonForm({ role, open, onClose, onDone, pincodes }) {
  const cfg = ROLE_CFG[role];
  const [f, setF] = useState(blank);
  const [run, busy] = useAction();
  const set = (k) => (e) => setF((v) => ({ ...v, [k]: e.target.value }));
  const patch = (p) => setF((v) => ({ ...v, ...p }));

  const list = (key, i, val) => setF((v) => ({ ...v, [key]: v[key].map((x, j) => (j === i ? val : x)) }));
  const drop = (key, i) => setF((v) => ({ ...v, [key]: v[key].filter((_, j) => j !== i) }));
  const add = (key) => setF((v) => ({ ...v, [key]: [...v[key], ''] }));

  const close = () => { setF(blank()); onClose(); };

  const submit = async (e) => {
    e.preventDefault();
    const r = await run(() => registerPerson(role, f), `${cfg.label} registered`);
    if (r.ok) { onDone(r.value); setF(blank()); }
  };

  return (
    <Modal
      open={open}
      onClose={close}
      size="lg"
      title={`Register a new ${cfg.label.toLowerCase()}`}
      footer={(
        <>
          <Button variant="subtle" onClick={close}>Cancel</Button>
          <Button type="submit" form={`register-${role}`} icon="userPlus" loading={busy}>Register {cfg.label.toLowerCase()}</Button>
        </>
      )}
    >
      <form id={`register-${role}`} className="stack" onSubmit={submit}>
        <div className="form-grid">
          <Field label="First name" required><input required value={f.first_name} onChange={set('first_name')} /></Field>
          <Field label="Last name"><input value={f.last_name} onChange={set('last_name')} /></Field>
          <Field label="Email" required hint="Login details are sent here"><input type="email" required value={f.email} onChange={set('email')} /></Field>
          <Field label="Sex">
            <select value={f.sex} onChange={set('sex')}>
              <option value="">Not specified</option>
              {SEX_OPTIONS.map((x) => <option key={x}>{x}</option>)}
            </select>
          </Field>
          <Field label="Date of birth"><input type="date" max={today()} value={f.dob} onChange={set('dob')} /></Field>
          <Field label="Aadhar number"><input inputMode="numeric" value={f.aadhar_id} onChange={set('aadhar_id')} /></Field>
          {cfg.hasSalary && <Field label="Monthly salary (₹)"><input type="number" min="0" step="0.01" value={f.salary} onChange={set('salary')} /></Field>}
          <Field label="Initial password" required hint="The user can change it after logging in">
            <div className="pill-input">
              <input required minLength={4} value={f.credential} onChange={set('credential')} />
              <Button size="sm" variant="subtle" icon="refresh" onClick={() => patch({ credential: randomPassword() })} aria-label="Generate another password" />
            </div>
          </Field>
        </div>

        <fieldset className="fieldset">
          <legend>Address</legend>
          <div className="form-grid">
            <Field label="House no."><input value={f.house_no} onChange={set('house_no')} /></Field>
            <Field label="Street"><input value={f.street} onChange={set('street')} /></Field>
            <PincodeFields values={f} onChange={patch} pincodes={pincodes} />
          </div>
        </fieldset>

        <div className="form-grid">
          <fieldset className="fieldset">
            <legend>Phone numbers</legend>
            <div className="stack-sm">
              {f.phones.map((p, i) => (
                <div className="pill-input" key={i}>
                  <input type="tel" inputMode="tel" aria-label={`Phone number ${i + 1}`} placeholder="9876543210" value={p} onChange={(e) => list('phones', i, e.target.value)} />
                  {f.phones.length > 1 && <Button variant="ghost" size="sm" onClick={() => drop('phones', i)} aria-label="Remove phone"><Icon name="x" size={14} /></Button>}
                </div>
              ))}
              <Button variant="ghost" size="sm" icon="plus" onClick={() => add('phones')}>Add another number</Button>
            </div>
          </fieldset>
          <fieldset className="fieldset">
            <legend>Middle names</legend>
            <div className="stack-sm">
              {f.middle_names.map((p, i) => (
                <div className="pill-input" key={i}>
                  <input aria-label={`Middle name ${i + 1}`} value={p} onChange={(e) => list('middle_names', i, e.target.value)} />
                  <Button variant="ghost" size="sm" onClick={() => drop('middle_names', i)} aria-label="Remove middle name"><Icon name="x" size={14} /></Button>
                </div>
              ))}
              <Button variant="ghost" size="sm" icon="plus" onClick={() => add('middle_names')}>Add a middle name</Button>
            </div>
          </fieldset>
        </div>
      </form>
    </Modal>
  );
}
