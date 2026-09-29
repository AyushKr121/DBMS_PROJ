import { Link, NavLink, Outlet } from "react-router-dom";

export default function PublicLayout() {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/">
            Institute Management
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#publicNavbar"
            aria-controls="publicNavbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="publicNavbar">
            <div className="navbar-nav ms-auto">
              <NavLink className="nav-link" to="/" end>
                Home
              </NavLink>

              <NavLink className="nav-link" to="/about">
                About
              </NavLink>

              <NavLink className="nav-link" to="/courses">
                Courses
              </NavLink>

              <NavLink className="nav-link" to="/login">
                Login
              </NavLink>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <Outlet />
      </main>

      <footer className="bg-dark text-white text-center py-3 mt-5">
        <div className="container">
          <p className="mb-0">
            © {new Date().getFullYear()} Institute Management
          </p>
        </div>
      </footer>
    </>
  );
}