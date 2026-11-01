import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useResources } from '@/hooks/useResources';
import { useAction } from '@/hooks/useAction';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { updatePerson } from '@/api/services';
import { ROLE_CFG, ROLE_LABEL } from '@/utils/constants';
import { blankToNull, formatDate, fullName, middleNameMap, money } from '@/utils/format';
import { gate } from '@/components/ui/Async';
import PageHeader from '@/components/ui/PageHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Field from '@/components/ui/Field';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import ContactsManager from '@/components/people/ContactsManager';
import ChangePasswordModal from '@/components/people/ChangePasswordModal';
import PincodeFields from '@/components/people/PincodeFields';

/**
 * Own profile. Identity (name, Aadhar, date of birth, email, salary) is read-only; the person may change the address,
 * phone numbers and password. Staff correct identity details from the People pages.
 */
export default function Profile() {
  useDocumentTitle('Profile');
  const { user, refreshProfile } = useAuth();
  const cfg = ROLE_CFG[user.role];
  const p = user.profile;
  const s = useResources(['pincode', cfg.middle]);
  const [run, busy] = useAction();
  const [pw, setPw] = useState(false);
  const [f, setF] = useState({ house_no: p.house_no || '', street: p.street || '', pincode: p.pincode || '', city: '', state: '' });
  const patch = (x) => setF((v) => ({ ...v, ...x }));

  const g = gate(s);
  if (g) return g;
  const middle = middleNameMap(s.d[cfg.middle], cfg.idField).get(user.id) || [];

  const save = async (e) => {
    e.preventDefault();
    const r = await run(() => updatePerson(user.role, user.id, {
      house_no: blankToNull(f.house_no), street: blankToNull(f.street), pincode: blankToNull(f.pincode), _city: f.city, _state: f.state,
    }), 'Address saved');
    if (r.ok) { await refreshProfile(); s.reload(); patch({ city: '', state: '' }); }
  };

  const rows = [
    ['Name', fullName(p, middle)], ['Email', p.email], ['Sex', p.sex], ['Date of birth', p.dob && formatDate(p.dob)],
    ['Aadhar number', p.aadhar_id], ['Joined', p.joining_date && formatDate(p.joining_date)],
    ['Monthly salary', p.salary != null ? money(p.salary) : null],
  ].filter(([, v]) => v);

  return (
    <>
      <PageHeader title="Profile" subtitle="Your name, Aadhar and other identity details can only be changed by the institute office." />
      <div className="grid-2">
        <Card title="Your details">
          <div className="profile-id">
            <Avatar person={p} size={64} />
            <div>
              <strong className="profile-id__name">{fullName(p)}</strong>
              <div><Badge tone="brand">{ROLE_LABEL[user.role]}</Badge></div>
            </div>
          </div>
          <dl className="dl">{rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
        </Card>

        <div className="stack">
          <Card title="Address">
            <form className="stack" onSubmit={save}>
              <div className="form-grid">
                <Field label="House no."><input value={f.house_no} onChange={(e) => patch({ house_no: e.target.value })} /></Field>
                <Field label="Street"><input value={f.street} onChange={(e) => patch({ street: e.target.value })} /></Field>
                <PincodeFields values={f} onChange={patch} pincodes={s.d.pincode} />
              </div>
              <div className="form-actions"><Button type="submit" loading={busy}>Save address</Button></div>
            </form>
          </Card>

          <Card title="Phone numbers"><ContactsManager role={user.role} id={user.id} /></Card>

          <Card title="Password" subtitle="Choose something only you know.">
            <Button icon="key" variant="secondary" onClick={() => setPw(true)}>Change password</Button>
          </Card>
        </div>
      </div>
      <ChangePasswordModal open={pw} onClose={() => setPw(false)} />
    </>
  );
}
