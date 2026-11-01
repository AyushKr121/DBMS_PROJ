/**
 * Registry of every backend resource.
 *   path     : controller base path
 *   keys     : primary-key properties IN THE SAME ORDER as the controller's {path variables}
 *   table    : database table (shown in the "All data" explorer)
 *   dateKeys : key properties that are LocalDate. The backend binds those path variables with
 *              Spring's default converter (no @DateTimeFormat), so by-key URLs for them are not usable;
 *              the api layer reads those rows from the list endpoint and writes through POST (upsert).
 * Property names are the PascalCase column names of schema.sql (Student_id, First_name, Sequence_No ...).
 * The whole app uses exactly these names for request bodies and for reading responses; nothing is converted.
 * (The date-of-birth column is DOB; see dobOf() in utils/format.js.)
 */
export const RESOURCES = {
  student: { path: '/api/student', keys: ['Student_id'], table: 'Student', group: 'People' },
  teacher: { path: '/api/teacher', keys: ['Teacher_id'], table: 'Teacher', group: 'People' },
  assistant: { path: '/api/assistant', keys: ['Assistant_id'], table: 'Assistant', group: 'People' },
  admin: { path: '/api/admin', keys: ['Admin_id'], table: 'Admin', group: 'People' },

  studentContacts: { path: '/api/student-contacts', keys: ['Student_id', 'Phone_no'], table: 'Student_Contacts', group: 'People' },
  teacherContacts: { path: '/api/teacher-contacts', keys: ['Teacher_id', 'Phone_no'], table: 'Teacher_Contacts', group: 'People' },
  assistantContacts: { path: '/api/assistant-contacts', keys: ['Assistant_id', 'Phone_no'], table: 'Assistant_Contacts', group: 'People' },
  adminContacts: { path: '/api/admin-contacts', keys: ['Admin_id', 'Phone_no'], table: 'Admin_Contacts', group: 'People' },

  studentMiddleName: { path: '/api/student-middle-name', keys: ['Sequence_No', 'Student_id'], table: 'Student_Middle_Name', group: 'People' },
  teacherMiddleName: { path: '/api/teacher-middle-name', keys: ['Sequence_No', 'Teacher_id'], table: 'Teacher_Middle_Name', group: 'People' },
  assistantMiddleName: { path: '/api/assistant-middle-name', keys: ['Sequence_No', 'Assistant_id'], table: 'Assistant_Middle_Name', group: 'People' },
  adminMiddleName: { path: '/api/admin-middle-name', keys: ['Sequence_No', 'Admin_id'], table: 'Admin_Middle_Name', group: 'People' },

  pincode: { path: '/api/pincode', keys: ['Pincode'], table: 'Pincode', group: 'Academics' },
  course: { path: '/api/course', keys: ['Course_id'], table: 'Course', group: 'Academics' },
  courseModule: { path: '/api/course-module', keys: ['Module_id', 'Course_id'], table: 'Course_Module', group: 'Academics' },
  batch: { path: '/api/batch', keys: ['Batch_id'], table: 'Batch', group: 'Academics' },
  schedule: { path: '/api/schedule', keys: ['Day', 'Batch_id'], table: 'Schedule', group: 'Academics' },
  enrollment: { path: '/api/enrollment', keys: ['Student_id', 'Batch_id'], table: 'Enrollment', group: 'Academics' },
  test: { path: '/api/test', keys: ['Test_id', 'Batch_id'], table: 'Test', group: 'Academics' },
  takes: { path: '/api/takes', keys: ['Student_id', 'Batch_id', 'Test_id'], table: 'Takes', group: 'Academics' },

  studentAttendance: { path: '/api/student-attendance', keys: ['Date', 'Student_id', 'Batch_id'], dateKeys: ['Date'], table: 'Student_Attendance', group: 'Attendance' },
  teacherAttendance: { path: '/api/teacher-attendance-record', keys: ['Date', 'Teacher_id'], dateKeys: ['Date'], table: 'Teacher_Attendance_Record', group: 'Attendance' },
  assistantAttendance: { path: '/api/assistant-attendance-record', keys: ['Date', 'Assistant_id'], dateKeys: ['Date'], table: 'Assistant_Attendance_Record', group: 'Attendance' },

  feePayment: { path: '/api/fee-payment', keys: ['Receipt_id'], table: 'Fee_Payment', group: 'Finance' },
  feeDetails: { path: '/api/fee-details', keys: ['Receipt_id', 'Description'], table: 'Fee_Details', group: 'Finance' },
  teacherSalary: { path: '/api/teacher-salary-records', keys: ['Receipt_id'], table: 'Teacher_Salary_Records', group: 'Finance' },
  teacherSalaryDetails: { path: '/api/teacher-salary-details', keys: ['Receipt_id', 'Description'], table: 'Teacher_Salary_Details', group: 'Finance' },
  assistantSalary: { path: '/api/assistant-salary-records', keys: ['Receipt_id'], table: 'Assistant_Salary_Records', group: 'Finance' },
  assistantSalaryDetails: { path: '/api/assistant-salary-details', keys: ['Receipt_id', 'Description'], table: 'Assistant_Salary_Details', group: 'Finance' },

  globalNotification: { path: '/api/globalnotification', keys: ['Notification_id'], table: 'GlobalNotification', group: 'Communication' },
  assistantLastSeen: { path: '/api/assistant-lastseen-notification', keys: ['Assistant_id'], table: 'Assistant_LastSeen_Notification', group: 'Communication' },
  batchNotification: { path: '/api/batch-notification', keys: ['Notification_id', 'Batch_id'], table: 'Batch_Notification', group: 'Communication' },
  studentComplaints: { path: '/api/student-complaints', keys: ['Complaint_id', 'Student_id'], table: 'Student_Complaints', group: 'Communication' },
  teacherComplaints: { path: '/api/teacher-complaints', keys: ['Complaint_id', 'Teacher_id'], table: 'Teacher_Complaints', group: 'Communication' },
  assistantComplaints: { path: '/api/assistant-complaints', keys: ['Complaint_id', 'Assistant_id'], table: 'Assistant_Complaints', group: 'Communication' },
};

/** Resources that carry a password-like column, never kept in React state. */
export const SECRET_FIELDS = ['Credential'];
