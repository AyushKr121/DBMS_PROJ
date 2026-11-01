/**
 * Business logic that needs several API calls. The backend is plain CRUD, so everything that
 * spans tables (next ids, multi-valued attributes, "seen" flags, cascade-safe deletes, fee maths)
 * lives here.
 */
import { api, authApi } from './index';
import { ROLE_CFG } from '@/utils/constants';
import { blankToNull, nowTime, numOrNull, today, toApiTime } from '@/utils/format';
import { isEmail, isPhone, isPincode, isSafeKey, normalizePhone, UNSAFE_KEY_MESSAGE } from '@/utils/validators';

const fail = (msg) => { throw new Error(msg); };

/** Highest existing value of `field` (optionally within a filter) + 1. Always reads fresh data. */
export async function nextId(resource, field, where = () => true) {
  const rows = await api.list(resource);
  return Math.max(0, ...rows.filter(where).map((r) => Number(r[field]) || 0)) + 1;
}

/* ------------------------------------------------------------------ people */

export async function ensurePincode(pin, city, state) {
  const code = blankToNull(pin);
  if (!code) return null;
  if (!isPincode(code)) fail('Pincode must be 6 digits.');
  const pins = await api.list('pincode');
  if (pins.some((p) => p.pincode === code)) return code;
  if (blankToNull(city) && blankToNull(state)) {
    await api.save('pincode', { pincode: code, city: city.trim(), state: state.trim() });
    return code;
  }
  return fail(`Pincode ${code} is not in the system. Enter its city and state to add it.`);
}

/** Create an account through /api/auth/signup, then add address, salary, phones and middle names. */
export async function registerPerson(role, f) {
  const cfg = ROLE_CFG[role];
  if (!cfg || role === 'admin') fail('Only students, teachers and assistants can be registered here.');
  const first = blankToNull(f.first_name);
  const email = blankToNull(f.email);
  const credential = blankToNull(f.credential);
  if (!first) fail('First name is required.');
  if (!email || !isEmail(email)) fail('Enter a valid email address.');
  if (!credential || credential.length < 4) fail('The initial password must be at least 4 characters.');

  const phones = (f.phones || []).map(normalizePhone).filter(Boolean);
  for (const p of phones) { if (!isPhone(p)) fail(`"${p}" is not a valid phone number.`); if (!isSafeKey(p)) fail(UNSAFE_KEY_MESSAGE); }
  if (new Set(phones).size !== phones.length) fail('The same phone number is listed twice.');
  const middles = (f.middle_names || []).map((m) => m.trim()).filter(Boolean);

  const existing = await api.list(cfg.resource);
  // /auth/login reads one row per email, so two accounts with one email would make that login fail.
  if (existing.some((r) => (r.email || '').toLowerCase() === email.toLowerCase())) fail(`A ${cfg.label.toLowerCase()} with this email already exists.`);
  const aadhar = blankToNull(f.aadhar_id);
  if (aadhar && existing.some((r) => r.aadhar_id === aadhar)) fail('This Aadhar number is already registered.');
  if (f.salary !== '' && f.salary != null && !(Number(f.salary) >= 0)) fail('Salary must be a positive number.');

  const pincode = await ensurePincode(f.pincode, f.city, f.state);

  const created = await authApi.signup({
    role,
    first_name: first,
    last_name: blankToNull(f.last_name),
    email,
    credential,
    sex: blankToNull(f.sex),
    dob: blankToNull(f.dob),
    pincode,
    aadhar_id: aadhar,
  });
  const id = created.id;

  const house = blankToNull(f.house_no);
  const street = blankToNull(f.street);
  const salary = cfg.hasSalary ? numOrNull(f.salary) : null;
  if (house || street || salary != null) {
    const fresh = await api.get(cfg.resource, id);
    await api.update(cfg.resource, { ...fresh, house_no: house, street, ...(salary != null ? { salary } : {}) });
  }
  for (const phone of phones) await api.save(cfg.contacts, { [cfg.idField]: id, phone_no: phone });
  for (let i = 0; i < middles.length; i++) await api.save(cfg.middle, { sequence_No: i + 1, [cfg.idField]: id, middle_Name: middles[i] });
  return { id, email, credential, role };
}

