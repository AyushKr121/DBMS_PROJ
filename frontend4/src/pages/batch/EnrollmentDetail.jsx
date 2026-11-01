import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useResources } from '@/hooks/useResources';
import { useAction } from '@/hooks/useAction';
import { useConfirm } from '@/context/ConfirmContext';
import { api } from '@/api';
import { suggestCertificateNumber, updateEnrollment } from '@/api/services';
import { formatDate, formatDateTime, money } from '@/utils/format';
import { summarizeAttendance, attendanceTone } from '@/utils/attendance';
import { feeSummary, paymentsOf, FEE_STATUS } from '@/utils/fees';
import { isComplete } from '@/utils/batch';
import { gate } from '@/components/ui/Async';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Field from '@/components/ui/Field';
import Modal from '@/components/ui/Modal';
import Alert from '@/components/ui/Alert';
import StatCard from '@/components/ui/StatCard';
import DataTable from '@/components/ui/DataTable';
import PersonCell from '@/components/people/PersonCell';
import FeeForm from '@/components/finance/FeeForm';
import { useBatch } from './BatchLayout';

/** One student's enrollment in this batch: attendance, scores, fees and certificate, all for this batch only. */
export default function EnrollmentDetail() {
  const { studentId } = useParams();
  const sid = Number(studentId);
  const { role, perms, bid, batch, course, students, courses, teachers, allBatches, reload } = useBatch();
  const navigate = useNavigate();
  const confirm = useConfirm();
  const s = useResources(['studentAttendance', 'takes', 'test', ...(perms.staff ? ['feePayment', 'feeDetails', 'enrollment'] : [])]);
  const [run, busy] = useAction();
  const [pay, setPay] = useState(false);
  const entry = students.find((x) => x.e.student_id === sid);
  const [cert, setCert] = useState(entry?.e.certificate || '');
  const [discount, setDiscount] = useState(entry?.e.discount ?? 0);

  const g = gate(s);
  if (g) return g;
  if (!entry) return <Alert tone="danger">This student is not enrolled in this batch.</Alert>;
  const { e, s: student } = entry;

  const att = summarizeAttendance(s.d.studentAttendance.filter((a) => a.batch_id === bid && a.student_id === sid));
  const myAtt = s.d.studentAttendance.filter((a) => a.batch_id === bid && a.student_id === sid).sort((a, b) => b.date.localeCompare(a.date));
  const tests = s.d.test.filter((t) => t.batch_id === bid).sort((a, b) => a.test_id - b.test_id);
  const scoreOf = (tid) => s.d.takes.find((t) => t.student_id === sid && t.batch_id === bid && t.test_id === tid)?.score;
  const pays = perms.staff ? paymentsOf(s.d.feePayment, sid, bid) : [];
  const fee = perms.staff ? feeSummary(course, e, pays) : null;

  const saveEnrollment = async (patch, msg) => {
    const r = await run(() => updateEnrollment(sid, bid, patch), msg);
    if (r.ok) reload();
  };
  const unenroll = async () => {
    const ok = await confirm({
      title: 'Remove this enrollment?', danger: true, confirmLabel: 'Remove enrollment',
      message: 'The student leaves this batch. Their attendance and test scores in this batch are deleted with it. Fee payments stay on record.',
    });
    if (!ok) return;
    const r = await run(() => api.remove('enrollment', [sid, bid]), 'Enrollment removed');
    if (r.ok) { reload(); navigate(`/${role}/batches/${bid}/students`); }
  };

  const scored = tests.map((t) => Number(scoreOf(t.test_id))).filter((v) => Number.isFinite(v));

  return (
    <div className="stack">
      <Card>
        <div className="spread">
          <PersonCell person={student} size={52} sub={`Enrolled on ${formatDate(e.enrollment_date)} · ${Number(e.discount || 0)}% discount`} />
          {perms.staff && <Button variant="danger-outline" size="sm" icon="trash" onClick={unenroll}>Remove enrollment</Button>}
        </div>
      </Card>

      <div className="grid-4">
        <StatCard icon="check" tone="success" label="Attendance" value={att.total ? `${att.percent}%` : '—'} hint={`${att.present} of ${att.total} classes`} />
        <StatCard icon="clipboard" tone="warning" label="Tests taken" value={`${scored.length} / ${tests.length}`} />
        <StatCard icon="trending" label="Average score" value={scored.length ? (scored.reduce((a, b) => a + b, 0) / scored.length).toFixed(1) : '—'} />
        {perms.staff && <StatCard icon="card" tone={fee.remaining > 0 ? 'warning' : 'success'} label="Fees remaining" value={money(fee.remaining)} hint={FEE_STATUS[fee.status].label} />}
      </div>

      <div className="grid-2">
        <Card title="Test scores" flush>
          <DataTable
            pageSize={8}
            rows={tests}
            rowKey={(t) => t.test_id}
            empty={<p className="muted pad">No tests in this batch yet.</p>}
            columns={[
              { key: 'title', header: 'Test', render: (t) => t.test_title },
              { key: 'date', header: 'Date', render: (t) => formatDate(t.date) },
              { key: 'score', header: 'Score', align: 'num', render: (t) => scoreOf(t.test_id) ?? <span className="muted">Not graded</span> },
            ]}
          />
        </Card>
        <Card title="Attendance" flush>
          <DataTable
            pageSize={8}
            rows={myAtt}
            rowKey={(a) => a.date}
            empty={<p className="muted pad">No attendance marked for this student.</p>}
            columns={[
              { key: 'date', header: 'Date', render: (a) => formatDate(a.date) },
              { key: 'status', header: 'Status', render: (a) => (Number(a.status) === 1 ? <Badge tone="success">Present</Badge> : <Badge tone="danger">Absent</Badge>) },
            ]}
          />
          {att.total > 0 && <p className="small muted pad-x">Overall: <Badge tone={attendanceTone(att.percent)}>{att.percent}%</Badge></p>}
        </Card>
      </div>

      {perms.staff && (
        <>
          <div className="grid-2">
            <Card title="Certificate" subtitle={isComplete(batch, course) ? 'The course is complete. This student can be certified.' : 'The course is still running.'}>
              <div className="stack-sm">
                <Field label="Certificate number or link" hint="Leave empty to withdraw the certificate">
                  <input value={cert} onChange={(ev) => setCert(ev.target.value)} placeholder="CERT-2026-0001" />
                </Field>
                <div className="row">
                  <Button onClick={() => saveEnrollment({ certificate: cert }, cert ? 'Certificate saved' : 'Certificate withdrawn')} loading={busy}>Save certificate</Button>
                  <Button variant="subtle" onClick={async () => setCert(suggestCertificateNumber((await api.list('enrollment')).map((x) => x.certificate)))}>Suggest a number</Button>
                </div>
              </div>
            </Card>
            <Card title="Discount" subtitle="Applied to the course fee for this batch only.">
              <div className="row-end">
                <Field label="Discount (%)"><input type="number" min="0" max="100" step="0.01" value={discount} onChange={(ev) => setDiscount(ev.target.value)} /></Field>
                <Button onClick={() => saveEnrollment({ discount }, 'Discount saved')} loading={busy}>Save discount</Button>
              </div>
            </Card>
          </div>

          <Card title="Fee payments" subtitle={`Payable ${money(fee.payable)} · paid ${money(fee.paid)} · remaining ${money(fee.remaining)}`} flush actions={<Button size="sm" icon="plus" onClick={() => setPay(true)}>Record payment</Button>}>
            <DataTable
              rows={[...pays].sort((a, b) => b.receipt_id - a.receipt_id)}
              rowKey={(p) => p.receipt_id}
              empty={<p className="muted pad">No payments recorded for this batch.</p>}
              columns={[
                { key: 'receipt_id', header: 'Reference no.', render: (p) => <strong>#{p.receipt_id}</strong> },
                { key: 'when', header: 'Paid on', render: (p) => formatDateTime(p.payment_date, p.payment_time) },
                { key: 'amount', header: 'Amount', align: 'num', render: (p) => money(p.amount) },
                { key: 'mode', header: 'Mode', render: (p) => p.mode_of_payment },
                { key: 'notes', header: 'Notes', render: (p) => s.d.feeDetails.filter((x) => x.receipt_id === p.receipt_id).map((x) => x.description).join('; ') || '—' },
              ]}
            />
          </Card>
          <Modal open={pay} onClose={() => setPay(false)} title={`Record payment · ${student.first_name}`} size="md">
            <FeeForm
              students={[student]} enrollments={s.d.enrollment} batches={allBatches} courses={courses} teachers={teachers} payments={s.d.feePayment}
              presetStudent={sid} presetBatch={bid}
              onDone={() => { setPay(false); s.reload(); }}
            />
          </Modal>
        </>
      )}

      {e.feedback && <Card title="Student feedback"><p>{e.feedback}</p></Card>}
    </div>
  );
}
