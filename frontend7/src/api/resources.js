/**
 * Registry of every backend resource.
 *   path     : controller base path
 *   keys     : primary-key properties IN THE SAME ORDER as the controller's {path variables}
 *   table    : database table (shown in the "All data" explorer)
 *   dateKeys : key properties that are LocalDate. The backend binds those path variables with
 *              Spring's default converter (no @DateTimeFormat), so by-key URLs for them are not usable;
 *              the api layer reads those rows from the list endpoint and writes through POST (upsert).
 * Property names are the exact JSON names Jackson produces from the entity getters
 * (e.g. getSequence_No -> sequence_No, getLastSeen_Global_Notification_id -> lastSeen_Global_Notification_id).
 */
export const RESOURCES = {
  student: { path: '/api/student', keys: ['student_id'], table: 'Student', group: 'People' },
  teacher: { path: '/api/teacher', keys: ['teacher_id'], table: 'Teacher', group: 'People' },
  assistant: { path: '/api/assistant', keys: ['assistant_id'], table: 'Assistant', group: 'People' },
  admin: { path: '/api/admin', keys: ['admin_id'], table: 'Admin', group: 'People' },

  studentContacts: { path: '/api/student-contacts', keys: ['student_id', 'phone_no'], table: 'Student_Contacts', group: 'People' },
  teacherContacts: { path: '/api/teacher-contacts', keys: ['teacher_id', 'phone_no'], table: 'Teacher_Contacts', group: 'People' },
  assistantContacts: { path: '/api/assistant-contacts', keys: ['assistant_id', 'phone_no'], table: 'Assistant_Contacts', group: 'People' },
  adminContacts: { path: '/api/admin-contacts', keys: ['admin_id', 'phone_no'], table: 'Admin_Contacts', group: 'People' },

  studentMiddleName: { path: '/api/student-middle-name', keys: ['sequence_No', 'student_id'], table: 'Student_Middle_Name', group: 'People' },
  teacherMiddleName: { path: '/api/teacher-middle-name', keys: ['sequence_No', 'teacher_id'], table: 'Teacher_Middle_Name', group: 'People' },
  assistantMiddleName: { path: '/api/assistant-middle-name', keys: ['sequence_No', 'assistant_id'], table: 'Assistant_Middle_Name', group: 'People' },
  adminMiddleName: { path: '/api/admin-middle-name', keys: ['sequence_No', 'admin_id'], table: 'Admin_Middle_Name', group: 'People' },

  pincode: { path: '/api/pincode', keys: ['pincode'], table: 'Pincode', group: 'Academics' },
  course: { path: '/api/course', keys: ['course_id'], table: 'Course', group: 'Academics' },
  courseModule: { path: '/api/course-module', keys: ['module_id', 'course_id'], table: 'Course_Module', group: 'Academics' },
  batch: { path: '/api/batch', keys: ['batch_id'], table: 'Batch', group: 'Academics' },
  schedule: { path: '/api/schedule', keys: ['day', 'batch_id'], table: 'Schedule', group: 'Academics' },
  enrollment: { path: '/api/enrollment', keys: ['student_id', 'batch_id'], table: 'Enrollment', group: 'Academics' },
  test: { path: '/api/test', keys: ['test_id', 'batch_id'], table: 'Test', group: 'Academics' },
  takes: { path: '/api/takes', keys: ['student_id', 'batch_id', 'test_id'], table: 'Takes', group: 'Academics' },

  studentAttendance: { path: '/api/student-attendance', keys: ['date', 'student_id', 'batch_id'], dateKeys: ['date'], table: 'Student_Attendance', group: 'Attendance' },
  teacherAttendance: { path: '/api/teacher-attendance-record', keys: ['date', 'teacher_id'], dateKeys: ['date'], table: 'Teacher_Attendance_Record', group: 'Attendance' },
  assistantAttendance: { path: '/api/assistant-attendance-record', keys: ['date', 'assistant_id'], dateKeys: ['date'], table: 'Assistant_Attendance_Record', group: 'Attendance' },

  feePayment: { path: '/api/fee-payment', keys: ['receipt_id'], table: 'Fee_Payment', group: 'Finance' },
  feeDetails: { path: '/api/fee-details', keys: ['receipt_id', 'description'], table: 'Fee_Details', group: 'Finance' },
  teacherSalary: { path: '/api/teacher-salary-records', keys: ['receipt_id'], table: 'Teacher_Salary_Records', group: 'Finance' },
  teacherSalaryDetails: { path: '/api/teacher-salary-details', keys: ['receipt_id', 'description'], table: 'Teacher_Salary_Details', group: 'Finance' },
  assistantSalary: { path: '/api/assistant-salary-records', keys: ['receipt_id'], table: 'Assistant_Salary_Records', group: 'Finance' },
  assistantSalaryDetails: { path: '/api/assistant-salary-details', keys: ['receipt_id', 'description'], table: 'Assistant_Salary_Details', group: 'Finance' },

  globalNotification: { path: '/api/globalnotification', keys: ['notification_id'], table: 'GlobalNotification', group: 'Communication' },
  assistantLastSeen: { path: '/api/assistant-lastseen-notification', keys: ['assistant_id'], table: 'Assistant_LastSeen_Notification', group: 'Communication' },
  batchNotification: { path: '/api/batch-notification', keys: ['notification_id', 'batch_id'], table: 'Batch_Notification', group: 'Communication' },
  studentComplaints: { path: '/api/student-complaints', keys: ['complaint_id', 'student_id'], table: 'Student_Complaints', group: 'Communication' },
  teacherComplaints: { path: '/api/teacher-complaints', keys: ['complaint_id', 'teacher_id'], table: 'Teacher_Complaints', group: 'Communication' },
  assistantComplaints: { path: '/api/assistant-complaints', keys: ['complaint_id', 'assistant_id'], table: 'Assistant_Complaints', group: 'Communication' },
};

/** Resources that carry a password-like column, never kept in React state. */
export const SECRET_FIELDS = ['credential'];
