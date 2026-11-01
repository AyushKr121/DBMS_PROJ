import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useResources } from '@/hooks/useResources';
import { useAction } from '@/hooks/useAction';
import { useConfirm } from '@/context/ConfirmContext';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { accountImpact, deleteAccount, resetPassword } from '@/api/services';
import { ROLE_CFG } from '@/utils/constants';
import { byKey, dobOf, formatDate, fullName, middleNameMap, money, randomPassword } from '@/utils/format';
import { summarizeAttendance } from '@/utils/attendance';
import { feeSummary, paymentsOf } from '@/utils/fees';
import { gate } from '@/components/ui/Async';
import PageHeader from '@/components/ui/PageHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import DataTable from '@/components/ui/DataTable';
import ContactsManager from '@/components/people/ContactsManager';
import MiddleNamesManager from '@/components/people/MiddleNamesManager';
import PersonEditModal from '@/components/people/PersonEditModal';
import CredentialsModal from '@/components/people/CredentialsModal';
import SalaryStatus from '@/components/finance/SalaryStatus';

/** Everything about one person, for the office: details, phones, middle names, and their records. */
export default function PersonDetail() {
  const { role, id } = useParams();
  const pid = Number(id);
  const cfg = ROLE_CFG[role];
  const { user } = useAuth();
  const navigate = useNavigate();
  const confirm = useConfirm();
  const [run, busy] = useAction();
  const [edit, setEdit] = useState(false);
  const [creds, setCreds] = useState(null);
  const s = useResources(cfg ? [cfg.resource, 'pincode', cfg.middle, 'batch', 'course', 'enrollment', 'studentAttendance', 'feePayment', cfg.attendance].filter(Boolean) : []);
  const person = s.d[cfg?.resource]?.find((p) => p[cfg.idField] === pid);
  useDocumentTitle(person ? fullName(person) : 'Person');

  if (!cfg) return <Alert tone="danger">Unknown account type.</Alert>;
  const g = gate(s);
  if (g) return g;
  const { d } = s;
  if (!person) return <Alert tone="danger">This account no longer exists.</Alert>;
  const middle = middleNameMap(d[cfg.middle], cfg.idField).get(pid) || [];
  const canDelete = user.role === 'admin' && role !== 'admin';
  const canEditIdentity = true;

  const reset = async () => {
    const pw = randomPassword();
    if (!(await confirm({ title: 'Reset password?', message: `${person.First_name} will need the new password to log in. It is shown once after the reset.`, confirmLabel: 'Reset password' }))) return;
    const r = await run(() => resetPassword(role, pid, pw), 'Password reset');
    if (r.ok) setCreds({ role, email: person.Email, credential: pw, reset: true });
  };
  const del = async () => {
    const impact = await accountImpact(role, pid);
    if (!(await confirm({ title: `Delete ${person.First_name}'s account?`, danger: true, confirmLabel: 'Delete account', message: 'This permanently removes the account.', items: impact }))) return;
    const r = await run(() => deleteAccount(role, pid), 'Account deleted');
    if (r.ok) navigate(`/${user.role}/${cfg.plural.toLowerCase()}`);
  };

  const myEnr = role === 'student' ? d.enrollment.filter((e) => e.Student_id === pid) : [];
  const taught = role === 'teacher' ? d.batch.filter((b) => b.Teacher_id === pid) : [];
  const attRows = cfg.attendance ? d[cfg.attendance].filter((a) => a[cfg.idField] === pid) : d.studentAttendance.filter((a) => a.Student_id === pid);
  const att = summarizeAttendance(attRows);

  return (
    <>
      <PageHeader title={fullName(person, middle)} back={{ to: `/${user.role}/${cfg.plural.toLowerCase()}`, label: cfg.plural }}
        actions={<><Button variant="secondary" icon="edit" onClick={() => setEdit(true)}>Edit details</Button><Button variant="subtle" icon="key" onClick={reset} loading={busy}>Reset password</Button>{canDelete && <Button variant="danger-outline" icon="trash" onClick={del}>Delete account</Button>}</>} />
      <div className="grid-2">
        <Card title="Details">
          <div className="profile-id"><Avatar person={person} size={56} /><Badge tone="brand">{cfg.label}</Badge></div>
          <dl className="dl">
            {[['Email', person.Email], ['Sex', person.Sex], ['Date of birth', dobOf(person) && formatDate(dobOf(person))], ['Aadhar', person.Aadhar_id], ['Joined', person.Joining_date && formatDate(person.Joining_date)],
              ['Salary', person.Salary != null && money(person.Salary)], ['Address', [person.House_no, person.Street, person.Pincode].filter(Boolean).join(', ')],
              ['Pincode area', byKey(d.pincode, 'Pincode', person.Pincode) && `${byKey(d.pincode, 'Pincode', person.Pincode).City}, ${byKey(d.pincode, 'Pincode', person.Pincode).State}`]]
              .filter(([, v]) => v).map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
          </dl>
        </Card>
        <div className="stack">
          <Card title="Phone numbers"><ContactsManager role={role} id={pid} canEdit={canEditIdentity} /></Card>
          <Card title="Middle names"><MiddleNamesManager role={role} id={pid} canEdit={canEditIdentity} /></Card>
        </div>
      </div>

      {att.total > 0 && <Alert tone="info" className="mt">Attendance: {att.present} present, {att.half} half day, {att.absent} absent ({att.percent}%).</Alert>}

      {role === 'student' && (
        <Card title="Enrollments" flush className="mt">
          <DataTable rows={myEnr} rowKey={(e) => e.Batch_id} empty={<p className="muted pad">Not enrolled in any batch.</p>} columns={[
            { key: 'c', header: 'Batch', render: (e) => { const b = byKey(d.batch, 'Batch_id', e.Batch_id); return <Link to={`/${user.role}/batches/${e.Batch_id}/students/${pid}`}>{byKey(d.course, 'Course_id', b?.Course_id)?.Course_Name}</Link>; } },
            { key: 'on', header: 'Enrolled', render: (e) => formatDate(e.Enrollment_date) },
            { key: 'fee', header: 'Fees due', align: 'num', render: (e) => { const b = byKey(d.batch, 'Batch_id', e.Batch_id); return money(feeSummary(byKey(d.course, 'Course_id', b?.Course_id), e, paymentsOf(d.feePayment, pid, e.Batch_id)).remaining); } },
            { key: 'cert', header: 'Certificate', render: (e) => e.Certificate || '—' },
          ]} />
        </Card>
      )}
      {role === 'teacher' && (
        <Card title="Batches taught" flush className="mt">
          <DataTable rows={taught} rowKey={(b) => b.Batch_id} empty={<p className="muted pad">No batches assigned.</p>} columns={[
            { key: 'c', header: 'Batch', render: (b) => <Link to={`/${user.role}/batches/${b.Batch_id}`}>{byKey(d.course, 'Course_id', b.Course_id)?.Course_Name}</Link> },
            { key: 'st', header: 'Starts', render: (b) => formatDate(b.Start_date) },
            { key: 'n', header: 'Students', align: 'num', render: (b) => d.enrollment.filter((e) => e.Batch_id === b.Batch_id).length },
          ]} />
        </Card>
      )}
      {cfg.hasSalary && <Card title="Salary history" className="mt"><SalaryStatus role={role} id={pid} /></Card>}

      <PersonEditModal role={role} person={person} open={edit} onClose={() => setEdit(false)} pincodes={d.pincode} onDone={s.reload} />
      <CredentialsModal info={creds} onClose={() => setCreds(null)} />
    </>
  );
}
