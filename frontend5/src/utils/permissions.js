export const isStaff = (role) => role === 'assistant' || role === 'admin';

/**
 * Central access rules taken from the requirements document.
 *  - student: read-only access to own batches; own profile/complaints.
 *  - teacher: own batches only (tests, scores, attendance, batch notices); own salary.
 *  - assistant: creates/edits everything except admins; may NOT delete people or notifications.
 *  - admin: everything the assistant can do + delete student/teacher/assistant accounts,
 *           can view all complaints but cannot add one.
 */
export function can(role) {
  const staff = isStaff(role);
  return {
    staff,
    registerPeople: staff,
    editPeople: staff,
    deleteAccounts: role === 'admin',
    deleteRecords: staff, // any record that is not an account or a notification
    deleteNotifications: false, // never: the schema's "last seen" ids cannot move backwards
    manageCourses: staff,
    manageBatches: staff,
    enroll: staff,
    issueCertificates: staff,
    recordFinance: staff,
    publishGlobal: staff,
    addComplaint: role !== 'admin',
    viewAllComplaints: role === 'admin',
    markStaffAttendance: staff,
    teach: role === 'teacher' || staff, // tests, scores, student attendance, batch notices
    ownStaffRecords: role === 'assistant',
  };
}
