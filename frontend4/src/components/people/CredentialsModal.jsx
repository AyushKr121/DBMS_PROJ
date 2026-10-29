import { useToast } from '@/context/ToastContext';
import { INSTITUTE, ROLE_LABEL } from '@/utils/constants';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';

/**
 * The backend does not send email by itself, so after registering (or resetting) an account the login
 * details are shown once here. "Compose email" opens the staff member's mail app with the message filled in.
 */
export default function CredentialsModal({ info, onClose }) {
  const toast = useToast();
  if (!info) return null;

  const body = `Hello,\n\nYour ${INSTITUTE.name} ${ROLE_LABEL[info.role].toLowerCase()} account is ready.\n\nEmail: ${info.email}\nPassword: ${info.credential}\n\nPlease log in and change your password from the Profile page.\n\n${INSTITUTE.name}`;
  const mailto = `mailto:${encodeURIComponent(info.email)}?subject=${encodeURIComponent(`Your ${INSTITUTE.name} login details`)}&body=${encodeURIComponent(body)}`;

  const copy = async () => {
    try { await navigator.clipboard.writeText(`Email: ${info.email}\nPassword: ${info.credential}`); toast.success('Login details copied'); }
    catch { toast.error('Could not copy. Select the text and copy it manually.'); }
  };

  return (
    <Modal
      open
      onClose={onClose}
      size="sm"
      title={info.reset ? 'Password reset' : 'Account created'}
      footer={(
        <>
          <Button variant="subtle" icon="copy" onClick={copy}>Copy</Button>
          <a className="btn btn--secondary" href={mailto}>Compose email</a>
          <Button onClick={onClose}>Done</Button>
        </>
      )}
    >
      <Alert tone="warning">Share these details with the user. The password is not shown again.</Alert>
      <dl className="dl credentials">
        <div><dt>Account type</dt><dd>{ROLE_LABEL[info.role]}</dd></div>
        <div><dt>Email</dt><dd>{info.email}</dd></div>
        <div><dt>Password</dt><dd className="mono">{info.credential}</dd></div>
      </dl>
    </Modal>
  );
}
