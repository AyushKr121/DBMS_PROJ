/** Summary of attendance rows. status: 1 present, 0.5 half day (staff only), 0 absent. */
export function summarizeAttendance(rows = []) {
  const total = rows.length;
  const present = rows.filter((r) => Number(r.status) === 1).length;
  const half = rows.filter((r) => Number(r.status) === 0.5).length;
  const absent = rows.filter((r) => Number(r.status) === 0).length;
  const score = present + half * 0.5;
  return { total, present, half, absent, percent: total ? Math.round((score / total) * 100) : 0 };
}

export const attendanceTone = (percent) => (percent >= 75 ? 'success' : percent >= 50 ? 'warning' : 'danger');
