// import { Navigate, Route, Routes } from "react-router-dom";

// import ProtectedRoute from "./routes/ProtectedRoute";

// import PublicLayout from "./layouts/PublicLayout";
// import StudentLayout from "./layouts/StudentLayout";
// import TeacherLayout from "./layouts/TeacherLayout";
// import AssistantLayout from "./layouts/AssistantLayout";

// import Home from "./pages/public/Home";
// import About from "./pages/public/About";
// import Courses from "./pages/public/Courses";
// import Login from "./pages/public/Login";
// import ChangePassword from "./pages/public/ChangePassword";
// import Unauthorized from "./pages/Unauthorized";
// import NotFound from "./pages/NotFound";

// import StudentDashboard from "./pages/student/Dashboard";
// import StudentProfile from "./pages/student/Profile";
// import StudentBatches from "./pages/student/Batches";
// import StudentBatchDetails from "./pages/student/BatchDetails";
// import StudentAttendance from "./pages/student/Attendance";
// import StudentProgress from "./pages/student/Progress";
// import StudentTests from "./pages/student/Tests";
// import StudentCertificates from "./pages/student/Certificates";
// import StudentFees from "./pages/student/Fees";
// import StudentNotifications from "./pages/student/Notifications";
// import StudentComplaints from "./pages/student/Complaints";

// import TeacherDashboard from "./pages/teacher/Dashboard";
// import TeacherProfile from "./pages/teacher/Profile";
// import TeacherBatches from "./pages/teacher/Batches";
// import TeacherBatchDetails from "./pages/teacher/BatchDetails";
// import TeacherAttendance from "./pages/teacher/Attendance";
// import TeacherSchedule from "./pages/teacher/Schedule";
// import TeacherProgress from "./pages/teacher/Progress";
// import TeacherTests from "./pages/teacher/Tests";
// import TeacherSalary from "./pages/teacher/Salary";
// import TeacherNotifications from "./pages/teacher/Notifications";
// import TeacherComplaints from "./pages/teacher/Complaints";

// import AssistantDashboard from "./pages/assistant/Dashboard";
// import AssistantProfile from "./pages/assistant/Profile";
// import AssistantStudents from "./pages/assistant/Students";
// import AssistantTeachers from "./pages/assistant/Teachers";
// import AssistantBatches from "./pages/assistant/Batches";
// import AssistantEnrollments from "./pages/assistant/Enrollments";
// import AssistantCourses from "./pages/assistant/Courses";
// import AssistantModules from "./pages/assistant/Modules";
// import AssistantStudentAttendance from "./pages/assistant/StudentAttendance";
// import AssistantTeacherAttendance from "./pages/assistant/TeacherAttendance";
// import AssistantSchedules from "./pages/assistant/Schedules";
// import AssistantTests from "./pages/assistant/Tests";
// import AssistantTestResults from "./pages/assistant/TestResults";
// import AssistantFees from "./pages/assistant/Fees";
// import AssistantTeacherSalaries from "./pages/assistant/TeacherSalaries";
// import AssistantAssistantSalaries from "./pages/assistant/AssistantSalaries";
// import AssistantGlobalNotifications from "./pages/assistant/GlobalNotifications";
// import AssistantBatchNotifications from "./pages/assistant/BatchNotifications";
// import AssistantStudentComplaints from "./pages/assistant/StudentComplaints";
// import AssistantTeacherComplaints from "./pages/assistant/TeacherComplaints";
// import AssistantStudentContacts from "./pages/assistant/StudentContacts";
// import AssistantTeacherContacts from "./pages/assistant/TeacherContacts";
// import AssistantAssistantContacts from "./pages/assistant/AssistantContacts";

// function App() {
//   return (
//     <Routes>
//       {/* Public pages */}
//       <Route element={<PublicLayout />}>
//         <Route path="/" element={<Home />} />
//         <Route path="/about" element={<About />} />
//         <Route path="/courses" element={<Courses />} />
//         <Route path="/login" element={<Login />} />
//       </Route>

//       {/* Authenticated account pages */}
//       <Route element={<ProtectedRoute />}>
//         <Route path="/change-password" element={<ChangePassword />} />
//       </Route>

//       {/* Student pages */}
//       <Route element={<ProtectedRoute allowedRoles={["STUDENT"]} />}>
//         <Route path="/student" element={<StudentLayout />}>
//           <Route index element={<Navigate to="dashboard" replace />} />
//           <Route path="dashboard" element={<StudentDashboard />} />
//           <Route path="profile" element={<StudentProfile />} />
//           <Route path="batches" element={<StudentBatches />} />
//           <Route path="batches/:batchId" element={<StudentBatchDetails />} />
//           <Route path="attendance" element={<StudentAttendance />} />
//           <Route path="progress" element={<StudentProgress />} />
//           <Route path="tests" element={<StudentTests />} />
//           <Route path="certificates" element={<StudentCertificates />} />
//           <Route path="fees" element={<StudentFees />} />
//           <Route path="notifications" element={<StudentNotifications />} />
//           <Route path="complaints" element={<StudentComplaints />} />
//         </Route>
//       </Route>

