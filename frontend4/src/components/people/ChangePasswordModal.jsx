import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useAction } from '@/hooks/useAction';
import { changePassword } from '@/api/services';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Field from '@/components/ui/Field';
import Alert from '@/components/ui/Alert';

export default function ChangePasswordModal({ open, onClose }) {
  const { user } = useAuth();
  const [run, busy] = useAction();
  const [f, setF] = useState({ current: '', next: '', again: '' });
  const [error, setError] = useState('');
  const set = (k) => (e) => setF((v) => ({ ...v, [k]: e.target.value }));

  const close = () => { setF({ current: '', next: '', again: '' }); setError(''); onClose(); };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (f.next !== f.again) { setError('The new passwords do not match.'); return; }
    const r = await run(() => changePassword(user.role, user.id, f.current, f.next), 'Password changed');
    if (r.ok) close();
  };

  return (
    <Modal
      open={open}
      onClose={close}
      title="Change password"
      size="sm"
      footer={(
        <>
          <Button variant="subtle" onClick={close}>Cancel</Button>
          <Button type="submit" form="change-pw-form" loading={busy}>Update password</Button>
        </>
      )}
    >
      <form id="change-pw-form" className="stack" onSubmit={submit}>
        <Field label="Current password" required><input type="password" autoComplete="current-password" required value={f.current} onChange={set('current')} /></Field>
        <Field label="New password" required hint="At least 4 characters"><input type="password" autoComplete="new-password" required minLength={4} value={f.next} onChange={set('next')} /></Field>
        <Field label="Confirm new password" required><input type="password" autoComplete="new-password" required value={f.again} onChange={set('again')} /></Field>
        {error && <Alert tone="danger">{error}</Alert>}
      </form>
    </Modal>
  );
}
