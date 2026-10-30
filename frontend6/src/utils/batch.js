import { DAYS } from './constants';
import { formatDate, hhmm, byKey, fullName } from './format';

/** Weekday name of today, matching Schedule.Day values (Monday … Sunday). */
export const todayName = () => DAYS[(new Date().getDay() + 6) % 7];

export const daysOf = (schedule, batchId) =>
  (schedule || []).filter((s) => s.Batch_id === batchId).map((s) => s.Day).sort((a, b) => DAYS.indexOf(a) - DAYS.indexOf(b));

export const shortDays = (days) => (days.length ? days.map((d) => d.slice(0, 3)).join(', ') : 'Days not set');

/** Human label for pickers: users never see ids. */
export const batchLabel = (batch, course) =>
  `${course?.Course_Name || 'Course'} · starts ${formatDate(batch.Start_date)}${batch.Start_time ? ` · ${hhmm(batch.Start_time)}` : ''}`;

export const batchSub = (batch, teacher, venueFallback = 'Venue not set') =>
  `${batch.Venue || venueFallback}${teacher ? ` · ${fullName(teacher)}` : ' · No teacher yet'}`;

export const batchOptions = (batches, courses, teachers = []) =>
  batches.map((b) => ({
    value: b.Batch_id,
    label: batchLabel(b, byKey(courses, 'Course_id', b.Course_id)),
    sub: batchSub(b, byKey(teachers, 'Teacher_id', b.Teacher_id)),
  }));

export const personOptions = (people, idField) =>
  people.map((p) => ({ value: p[idField], label: fullName(p), sub: p.Email }));

/** A course is "finished" when every module has been taught. */
export const isComplete = (batch, course) => !!course?.No_of_modules && (batch.Modules_Completed || 0) >= course.No_of_modules;

/** Latest modules-completed for display, never above the module count. */
export const modulesDone = (batch, course) => Math.min(batch.Modules_Completed || 0, course?.No_of_modules ?? Infinity);