//       {/* Teacher pages */}
//       <Route element={<ProtectedRoute allowedRoles={["TEACHER"]} />}>
//         <Route path="/teacher" element={<TeacherLayout />}>
//           <Route index element={<Navigate to="dashboard" replace />} />
//           <Route path="dashboard" element={<TeacherDashboard />} />
//           <Route path="profile" element={<TeacherProfile />} />
//           <Route path="batches" element={<TeacherBatches />} />
//           <Route path="batches/:batchId" element={<TeacherBatchDetails />} />
//           <Route
//             path="batches/:batchId/attendance"
//             element={<TeacherAttendance />}
//           />
//           <Route
//             path="batches/:batchId/schedule"
//             element={<TeacherSchedule />}
//           />
//           <Route
//             path="batches/:batchId/progress"
//             element={<TeacherProgress />}
//           />
//           <Route
//             path="batches/:batchId/tests"
//             element={<TeacherTests />}
//           />
//           <Route path="salary" element={<TeacherSalary />} />
//           <Route path="notifications" element={<TeacherNotifications />} />
//           <Route path="complaints" element={<TeacherComplaints />} />
//         </Route>
//       </Route>

//       {/* Assistant pages */}
//       <Route element={<ProtectedRoute allowedRoles={["ASSISTANT"]} />}>
//         <Route path="/assistant" element={<AssistantLayout />}>
//           <Route index element={<Navigate to="dashboard" replace />} />
//           <Route path="dashboard" element={<AssistantDashboard />} />
//           <Route path="profile" element={<AssistantProfile />} />
//           <Route path="students" element={<AssistantStudents />} />
//           <Route path="teachers" element={<AssistantTeachers />} />
//           <Route path="batches" element={<AssistantBatches />} />
//           <Route path="enrollments" element={<AssistantEnrollments />} />
//           <Route path="courses" element={<AssistantCourses />} />
//           <Route path="courses/:courseId/modules" element={<AssistantModules />} />
//           <Route
//             path="attendance/students"
//             element={<AssistantStudentAttendance />}
//           />
//           <Route
//             path="attendance/teachers"
//             element={<AssistantTeacherAttendance />}
//           />
//           <Route path="schedules" element={<AssistantSchedules />} />
//           <Route path="tests" element={<AssistantTests />} />
//           <Route path="tests/:testId/results" element={<AssistantTestResults />} />
//           <Route path="fees" element={<AssistantFees />} />
//           <Route
//             path="salaries/teachers"
//             element={<AssistantTeacherSalaries />}
//           />
//           <Route
//             path="salaries/assistants"
//             element={<AssistantAssistantSalaries />}
//           />
//           <Route
//             path="notifications/global"
//             element={<AssistantGlobalNotifications />}
//           />
//           <Route
//             path="notifications/batch"
//             element={<AssistantBatchNotifications />}
//           />
//           <Route
//             path="complaints/students"
//             element={<AssistantStudentComplaints />}
//           />
//           <Route
//             path="complaints/teachers"
//             element={<AssistantTeacherComplaints />}
//           />
//           <Route
//             path="contacts/students"
//             element={<AssistantStudentContacts />}
//           />
//           <Route
//             path="contacts/teachers"
//             element={<AssistantTeacherContacts />}
//           />
//           <Route
//             path="contacts/assistants"
//             element={<AssistantAssistantContacts />}
//           />
//         </Route>
//       </Route>

//       {/* Error pages */}
//       <Route path="/unauthorized" element={<Unauthorized />} />
//       <Route path="*" element={<NotFound />} />
//     </Routes>
//   );
// }

// export default App;




import { Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./routes/ProtectedRoute";
import RoleRedirect from "./routes/RoleRedirect";

import PublicLayout from "./components/layout/PublicLayout";
import StudentLayout from "./components/layout/StudentLayout";

import Home from "./pages/public/Home";
import About from "./pages/public/About";
import Courses from "./pages/public/Courses";
import Login from "./pages/public/Login";

import Dashboard from "./pages/student/Dashboard";
import Profile from "./pages/student/Profile";
import Batches from "./pages/student/Batches";
import BatchDetails from "./pages/student/BatchDetails";
import Attendance from "./pages/student/Attendance";
import Progress from "./pages/student/Progress";
// import Tests from "./pages/student/Tests";
function Unauthorized() {
  return (
    <div className="container text-center py-5">
      <h1>403</h1>
      <h3>Access Denied</h3>
      <p>You do not have permission to access this page.</p>
    </div>
  );
}

function NotFound() {
  return (
    <div className="container text-center py-5">
      <h1>404</h1>
      <h3>Page Not Found</h3>
      <p>The page you are looking for does not exist.</p>
      <a href="/" className="btn btn-primary">
        Go Home
      </a>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/login" element={<Login />} />
      </Route>

      {/* Redirect authenticated users to their dashboard */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<RoleRedirect />} />
      </Route>

      {/* Student routes */}
      <Route element={<ProtectedRoute allowedRoles={["STUDENT"]} />}>
        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="batches" element={<Batches />} />
          <Route path="batches/:batchId" element={<BatchDetails />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="progress" element={<Progress />} />
        </Route>
      </Route>

      {/* Other routes */}
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}