
import AssistantDashboard from "./pages/assistant/Dashboard";

import { Route, Routes } from "react-router-dom";

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
import Tests from "./pages/student/Tests";

import Signup from "./pages/assistant/Signup";

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
      {/* Public pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/login" element={<Login />} />
      </Route>

      {/* Authenticated users */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<RoleRedirect />} />
      </Route>

      {/* Student pages */}
      <Route element={<ProtectedRoute allowedRoles={["STUDENT"]} />}>
        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="batches" element={<Batches />} />
          <Route path="batches/:batchId" element={<BatchDetails />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="progress" element={<Progress />} />
          <Route path="tests" element={<Tests />} />
        </Route>
      </Route>

      {/* Assistant pages */}
      <Route element={<ProtectedRoute allowedRoles={["ASSISTANT"]} />}>
        <Route path="/assistant" element={<AssistantDashboard />} />
        <Route path="/assistant/signup" element={<Signup />} />
      </Route>

      {/* Access denied and unknown routes */}
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}