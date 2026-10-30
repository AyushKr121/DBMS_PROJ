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
  if (pins.some((p) => p.Pincode === code)) return code;
  if (blankToNull(city) && blankToNull(state)) {
    await api.save('pincode', { Pincode: code, City: city.trim(), State: state.trim() });
    return code;
  }
  return fail(`Pincode ${code} is not in the system. Enter its city and state to add it.`);
}

/** Create an account through /api/auth/signup, then add address, salary, phones and middle names. */
export async function registerPerson(role, f) {
  const cfg = ROLE_CFG[role];
  if (!cfg || role === 'admin') fail('Only students, teachers and assistants can be registered here.');
  const first = blankToNull(f.First_name);
  const email = blankToNull(f.Email);
  const credential = blankToNull(f.Credential);
  if (!first) fail('First name is required.');
  if (!email || !isEmail(email)) fail('Enter a valid email address.');
  if (!credential || credential.length < 4) fail('The initial password must be at least 4 characters.');

  const phones = (f.phones || []).map(normalizePhone).filter(Boolean);
  for (const p of phones) { if (!isPhone(p)) fail(`"${p}" is not a valid phone number.`); if (!isSafeKey(p)) fail(UNSAFE_KEY_MESSAGE); }
  if (new Set(phones).size !== phones.length) fail('The same phone number is listed twice.');
  const middles = (f.middle_names || []).map((m) => m.trim()).filter(Boolean);

  const existing = await api.list(cfg.resource);
  // /auth/login reads one row per email, so two accounts with one email would make that login fail.
  if (existing.some((r) => (r.Email || '').toLowerCase() === email.toLowerCase())) fail(`A ${cfg.label.toLowerCase()} with this email already exists.`);
  const aadhar = blankToNull(f.Aadhar_id);
  if (aadhar && existing.some((r) => r.Aadhar_id === aadhar)) fail('This Aadhar number is already registered.');
  if (f.Salary !== '' && f.Salary != null && !(Number(f.Salary) >= 0)) fail('Salary must be a positive number.');

  const pincode = await ensurePincode(f.Pincode, f.City, f.State);

  const created = await authApi.signup({
    role,
    // /api/auth/signup is a hand-written endpoint that reads these exact lower-case keys
    first_name: first,
    last_name: blankToNull(f.Last_name),
    email,
    credential,
    sex: blankToNull(f.Sex),
    dob: blankToNull(f.DOB),
    pincode,
    aadhar_id: aadhar,
  });
  const id = created.id;

  const house = blankToNull(f.House_no);
  const street = blankToNull(f.Street);
  const salary = cfg.hasSalary ? numOrNull(f.Salary) : null;
  if (house || street || salary != null) {
    const fresh = await api.get(cfg.resource, id);
    await api.update(cfg.resource, { ...fresh, House_no: house, Street: street, ...(salary != null ? { Salary: salary } : {}) });
  }
  for (const phone of phones) await api.save(cfg.contacts, { [cfg.idField]: id, Phone_no: phone });
  for (let i = 0; i < middles.length; i++) await api.save(cfg.middle, { Sequence_No: i + 1, [cfg.idField]: id, Middle_Name: middles[i] });
  return { id, email, credential, role };
}

/** Update fields of a person. Always starts from a fresh copy so no column (like the password) is lost. */
export async function updatePerson(role, id, patch) {
  const cfg = ROLE_CFG[role];
  const fresh = await api.get(cfg.resource, id);
  const next = { ...fresh, ...patch };
  if ('Pincode' in patch) next.Pincode = await ensurePincode(patch.Pincode, patch._city, patch._state);
  delete next._city; delete next._state;
  if ('DOB' in patch) next.Dob = patch.DOB; // some servers spell the property Dob; the unused one is ignored
  if (!blankToNull(next.First_name)) fail('First name is required.');
  if (!isEmail(next.Email)) fail('Enter a valid email address.');
  const others = await api.list(cfg.resource);
  if (others.some((r) => r[cfg.idField] !== id && (r.Email || '').toLowerCase() === String(next.Email).toLowerCase())) fail('Another account already uses this email.');
  if (next.Aadhar_id && others.some((r) => r[cfg.idField] !== id && r.Aadhar_id === next.Aadhar_id)) fail('This Aadhar number belongs to someone else.');
  return api.update(cfg.resource, next);
}

