import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RoleRedirect() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  switch (user.role) {
    case "STUDENT":
      return <Navigate to="/student/dashboard" replace />;

    case "TEACHER":
      return <Navigate to="/teacher/dashboard" replace />;

    case "ASSISTANT":
      return <Navigate to="/assistant/dashboard" replace />;

    default:
      return <Navigate to="/unauthorized" replace />;
  }
}