/** Update fields of a person. Always starts from a fresh copy so no column (like the password) is lost. */
export async function updatePerson(role, id, patch) {
  const cfg = ROLE_CFG[role];
  const fresh = await api.get(cfg.resource, id);
  const next = { ...fresh, ...patch };
  if ('pincode' in patch) next.pincode = await ensurePincode(patch.pincode, patch._city, patch._state);
  delete next._city; delete next._state;
  if (!blankToNull(next.first_name)) fail('First name is required.');
  if (!isEmail(next.email)) fail('Enter a valid email address.');
  const others = await api.list(cfg.resource);
  if (others.some((r) => r[cfg.idField] !== id && (r.email || '').toLowerCase() === String(next.email).toLowerCase())) fail('Another account already uses this email.');
  if (next.aadhar_id && others.some((r) => r[cfg.idField] !== id && r.aadhar_id === next.aadhar_id)) fail('This Aadhar number belongs to someone else.');
  return api.update(cfg.resource, next);
}

export async function changePassword(role, id, current, next) {
  const cfg = ROLE_CFG[role];
  if (!next || next.length < 4) fail('The new password must be at least 4 characters.');
  const fresh = await api.get(cfg.resource, id);
  if (fresh.credential !== current) fail('Your current password is incorrect.');
  if (current === next) fail('Choose a password different from the current one.');
  return api.update(cfg.resource, { ...fresh, credential: next });
}

/** Staff action: set a new password for someone who forgot theirs. */
export async function resetPassword(role, id, next) {
  const cfg = ROLE_CFG[role];
  if (!next || next.length < 4) fail('The password must be at least 4 characters.');
  const fresh = await api.get(cfg.resource, id);
  return api.update(cfg.resource, { ...fresh, credential: next });
}

export async function addPhone(role, id, raw) {
  const cfg = ROLE_CFG[role];
  const phone = normalizePhone(raw);
  if (!isPhone(phone)) fail('Enter a valid phone number (7–15 digits, optional +).');
  if (!isSafeKey(phone)) fail(UNSAFE_KEY_MESSAGE);
  const rows = await api.list(cfg.contacts);
  if (rows.some((r) => r[cfg.idField] === id && r.phone_no === phone)) fail('This number is already saved.');
  return api.save(cfg.contacts, { [cfg.idField]: id, phone_no: phone });
}
export const removePhone = (role, id, phone) => api.remove(ROLE_CFG[role].contacts, [id, phone]);

export async function addMiddleName(role, id, raw) {
  const cfg = ROLE_CFG[role];
  const name = blankToNull(raw);
  if (!name) fail('Enter a middle name.');
  const seq = await nextId(cfg.middle, 'sequence_No', (r) => r[cfg.idField] === id);
  return api.save(cfg.middle, { sequence_No: seq, [cfg.idField]: id, middle_Name: name });
}
export async function renameMiddleName(role, id, seq, raw) {
  const name = blankToNull(raw);
  if (!name) fail('Middle name cannot be empty.');
  return api.save(ROLE_CFG[role].middle, { sequence_No: seq, [ROLE_CFG[role].idField]: id, middle_Name: name });
}
export const removeMiddleName = (role, id, seq) => api.remove(ROLE_CFG[role].middle, [seq, id]);

/** What would also disappear when this account is deleted (shown in the confirmation). */
export async function accountImpact(role, id) {
  const impact = [];
  if (role === 'student') {
    const [enr, pay] = await Promise.all([api.list('enrollment'), api.list('feePayment')]);
    const e = enr.filter((x) => x.student_id === id).length;
    const p = pay.filter((x) => x.student_id === id).length;
    if (e) impact.push(`${e} enrollment(s) with their attendance and test scores`);
    if (p) impact.push(`${p} fee payment record(s)`);
  } else if (role === 'teacher') {
    const [b, s] = await Promise.all([api.list('batch'), api.list('teacherSalary')]);
    const nb = b.filter((x) => x.teacher_id === id).length;
    const ns = s.filter((x) => x.teacher_id === id).length;
    if (nb) impact.push(`${nb} batch(es) will be left without a teacher`);
    if (ns) impact.push(`${ns} salary record(s)`);
  } else if (role === 'assistant') {
    const [g, s] = await Promise.all([api.list('globalNotification'), api.list('assistantSalary')]);
    const ng = g.filter((x) => x.assistant_id === id).length;
    const ns = s.filter((x) => x.assistant_id === id).length;
    if (ng) impact.push(`${ng} global notification(s) they published (the database removes them with the account)`);
    if (ns) impact.push(`${ns} salary record(s)`);
  }
  return impact;
}