export async function changePassword(role, id, current, next) {
  const cfg = ROLE_CFG[role];
  if (!next || next.length < 4) fail('The new password must be at least 4 characters.');
  const fresh = await api.get(cfg.resource, id);
  if (fresh.Credential !== current) fail('Your current password is incorrect.');
  if (current === next) fail('Choose a password different from the current one.');
  return api.update(cfg.resource, { ...fresh, Credential: next });
}

/** Staff action: set a new password for someone who forgot theirs. */
export async function resetPassword(role, id, next) {
  const cfg = ROLE_CFG[role];
  if (!next || next.length < 4) fail('The password must be at least 4 characters.');
  const fresh = await api.get(cfg.resource, id);
  return api.update(cfg.resource, { ...fresh, Credential: next });
}

export async function addPhone(role, id, raw) {
  const cfg = ROLE_CFG[role];
  const phone = normalizePhone(raw);
  if (!isPhone(phone)) fail('Enter a valid phone number (7–15 digits, optional +).');
  if (!isSafeKey(phone)) fail(UNSAFE_KEY_MESSAGE);
  const rows = await api.list(cfg.contacts);
  if (rows.some((r) => r[cfg.idField] === id && r.Phone_no === phone)) fail('This number is already saved.');
  return api.save(cfg.contacts, { [cfg.idField]: id, Phone_no: phone });
}
export const removePhone = (role, id, phone) => api.remove(ROLE_CFG[role].contacts, [id, phone]);

export async function addMiddleName(role, id, raw) {
  const cfg = ROLE_CFG[role];
  const name = blankToNull(raw);
  if (!name) fail('Enter a middle name.');
  const seq = await nextId(cfg.middle, 'Sequence_No', (r) => r[cfg.idField] === id);
  return api.save(cfg.middle, { Sequence_No: seq, [cfg.idField]: id, Middle_Name: name });
}
export async function renameMiddleName(role, id, seq, raw) {
  const name = blankToNull(raw);
  if (!name) fail('Middle name cannot be empty.');
  return api.save(ROLE_CFG[role].middle, { Sequence_No: seq, [ROLE_CFG[role].idField]: id, Middle_Name: name });
}
export const removeMiddleName = (role, id, seq) => api.remove(ROLE_CFG[role].middle, [seq, id]);

