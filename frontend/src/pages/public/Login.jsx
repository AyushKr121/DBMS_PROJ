import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getDashboardPath = (role) => {
    const paths = {
      STUDENT: "/student",
      TEACHER: "/teacher",
      ASSISTANT: "/assistant",
    };

    return paths[role];
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!userId.trim() || !password) {
      setError("Please enter your user ID and password.");
      return;
    }

    setLoading(true);

    try {
      const user = await login(userId.trim(), password);
      const dashboard = getDashboardPath(user?.role);

      if (!dashboard) {
        setError("Your account has an unsupported role.");
        return;
      }

      navigate(location.state?.from?.pathname || dashboard, {
        replace: true,
      });
    } catch {
      setError("Invalid credentials or login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h2 className="text-center fw-bold mb-4">Login</h2>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="userId" className="form-label">
                    User ID
                  </label>
                  <input
                    id="userId"
                    type="text"
                    className="form-control"
                    value={userId}
                    onChange={(event) => setUserId(event.target.value)}
                    autoComplete="username"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="current-password"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Login assumes the response contains a user object with a role field. Courses assumes GET /courses returns an array. These are still proposed API contracts, not verified against your Spring Boot controllers.