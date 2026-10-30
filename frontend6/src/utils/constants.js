export const INSTITUTE = {
  name: 'EduPortal',
  city: 'Varanasi, Uttar Pradesh, India',
  email: 'contact@eduportal.example',
  phone: '+91 00000 00000',
};

export const ROLES = ['student', 'teacher', 'assistant', 'admin'];

export const ROLE_LABEL = { student: 'Student', teacher: 'Teacher', assistant: 'Assistant', admin: 'Admin' };

/**
 * Per-role wiring to the backend resources (see api/resources.js).
 * Every JSON property below is the exact name the Spring/Jackson backend produces.
 */
export const ROLE_CFG = {
  student: {
    resource: 'student', idField: 'Student_id', label: 'Student', plural: 'Students',
    contacts: 'studentContacts', middle: 'studentMiddleName',
    complaints: 'studentComplaints', complaintTitle: 'Title',
    hasLastSeen: true,
  },
  teacher: {
    resource: 'teacher', idField: 'Teacher_id', label: 'Teacher', plural: 'Teachers',
    contacts: 'teacherContacts', middle: 'teacherMiddleName',
    complaints: 'teacherComplaints', complaintTitle: 'Title',
    attendance: 'teacherAttendance', salary: 'teacherSalary', salaryDetails: 'teacherSalaryDetails',
    hasSalary: true, hasLastSeen: true,
  },
  assistant: {
    resource: 'assistant', idField: 'Assistant_id', label: 'Assistant', plural: 'Assistants',
    contacts: 'assistantContacts', middle: 'assistantMiddleName',
    complaints: 'assistantComplaints', complaintTitle: 'Complaint_Title',
    attendance: 'assistantAttendance', salary: 'assistantSalary', salaryDetails: 'assistantSalaryDetails',
    hasSalary: true,
  },
  admin: {
    resource: 'admin', idField: 'Admin_id', label: 'Admin', plural: 'Admins',
    contacts: 'adminContacts', middle: 'adminMiddleName',
  },
};

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
export const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const MONTHS_SHORT = MONTHS.map((m) => m.slice(0, 3));
export const PAYMENT_MODES = ['Cash', 'UPI', 'Card', 'Bank transfer', 'Cheque'];
export const SEX_OPTIONS = ['Male', 'Female', 'Other'];

// Student_Attendance.Status is 0/1; Teacher/Assistant attendance is 0 / 0.5 / 1.
export const STUDENT_ATTENDANCE_STATES = [
  { value: 1, label: 'Present', tone: 'ok' },
  { value: 0, label: 'Absent', tone: 'bad' },
];
export const STAFF_ATTENDANCE_STATES = [
  { value: 1, label: 'Present', tone: 'ok' },
  { value: 0.5, label: 'Half day', tone: 'half' },
  { value: 0, label: 'Absent', tone: 'bad' },
];