/** What would also disappear when this account is deleted (shown in the confirmation). */
export async function accountImpact(role, id) {
  const impact = [];
  if (role === 'student') {
    const [enr, pay] = await Promise.all([api.list('enrollment'), api.list('feePayment')]);
    const e = enr.filter((x) => x.Student_id === id).length;
    const p = pay.filter((x) => x.Student_id === id).length;
    if (e) impact.push(`${e} enrollment(s) with their attendance and test scores`);
    if (p) impact.push(`${p} fee payment record(s)`);
  } else if (role === 'teacher') {
    const [b, s] = await Promise.all([api.list('batch'), api.list('teacherSalary')]);
    const nb = b.filter((x) => x.Teacher_id === id).length;
    const ns = s.filter((x) => x.Teacher_id === id).length;
    if (nb) impact.push(`${nb} batch(es) will be left without a teacher`);
    if (ns) impact.push(`${ns} salary record(s)`);
  } else if (role === 'assistant') {
    const [g, s] = await Promise.all([api.list('globalNotification'), api.list('assistantSalary')]);
    const ng = g.filter((x) => x.Assistant_id === id).length;
    const ns = s.filter((x) => x.Assistant_id === id).length;
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
export async function loadLastSeen(role, id, profile) {
  // Always answers a number or null (null = nothing seen yet). It never throws: a missing row, a null column,
  // a value stored as text or a failing request must not stop anyone from logging in.
  const toId = (v) => { const n = Number(v); return v == null || v === '' || !Number.isFinite(n) ? null : n; };
  try {
    if (role === 'assistant') {
      const rows = await api.list('assistantLastSeen');
      const mine = rows.find((r) => Number(r.Assistant_id) === Number(id));
      return toId(mine?.LastSeen_Global_Notification_id);
    }
    if (role === 'student' || role === 'teacher') return toId(profile?.LastSeen_Global_Notification_id);
  } catch (e) {
    console.error('[last seen] could not be loaded, treating everything as unseen', e);
  }
  return null; // admins read everything and keep no marker
}

export async function setLastSeen(role, id, notificationId) {
  // Callers catch and log failures; saving the marker is a convenience and must never block the page.
  if (role === 'assistant') return api.save('assistantLastSeen', { Assistant_id: id, LastSeen_Global_Notification_id: notificationId });
  if (role === 'student' || role === 'teacher') {
    const fresh = await api.get(role, id);
    return api.update(role, { ...fresh, LastSeen_Global_Notification_id: notificationId });
  }
  return null;
}

export async function publishGlobalNotification(assistantId, { title, description }) {
  const t = blankToNull(title);
  const d = blankToNull(description);
  if (!t || !d) fail('Both a title and a message are required.');
  const id = await nextId('globalNotification', 'Notification_id');
  return api.save('globalNotification', {
    Notification_id: id, Assistant_id: assistantId,
    Notification_date: today(), Notification_time: nowTime(),
    Notification_title: t, Description: d,
  });
}

/**
 * Batch notification. Enrollment.Batch_Notification_Status: null/false = the student has not read the latest
 * notice yet, true = read. Posting resets every enrolled student to false.
 */
export async function postBatchNotification(batchId, { title, description }) {
  const t = blankToNull(title);
  if (!t) fail('A title is required.');
  const id = await nextId('batchNotification', 'Notification_id', (n) => n.Batch_id === batchId);
  await api.save('batchNotification', { Notification_id: id, Batch_id: batchId, Title: t, Description: blankToNull(description) });
  const enrollments = (await api.list('enrollment')).filter((e) => e.Batch_id === batchId);
  for (const e of enrollments) await api.save('enrollment', { ...e, Batch_Notification_Status: false });
  return id;
}

export async function markBatchNoticesSeen(studentId, batchId) {
  const fresh = await api.get('enrollment', studentId, batchId);
  if (fresh.Batch_Notification_Status === true) return fresh;
  return api.save('enrollment', { ...fresh, Batch_Notification_Status: true });
}

/* -------------------------------------------------------------- complaints */

export async function fileComplaint(role, personId, { title, description }) {
  const cfg = ROLE_CFG[role];
  if (!cfg.complaints) fail('This account cannot file complaints.');
  const t = blankToNull(title);
  if (!t) fail('A title is required.');
  const id = await nextId(cfg.complaints, 'Complaint_id', (c) => c[cfg.idField] === personId);
  return api.save(cfg.complaints, {
    Complaint_id: id, [cfg.idField]: personId, [cfg.complaintTitle]: t,
    Complaint_description: blankToNull(description), Complaint_date: today(), Complaint_time: nowTime(),
  });
}

/* --------------------------------------------------------------- academics */

export async function saveCourse(form, existing) {
  const name = blankToNull(form.Course_Name);
  const cat = blankToNull(form.Category);
  if (!name || !cat) fail('Course name and category are required.');
  const price = numOrNull(form.Price);
  if (price != null && (price < 0 || price >= 100000000)) fail('Enter a valid price.');
  const body = {
    Course_Name: name, Category: cat, Description: blankToNull(form.Description), Price: price,
    No_of_modules: numOrNull(form.No_of_modules), No_of_weeks: numOrNull(form.No_of_weeks), Material: blankToNull(form.Material),
  };
  if (existing) return api.update('course', { ...existing, ...body });
  return api.save('course', { Course_id: await nextId('course', 'Course_id'), ...body });
}

export async function addCourseModule(courseId, { title, description }) {
  const t = blankToNull(title);
  if (!t) fail('Module title is required.');
  const id = await nextId('courseModule', 'Module_id', (m) => m.Course_id === courseId);
  await api.save('courseModule', { Module_id: id, Course_id: courseId, Module_title: t, Module_description: blankToNull(description) });
  // keep Course.No_of_modules at least as large as the real module count
  const [course, mods] = await Promise.all([api.get('course', courseId), api.list('courseModule')]);
  const count = mods.filter((m) => m.Course_id === courseId).length;
  if ((course.No_of_modules || 0) < count) await api.update('course', { ...course, No_of_modules: count });
  return id;
}

export async function deleteCourseImpact(courseId) {
  const [b, e] = await Promise.all([api.list('batch'), api.list('enrollment')]);
  const batches = b.filter((x) => x.Course_id === courseId);
  const ids = new Set(batches.map((x) => x.Batch_id));
  return { batches: batches.length, enrollments: e.filter((x) => ids.has(x.Batch_id)).length };
}

/** Teacher / venue clashes for a batch time-slot (used as a warning, not a hard block). */
export function findClashes({ batches, schedules, candidate, days }) {
  const toMin = (t) => { if (!t) return null; const [h, m] = t.split(':').map(Number); return h * 60 + (m || 0); };
  const s1 = toMin(candidate.Start_time); const e1 = toMin(candidate.End_time);
  if (s1 == null || e1 == null) return [];
  const out = [];
  for (const b of batches) {
    if (b.Batch_id === candidate.Batch_id) continue;
    const sameTeacher = candidate.Teacher_id && b.Teacher_id === candidate.Teacher_id;
    const sameVenue = candidate.Venue && b.Venue && b.Venue.trim().toLowerCase() === candidate.Venue.trim().toLowerCase();
    if (!sameTeacher && !sameVenue) continue;
    const s2 = toMin(b.Start_time); const e2 = toMin(b.End_time);
    if (s2 == null || e2 == null || !(s1 < e2 && s2 < e1)) continue;
    const otherDays = schedules.filter((s) => s.Batch_id === b.Batch_id).map((s) => s.Day);
    if (!days.some((d) => otherDays.includes(d))) continue;
    out.push({ batch: b, reason: sameTeacher ? 'teacher' : 'venue' });
  }
  return out;
}

export async function saveBatch(form, days, existing) {
  const courseId = Number(form.Course_id);
  if (!courseId) fail('Choose a course.');
  const start = toApiTime(form.Start_time);
  const end = toApiTime(form.End_time);
  if (start && end && end <= start) fail('The end time must be after the start time.');
  const body = {
    Course_id: courseId,
    Teacher_id: form.Teacher_id ? Number(form.Teacher_id) : null,
    Start_date: blankToNull(form.Start_date),
    Start_time: start, End_time: end,
    Venue: blankToNull(form.Venue),
    Modules_Completed: existing ? existing.Modules_Completed ?? 0 : 0,
  };
  let batchId;
  if (existing) { await api.update('batch', { ...existing, ...body }); batchId = existing.Batch_id; }
  else { batchId = await nextId('batch', 'Batch_id'); await api.save('batch', { Batch_id: batchId, ...body }); }
  await saveSchedule(batchId, days);
  return batchId;
}

/** Make the Schedule rows of a batch equal to `days` (adds new days, removes unticked ones). */
export async function saveSchedule(batchId, days) {
  const current = (await api.list('schedule')).filter((s) => s.Batch_id === batchId);
  const have = new Set(current.map((s) => s.Day));
  for (const d of days) if (!have.has(d)) await api.save('schedule', { Day: d, Batch_id: batchId });
  for (const s of current) if (!days.includes(s.Day)) await api.remove('schedule', s);
}

export async function setModulesCompleted(batch, value, max) {
  const v = Math.round(Number(value));
  if (!Number.isFinite(v) || v < 0) fail('Enter 0 or more completed modules.');
  if (max != null && v > max) fail(`This course only has ${max} module(s).`);
  const fresh = await api.get('batch', batch.Batch_id);
  return api.update('batch', { ...fresh, Modules_Completed: v });
}

export async function batchDeleteImpact(batchId) {
  const [e, t, a] = await Promise.all([api.list('enrollment'), api.list('test'), api.list('studentAttendance')]);
  return {
    enrollments: e.filter((x) => x.Batch_id === batchId).length,
    tests: t.filter((x) => x.Batch_id === batchId).length,
    attendance: a.filter((x) => x.Batch_id === batchId).length,
  };
}

export async function enrollStudent({ Student_id, Batch_id, discount }) {
  if (!Student_id || !Batch_id) fail('Choose a student and a batch.');
  const d = discount === '' || discount == null ? 0 : Number(discount);
  if (!(d >= 0 && d <= 100)) fail('Discount must be between 0 and 100.');
  const rows = await api.list('enrollment');
  if (rows.some((e) => e.Student_id === Number(Student_id) && e.Batch_id === Number(Batch_id))) fail('This student is already enrolled in that batch.');
  return api.save('enrollment', {
    Student_id: Number(Student_id), Batch_id: Number(Batch_id), Batch_Notification_Status: null,
    Enrollment_date: today(), Feedback: null, Certificate: null, Discount: d,
  });
}

/** Update fields of an enrollment (discount, certificate, feedback) from a fresh copy. */
export async function updateEnrollment(studentId, batchId, patch) {
  const fresh = await api.get('enrollment', studentId, batchId);
  if ('Discount' in patch) { const d = Number(patch.Discount); if (!(d >= 0 && d <= 100)) fail('Discount must be between 0 and 100.'); patch = { ...patch, Discount: d }; }
  if ('Certificate' in patch) {
    patch = { ...patch, Certificate: blankToNull(patch.Certificate) };
    if (patch.Certificate) {
      const all = await api.list('enrollment');
      if (all.some((e) => e.Certificate === patch.Certificate && !(e.Student_id === studentId && e.Batch_id === batchId))) fail('This certificate number is already used.');
    }
  }
  return api.save('enrollment', { ...fresh, ...patch });
}

/* ------------------------------------------------------------ tests/scores */

/** Create or edit a test. Uses POST (upsert); PUT would delete the test row and cascade-delete all scores. */
export async function saveTest(batchId, form, existing) {
  const title = blankToNull(form.Test_title);
  if (!title) fail('Test title is required.');
  const body = { Test_title: title, Date: blankToNull(form.Date), Question_paper_Link: blankToNull(form.Question_paper_Link), Answerkey_Link: blankToNull(form.Answerkey_Link) };
  for (const k of ['Question_paper_Link', 'Answerkey_Link']) if (body[k] && !/^https?:\/\//i.test(body[k])) fail('Links must start with http:// or https://');
  if (existing) return api.save('test', { ...existing, ...body });
  const id = await nextId('test', 'Test_id', (t) => t.Batch_id === batchId);
  return api.save('test', { Test_id: id, Batch_id: batchId, ...body });
}

export async function saveScores(batchId, testId, scores, existingRows) {
  for (const [sid, raw] of Object.entries(scores)) {
    const studentId = Number(sid);
    const had = existingRows.find((r) => r.Student_id === studentId && r.Batch_id === batchId && r.Test_id === testId);
    if (raw === '' || raw == null) { if (had) await api.remove('takes', had); continue; }
    const v = Number(raw);
    if (!Number.isFinite(v) || v < 0 || v >= 1000) fail('Scores must be between 0 and 999.99.');
    await api.save('takes', { Student_id: studentId, Batch_id: batchId, Test_id: testId, Score: Math.round(v * 100) / 100 });
  }
}

/* -------------------------------------------------------------- attendance */

export async function saveStudentAttendance(batchId, date, statusByStudent) {
  if (date > today()) fail('Attendance cannot be marked for a future date.');
  for (const [sid, status] of Object.entries(statusByStudent)) {
    await api.save('studentAttendance', { Date: date, Student_id: Number(sid), Batch_id: batchId, Status: Number(status) });
  }
}

export async function saveStaffAttendance(role, date, statusByPerson) {
  const cfg = ROLE_CFG[role];
  if (date > today()) fail('Attendance cannot be marked for a future date.');
  for (const [pid, status] of Object.entries(statusByPerson)) {
    await api.save(cfg.attendance, { Date: date, [cfg.idField]: Number(pid), Status: Number(status) });
  }
}

/* ----------------------------------------------------------------- finance */

function cleanNotes(notes) {
  const out = [...new Set((notes || []).map((n) => n.trim()).filter(Boolean))];
  for (const n of out) { if (!isSafeKey(n)) fail(UNSAFE_KEY_MESSAGE); if (n.length > 255) fail('A note is too long (max 255 characters).'); }
  return out;
}

export async function recordFee({ Student_id, Batch_id, amount, mode, notes }) {
  const amt = Number(amount);
  if (!(amt > 0) || amt >= 100000000) fail('Enter an amount greater than zero.');
  if (!blankToNull(mode)) fail('Choose how the money was paid.');
  const enrollments = await api.list('enrollment');
  if (!enrollments.some((e) => e.Student_id === Student_id && e.Batch_id === Batch_id)) fail('That student is not enrolled in this batch.');
  const list = cleanNotes(notes);
  const id = await nextId('feePayment', 'Receipt_id');
  await api.save('feePayment', {
    Receipt_id: id, Student_id, Batch_id, Amount: Math.round(amt * 100) / 100,
    Payment_date: today(), Payment_time: nowTime(), Mode_of_payment: mode,
  });
  for (const n of list) await api.save('feeDetails', { Receipt_id: id, Description: n });
  return id;
}

export async function addPaymentNote(kind, receiptId, text) {
  const [n] = cleanNotes([text]);
  if (!n) fail('Enter a note.');
  const res = kind === 'fee' ? 'feeDetails' : ROLE_CFG[kind].salaryDetails;
  return api.save(res, { Receipt_id: receiptId, Description: n });
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
  const id = await nextId(cfg.salary, 'Receipt_id');
  await api.save(cfg.salary, {
    Receipt_id: id, [cfg.idField]: person_id, Amount: Math.round(amt * 100) / 100,
    Salary_payment_date: today(), Month: m, Year: y,
  });
  for (const n of list) await api.save(cfg.salaryDetails, { Receipt_id: id, Description: n });
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