/** Delete an account, first clearing rows whose foreign key has no ON DELETE rule. */
export async function deleteAccount(role, id) {
  const cfg = ROLE_CFG[role];
  if (role === 'admin') fail('Admin accounts cannot be deleted here.');
  if (role === 'teacher') {
    const rows = await api.list(cfg.middle);
    await api.removeAll(cfg.middle, rows.filter((r) => r[cfg.idField] === id));
  }
  if (role === 'assistant') {
    const rows = await api.list(cfg.complaints);
    await api.removeAll(cfg.complaints, rows.filter((r) => r[cfg.idField] === id));
  }
  return api.remove(cfg.resource, [id]);
}

/* ---------------------------------------------------------- notifications */

/** Global notifications: "last seen" lives on Student/Teacher rows, or in Assistant_LastSeen_Notification. */
// export async function loadLastSeen(role, id, profile) {
//   if (role === 'assistant') {
//     const rows = await api.list('assistantLastSeen');
//     return rows.find((r) => r.assistant_id === id)?.lastSeen_Global_Notification_id ?? null;
//   }
//   if (role === 'student' || role === 'teacher') return profile?.lastSeen_Global_Notification_id ?? null;
//   return null; // admins read everything and keep no marker
// }


export async function loadLastSeen(role, id, profile) {
  if (role === 'assistant') {
    try {
      const rows = await api.list('assistantLastSeen');

      return rows.find((r) => r.assistant_id === id)
        ?.lastSeen_Global_Notification_id ?? null;
    } catch (error) {
      console.warn(
        'Ignoring error while loading assistant last-seen notification:',
        error
      );

      return null;
    }
  }

  if (role === 'student' || role === 'teacher') {
    return profile?.lastSeen_Global_Notification_id ?? null;
  }

  return null; // Admins read everything and keep no marker
}


export async function setLastSeen(role, id, notificationId) {
  if (role === 'assistant') return api.save('assistantLastSeen', { assistant_id: id, lastSeen_Global_Notification_id: notificationId });
  if (role === 'student' || role === 'teacher') {
    const fresh = await api.get(role, id);
    return api.update(role, { ...fresh, lastSeen_Global_Notification_id: notificationId });
  }
  return null;
}

export async function publishGlobalNotification(assistantId, { title, description }) {
  const t = blankToNull(title);
  const d = blankToNull(description);
  if (!t || !d) fail('Both a title and a message are required.');
  const id = await nextId('globalNotification', 'notification_id');
  return api.save('globalNotification', {
    notification_id: id, assistant_id: assistantId,
    notification_date: today(), notification_time: nowTime(),
    notification_title: t, description: d,
  });
}

/**
 * Batch notification. Enrollment.Batch_Notification_Status: null/false = the student has not read the latest
 * notice yet, true = read. Posting resets every enrolled student to false.
 */
export async function postBatchNotification(batchId, { title, description }) {
  const t = blankToNull(title);
  if (!t) fail('A title is required.');
  const id = await nextId('batchNotification', 'notification_id', (n) => n.batch_id === batchId);
  await api.save('batchNotification', { notification_id: id, batch_id: batchId, title: t, description: blankToNull(description) });
  const enrollments = (await api.list('enrollment')).filter((e) => e.batch_id === batchId);
  for (const e of enrollments) await api.save('enrollment', { ...e, batch_Notification_Status: false });
  return id;
}

export async function markBatchNoticesSeen(studentId, batchId) {
  const fresh = await api.get('enrollment', studentId, batchId);
  if (fresh.batch_Notification_Status === true) return fresh;
  return api.save('enrollment', { ...fresh, batch_Notification_Status: true });
}

/* -------------------------------------------------------------- complaints */

