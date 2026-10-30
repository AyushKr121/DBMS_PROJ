import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { ROLES, ROLE_LABEL } from '@/utils/constants';
import Button from '@/components/ui/Button';
import Field from '@/components/ui/Field';
import Alert from '@/components/ui/Alert';
import Icon from '@/components/ui/Icon';
import { Tabs } from '@/components/ui/Tabs';

export default function Login() {
  useDocumentTitle('Log in');
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const loc = useLocation();
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to={`/${user.role}`} replace />;

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const r = await login(role, email.trim(), password);
      const from = loc.state?.from;
      navigate(from && from.startsWith(`/${r}`) ? from : `/${r}`, { replace: true });
    } catch (err) {
      setError(err.message || 'Could not log in.');
    }
    setBusy(false);
  };

  return (
    <div className="login">
      <div className="login__card">
        <h1>Log in</h1>
        <p className="muted">Choose your account type, then enter the email and password you received.</p>
        <Tabs label="Account type" value={role} onChange={(r) => { setRole(r); setError(''); }} tabs={ROLES.map((r) => ({ key: r, label: ROLE_LABEL[r] }))} />
        <form className="stack" onSubmit={submit}>
          <Field label="Email" required>
            <input type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </Field>
          <Field label="Password" required>
            <div className="password-field">
              <input type={show ? 'text' : 'password'} autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
              <button type="button" className="password-field__toggle" onClick={() => setShow(!show)} aria-label={show ? 'Hide password' : 'Show password'}>
                <Icon name={show ? 'eyeOff' : 'eye'} size={18} />
              </button>
            </div>
          </Field>
          {error && <Alert tone="danger">{error}</Alert>}
          <Button type="submit" loading={busy} className="btn--block">Log in as {ROLE_LABEL[role].toLowerCase()}</Button>
        </form>
        <p className="muted small login__note">
          There is no sign-up form. An assistant at the institute creates your account and emails you the login details.
          If you have lost your password, ask the front desk to reset it.
        </p>
      </div>
    </div>
  );
}
