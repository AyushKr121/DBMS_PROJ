import { DAYS } from './constants';
import { formatDate, hhmm, byKey, fullName } from './format';

/** Weekday name of today, matching Schedule.Day values (Monday … Sunday). */
export const todayName = () => DAYS[(new Date().getDay() + 6) % 7];

export const daysOf = (schedule, batchId) =>
  (schedule || []).filter((s) => s.batch_id === batchId).map((s) => s.day).sort((a, b) => DAYS.indexOf(a) - DAYS.indexOf(b));

export const shortDays = (days) => (days.length ? days.map((d) => d.slice(0, 3)).join(', ') : 'Days not set');

/** Human label for pickers: users never see ids. */
export const batchLabel = (batch, course) =>
  `${course?.course_Name || 'Course'} · starts ${formatDate(batch.start_date)}${batch.start_time ? ` · ${hhmm(batch.start_time)}` : ''}`;

export const batchSub = (batch, teacher, venueFallback = 'Venue not set') =>
  `${batch.venue || venueFallback}${teacher ? ` · ${fullName(teacher)}` : ' · No teacher yet'}`;

export const batchOptions = (batches, courses, teachers = []) =>
  batches.map((b) => ({
    value: b.batch_id,
    label: batchLabel(b, byKey(courses, 'course_id', b.course_id)),
    sub: batchSub(b, byKey(teachers, 'teacher_id', b.teacher_id)),
  }));

export const personOptions = (people, idField) =>
  people.map((p) => ({ value: p[idField], label: fullName(p), sub: p.email }));

/** A course is "finished" when every module has been taught. */
export const isComplete = (batch, course) => !!course?.no_of_modules && (batch.modules_Completed || 0) >= course.no_of_modules;

/** Latest modules-completed for display, never above the module count. */
export const modulesDone = (batch, course) => Math.min(batch.modules_Completed || 0, course?.no_of_modules ?? Infinity);