export async function fileComplaint(role, personId, { title, description }) {
  const cfg = ROLE_CFG[role];
  if (!cfg.complaints) fail('This account cannot file complaints.');
  const t = blankToNull(title);
  if (!t) fail('A title is required.');
  const id = await nextId(cfg.complaints, 'complaint_id', (c) => c[cfg.idField] === personId);
  return api.save(cfg.complaints, {
    complaint_id: id, [cfg.idField]: personId, [cfg.complaintTitle]: t,
    complaint_description: blankToNull(description), complaint_date: today(), complaint_time: nowTime(),
  });
}

/* --------------------------------------------------------------- academics */

export async function saveCourse(form, existing) {
  const name = blankToNull(form.course_Name);
  const cat = blankToNull(form.category);
  if (!name || !cat) fail('Course name and category are required.');
  const price = numOrNull(form.price);
  if (price != null && (price < 0 || price >= 100000000)) fail('Enter a valid price.');
  const body = {
    course_Name: name, category: cat, description: blankToNull(form.description), price,
    no_of_modules: numOrNull(form.no_of_modules), no_of_weeks: numOrNull(form.no_of_weeks), material: blankToNull(form.material),
  };
  if (existing) return api.update('course', { ...existing, ...body });
  return api.save('course', { course_id: await nextId('course', 'course_id'), ...body });
}

export async function addCourseModule(courseId, { title, description }) {
  const t = blankToNull(title);
  if (!t) fail('Module title is required.');
  const id = await nextId('courseModule', 'module_id', (m) => m.course_id === courseId);
  await api.save('courseModule', { module_id: id, course_id: courseId, module_title: t, module_description: blankToNull(description) });
  // keep Course.No_of_modules at least as large as the real module count
  const [course, mods] = await Promise.all([api.get('course', courseId), api.list('courseModule')]);
  const count = mods.filter((m) => m.course_id === courseId).length;
  if ((course.no_of_modules || 0) < count) await api.update('course', { ...course, no_of_modules: count });
  return id;
}

export async function deleteCourseImpact(courseId) {
  const [b, e] = await Promise.all([api.list('batch'), api.list('enrollment')]);
  const batches = b.filter((x) => x.course_id === courseId);
  const ids = new Set(batches.map((x) => x.batch_id));
  return { batches: batches.length, enrollments: e.filter((x) => ids.has(x.batch_id)).length };
}

/** Teacher / venue clashes for a batch time-slot (used as a warning, not a hard block). */
export function findClashes({ batches, schedules, candidate, days }) {
  const toMin = (t) => { if (!t) return null; const [h, m] = t.split(':').map(Number); return h * 60 + (m || 0); };
  const s1 = toMin(candidate.start_time); const e1 = toMin(candidate.end_time);
  if (s1 == null || e1 == null) return [];
  const out = [];
  for (const b of batches) {
    if (b.batch_id === candidate.batch_id) continue;
    const sameTeacher = candidate.teacher_id && b.teacher_id === candidate.teacher_id;
    const sameVenue = candidate.venue && b.venue && b.venue.trim().toLowerCase() === candidate.venue.trim().toLowerCase();
    if (!sameTeacher && !sameVenue) continue;
    const s2 = toMin(b.start_time); const e2 = toMin(b.end_time);
    if (s2 == null || e2 == null || !(s1 < e2 && s2 < e1)) continue;
    const otherDays = schedules.filter((s) => s.batch_id === b.batch_id).map((s) => s.day);
    if (!days.some((d) => otherDays.includes(d))) continue;
    out.push({ batch: b, reason: sameTeacher ? 'teacher' : 'venue' });
  }
  return out;
}

export async function saveBatch(form, days, existing) {
  const courseId = Number(form.course_id);
  if (!courseId) fail('Choose a course.');
  const start = toApiTime(form.start_time);
  const end = toApiTime(form.end_time);
  if (start && end && end <= start) fail('The end time must be after the start time.');
  const body = {
    course_id: courseId,
    teacher_id: form.teacher_id ? Number(form.teacher_id) : null,
    start_date: blankToNull(form.start_date),
    start_time: start, end_time: end,
    venue: blankToNull(form.venue),
    modules_Completed: existing ? existing.modules_Completed ?? 0 : 0,
  };
  let batchId;
  if (existing) { await api.update('batch', { ...existing, ...body }); batchId = existing.batch_id; }
  else { batchId = await nextId('batch', 'batch_id'); await api.save('batch', { batch_id: batchId, ...body }); }
  await saveSchedule(batchId, days);
  return batchId;
}

