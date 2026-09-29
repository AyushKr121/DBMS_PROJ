import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const navigation = [
  { label: "Dashboard", path: "/student", end: true },
  { label: "Profile", path: "/student/profile" },
  { label: "My Batches", path: "/student/batches" },
  { label: "Attendance", path: "/student/attendance" },
  { label: "Progress", path: "/student/progress" },
  { label: "Tests & Results", path: "/student/tests" },
  { label: "Certificates", path: "/student/certificates" },
  { label: "Fees", path: "/student/fees" },
  { label: "Notifications", path: "/student/notifications" },
  { label: "Complaints", path: "/student/complaints" },
];

export default function StudentLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-vh-100 bg-light">
      <nav className="navbar navbar-dark bg-primary">
        <div className="container-fluid px-4">
          <NavLink className="navbar-brand fw-bold" to="/student">
            Student Portal
          </NavLink>

          <div className="d-flex align-items-center gap-3 text-white">
            <span>{user?.firstName || user?.userId || "Student"}</span>
            <button
              className="btn btn-outline-light btn-sm"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container-fluid">
        <div className="row">
          <aside className="col-md-3 col-lg-2 bg-white border-end min-vh-100 p-3">
            <nav className="nav flex-column gap-1">
              {navigation.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) =>
                    `nav-link rounded ${
                      isActive
                        ? "active bg-primary text-white"
                        : "text-dark"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </aside>

          <main className="col-md-9 col-lg-10 p-4">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}