import { Navigate, Route, Routes } from 'react-router-dom';
import PublicLayout from '@/components/layout/PublicLayout';
import DashboardLayout from '@/components/layout/DashboardLayout';
import RequireRole, { OnlyFor } from '@/components/layout/RequireRole';

import Home from '@/pages/public/Home';
import About from '@/pages/public/About';
import Catalog from '@/pages/public/Catalog';
import Login from '@/pages/public/Login';
import NotFound from '@/pages/public/NotFound';

import Profile from '@/pages/shared/Profile';
import Complaints from '@/pages/shared/Complaints';
import GlobalNotifications from '@/pages/shared/GlobalNotifications';

import StudentDashboard from '@/pages/student/StudentDashboard';
import StudentBatches from '@/pages/student/StudentBatches';
import TeacherDashboard from '@/pages/teacher/TeacherDashboard';
import TeacherBatches from '@/pages/teacher/TeacherBatches';
import TeacherSalary from '@/pages/teacher/TeacherSalary';

import BatchLayout from '@/pages/batch/BatchLayout';
import BatchOverview from '@/pages/batch/BatchOverview';
import BatchModules from '@/pages/batch/BatchModules';
import BatchStudents from '@/pages/batch/BatchStudents';
import EnrollmentDetail from '@/pages/batch/EnrollmentDetail';
import BatchTests from '@/pages/batch/BatchTests';
import TestScores from '@/pages/batch/TestScores';
import BatchAttendance from '@/pages/batch/BatchAttendance';
import BatchFees from '@/pages/batch/BatchFees';
import BatchCertificate from '@/pages/batch/BatchCertificate';
import BatchNotifications from '@/pages/batch/BatchNotifications';
import BatchSettings from '@/pages/batch/BatchSettings';

import StaffDashboard from '@/pages/staff/StaffDashboard';
import People from '@/pages/staff/People';
import PersonDetail from '@/pages/staff/PersonDetail';
import Courses from '@/pages/staff/Courses';
import CourseDetail from '@/pages/staff/CourseDetail';
import Batches from '@/pages/staff/Batches';
import Enrollments from '@/pages/staff/Enrollments';
import Certificates from '@/pages/staff/Certificates';
import Pincodes from '@/pages/staff/Pincodes';
import Fees from '@/pages/staff/Fees';
import Salaries from '@/pages/staff/Salaries';
import StaffAttendance from '@/pages/staff/StaffAttendance';
import MyRecords from '@/pages/staff/MyRecords';
import Explorer from '@/pages/staff/Explorer';

/** The pages inside one batch. Students see fewer tabs, staff and teachers more. */
const batchRoutes = (role) => (
  <Route path="batches/:batchId" element={<BatchLayout role={role} />}>
    <Route index element={<Navigate to="overview" replace />} />
    <Route path="overview" element={<BatchOverview />} />
    <Route path="modules" element={<BatchModules />} />
    <Route path="tests" element={<BatchTests />} />
    {role !== 'student' && <Route path="tests/:testId" element={<TestScores />} />}
    <Route path="attendance" element={<BatchAttendance />} />
    <Route path="notifications" element={<BatchNotifications />} />
    {role === 'student' ? (
      <>
        <Route path="fees" element={<BatchFees />} />
        <Route path="certificate" element={<BatchCertificate />} />
      </>
    ) : (
      <>
        <Route path="students" element={<BatchStudents />} />
        <Route path="students/:studentId" element={<EnrollmentDetail />} />
      </>
    )}
    {(role === 'assistant' || role === 'admin') && (
      <>
        <Route path="fees" element={<BatchFees />} />
        <Route path="settings" element={<BatchSettings />} />
      </>
    )}
  </Route>
);

const shared = [
  <Route key="n" path="notifications" element={<GlobalNotifications />} />,
  <Route key="c" path="complaints" element={<Complaints />} />,
  <Route key="p" path="profile" element={<Profile />} />,
];

const staffRoutes = (role) => (
  <Route path={role} element={<RequireRole role={role}><DashboardLayout role={role} /></RequireRole>}>
    <Route index element={<StaffDashboard />} />
    <Route path="students" element={<People role="student" />} />
    <Route path="teachers" element={<People role="teacher" />} />
    <Route path="assistants" element={<People role="assistant" />} />
    <Route path="admins" element={<OnlyFor roles={['admin']}><People role="admin" /></OnlyFor>} />
    <Route path="people/:role/:id" element={<PersonDetail />} />
    <Route path="courses" element={<Courses />} />
    <Route path="courses/:courseId" element={<CourseDetail />} />
    <Route path="batches" element={<Batches />} />
    {batchRoutes(role)}
    <Route path="enrollments" element={<Enrollments />} />
    <Route path="certificates" element={<Certificates />} />
    <Route path="pincodes" element={<Pincodes />} />
    <Route path="fees" element={<Fees />} />
    <Route path="salaries" element={<Salaries />} />
    <Route path="attendance" element={<Navigate to="students" replace />} />
    <Route path="attendance/students" element={<StaffAttendance kind="students" />} />
    <Route path="attendance/teachers" element={<StaffAttendance kind="teachers" />} />
    <Route path="attendance/assistants" element={<StaffAttendance kind="assistants" />} />
    {role === 'assistant' && <Route path="my-records" element={<MyRecords />} />}
    <Route path="explorer" element={<Explorer />} />
    {shared}
    <Route path="*" element={<NotFound inApp />} />
  </Route>
);

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="catalog" element={<Catalog />} />
        <Route path="login" element={<Login />} />
      </Route>

      <Route path="student" element={<RequireRole role="student"><DashboardLayout role="student" /></RequireRole>}>
        <Route index element={<StudentDashboard />} />
        <Route path="batches" element={<StudentBatches />} />
        {batchRoutes('student')}
        {shared}
        <Route path="*" element={<NotFound inApp />} />
      </Route>

      <Route path="teacher" element={<RequireRole role="teacher"><DashboardLayout role="teacher" /></RequireRole>}>
        <Route index element={<TeacherDashboard />} />
        <Route path="batches" element={<TeacherBatches />} />
        {batchRoutes('teacher')}
        <Route path="salary" element={<TeacherSalary />} />
        {shared}
        <Route path="*" element={<NotFound inApp />} />
      </Route>

      {staffRoutes('assistant')}
      {staffRoutes('admin')}

      <Route element={<PublicLayout />}><Route path="*" element={<NotFound />} /></Route>
    </Routes>
  );
}