/** Make the Schedule rows of a batch equal to `days` (adds new days, removes unticked ones). */
export async function saveSchedule(batchId, days) {
  const current = (await api.list('schedule')).filter((s) => s.batch_id === batchId);
  const have = new Set(current.map((s) => s.day));
  for (const d of days) if (!have.has(d)) await api.save('schedule', { day: d, batch_id: batchId });
  for (const s of current) if (!days.includes(s.day)) await api.remove('schedule', s);
}

export async function setModulesCompleted(batch, value, max) {
  const v = Math.round(Number(value));
  if (!Number.isFinite(v) || v < 0) fail('Enter 0 or more completed modules.');
  if (max != null && v > max) fail(`This course only has ${max} module(s).`);
  const fresh = await api.get('batch', batch.batch_id);
  return api.update('batch', { ...fresh, modules_Completed: v });
}

export async function batchDeleteImpact(batchId) {
  const [e, t, a] = await Promise.all([api.list('enrollment'), api.list('test'), api.list('studentAttendance')]);
  return {
    enrollments: e.filter((x) => x.batch_id === batchId).length,
    tests: t.filter((x) => x.batch_id === batchId).length,
    attendance: a.filter((x) => x.batch_id === batchId).length,
  };
}

export async function enrollStudent({ student_id, batch_id, discount }) {
  if (!student_id || !batch_id) fail('Choose a student and a batch.');
  const d = discount === '' || discount == null ? 0 : Number(discount);
  if (!(d >= 0 && d <= 100)) fail('Discount must be between 0 and 100.');
  const rows = await api.list('enrollment');
  if (rows.some((e) => e.student_id === Number(student_id) && e.batch_id === Number(batch_id))) fail('This student is already enrolled in that batch.');
  return api.save('enrollment', {
    student_id: Number(student_id), batch_id: Number(batch_id), batch_Notification_Status: null,
    enrollment_date: today(), feedback: null, certificate: null, discount: d,
  });
}

/** Update fields of an enrollment (discount, certificate, feedback) from a fresh copy. */
export async function updateEnrollment(studentId, batchId, patch) {
  const fresh = await api.get('enrollment', studentId, batchId);
  if ('discount' in patch) { const d = Number(patch.discount); if (!(d >= 0 && d <= 100)) fail('Discount must be between 0 and 100.'); patch = { ...patch, discount: d }; }
  if ('certificate' in patch) {
    patch = { ...patch, certificate: blankToNull(patch.certificate) };
    if (patch.certificate) {
      const all = await api.list('enrollment');
      if (all.some((e) => e.certificate === patch.certificate && !(e.student_id === studentId && e.batch_id === batchId))) fail('This certificate number is already used.');
    }
  }
  return api.save('enrollment', { ...fresh, ...patch });
}

/* ------------------------------------------------------------ tests/scores */

