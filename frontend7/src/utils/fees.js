import { round2 } from './format';

/**
 * Fee maths is done on the frontend (the backend only stores payments):
 * payable = course price - discount%, remaining = payable - sum(payments for that student+batch).
 */
export function feeSummary(course, enrollment, payments = []) {
  const price = Number(course?.price || 0);
  const discount = Number(enrollment?.discount || 0);
  const payable = round2(price * (1 - discount / 100));
  const paid = round2(payments.reduce((t, p) => t + Number(p.amount || 0), 0));
  const remaining = round2(Math.max(0, payable - paid));
  let status = 'partial';
  if (payable <= 0 || (remaining <= 0 && paid <= payable)) status = 'paid';
  else if (paid <= 0) status = 'unpaid';
  if (paid > payable && payable > 0) status = 'overpaid';
  return { price, discount, payable, paid, remaining, status };
}

export const FEE_STATUS = {
  paid: { label: 'Fully paid', tone: 'success' },
  partial: { label: 'Partly paid', tone: 'warning' },
  unpaid: { label: 'Not paid', tone: 'danger' },
  overpaid: { label: 'Overpaid', tone: 'info' },
};

/** Payments of one enrollment (student + batch). */
export const paymentsOf = (payments, studentId, batchId) =>
  (payments || []).filter((p) => p.student_id === studentId && p.batch_id === batchId);