/** Create or edit a test. Uses POST (upsert); PUT would delete the test row and cascade-delete all scores. */
export async function saveTest(batchId, form, existing) {
  const title = blankToNull(form.test_title);
  if (!title) fail('Test title is required.');
  const body = { test_title: title, date: blankToNull(form.date), question_paper_Link: blankToNull(form.question_paper_Link), answerkey_Link: blankToNull(form.answerkey_Link) };
  for (const k of ['question_paper_Link', 'answerkey_Link']) if (body[k] && !/^https?:\/\//i.test(body[k])) fail('Links must start with http:// or https://');
  if (existing) return api.save('test', { ...existing, ...body });
  const id = await nextId('test', 'test_id', (t) => t.batch_id === batchId);
  return api.save('test', { test_id: id, batch_id: batchId, ...body });
}

export async function saveScores(batchId, testId, scores, existingRows) {
  for (const [sid, raw] of Object.entries(scores)) {
    const studentId = Number(sid);
    const had = existingRows.find((r) => r.student_id === studentId && r.batch_id === batchId && r.test_id === testId);
    if (raw === '' || raw == null) { if (had) await api.remove('takes', had); continue; }
    const v = Number(raw);
    if (!Number.isFinite(v) || v < 0 || v >= 1000) fail('Scores must be between 0 and 999.99.');
    await api.save('takes', { student_id: studentId, batch_id: batchId, test_id: testId, score: Math.round(v * 100) / 100 });
  }
}

/* -------------------------------------------------------------- attendance */

export async function saveStudentAttendance(batchId, date, statusByStudent) {
  if (date > today()) fail('Attendance cannot be marked for a future date.');
  for (const [sid, status] of Object.entries(statusByStudent)) {
    await api.save('studentAttendance', { date, student_id: Number(sid), batch_id: batchId, status: Number(status) });
  }
}

export async function saveStaffAttendance(role, date, statusByPerson) {
  const cfg = ROLE_CFG[role];
  if (date > today()) fail('Attendance cannot be marked for a future date.');
  for (const [pid, status] of Object.entries(statusByPerson)) {
    await api.save(cfg.attendance, { date, [cfg.idField]: Number(pid), status: Number(status) });
  }
}

/* ----------------------------------------------------------------- finance */

function cleanNotes(notes) {
  const out = [...new Set((notes || []).map((n) => n.trim()).filter(Boolean))];
  for (const n of out) { if (!isSafeKey(n)) fail(UNSAFE_KEY_MESSAGE); if (n.length > 255) fail('A note is too long (max 255 characters).'); }
  return out;
}

export async function recordFee({ student_id, batch_id, amount, mode, notes }) {
  const amt = Number(amount);
  if (!(amt > 0) || amt >= 100000000) fail('Enter an amount greater than zero.');
  if (!blankToNull(mode)) fail('Choose how the money was paid.');
  const enrollments = await api.list('enrollment');
  if (!enrollments.some((e) => e.student_id === student_id && e.batch_id === batch_id)) fail('That student is not enrolled in this batch.');
  const list = cleanNotes(notes);
  const id = await nextId('feePayment', 'receipt_id');
  await api.save('feePayment', {
    receipt_id: id, student_id, batch_id, amount: Math.round(amt * 100) / 100,
    payment_date: today(), payment_time: nowTime(), mode_of_payment: mode,
  });
  for (const n of list) await api.save('feeDetails', { receipt_id: id, description: n });
  return id;
}

export async function addPaymentNote(kind, receiptId, text) {
  const [n] = cleanNotes([text]);
  if (!n) fail('Enter a note.');
  const res = kind === 'fee' ? 'feeDetails' : ROLE_CFG[kind].salaryDetails;
  return api.save(res, { receipt_id: receiptId, description: n });
}
export const removePaymentNote = (kind, receiptId, description) =>
  api.remove(kind === 'fee' ? 'feeDetails' : ROLE_CFG[kind].salaryDetails, [receiptId, description]);

export async function recordSalary(role, { person_id, month, year, amount, notes }) {
  const cfg = ROLE_CFG[role];
  const amt = Number(amount);
  if (!(amt > 0) || amt >= 100000000) fail('Enter an amount greater than zero.');
  const m = Number(month); const y = Number(year);
  if (!(m >= 1 && m <= 12)) fail('Choose a month.');
  if (!(y >= 2000 && y <= 2100)) fail('Enter a valid year.');
  const list = cleanNotes(notes);
  const id = await nextId(cfg.salary, 'receipt_id');
  await api.save(cfg.salary, {
    receipt_id: id, [cfg.idField]: person_id, amount: Math.round(amt * 100) / 100,
    salary_payment_date: today(), month: m, year: y,
  });
  for (const n of list) await api.save(cfg.salaryDetails, { receipt_id: id, description: n });
  return id;
}

/* --------------------------------------------------------------- certificate */

export function suggestCertificateNumber(existing = []) {
  const used = new Set(existing.filter(Boolean));
  const year = new Date().getFullYear();
  for (let i = 0; i < 50; i++) {
    const code = `CERT-${year}-${Math.floor(1000 + Math.random() * 9000)}`;
    if (!used.has(code)) return code;
  }
  return `CERT-${year}-${Date.now()}`;
}
