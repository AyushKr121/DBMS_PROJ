import { useState } from "react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const { login, loading } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [credential, setCredential] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const user = await login(
        role,
        email.trim(),
        credential
      );

      const dashboardPaths = {
        STUDENT: "/student",
        TEACHER: "/teacher",
        ASSISTANT: "/assistant",
        ADMIN: "/admin",
      };

      const destination =
        dashboardPaths[user.role];

      if (!destination) {
        setError("Unsupported account role.");
        return;
      }

      navigate(
        location.state?.from?.pathname || destination,
        { replace: true }
      );
    } catch (err) {
      const status = err.response?.status;

      if (status === 401) {
        setError("Invalid password.");
      } else if (status === 404) {
        setError("User not found.");
      } else if (status === 400) {
        setError(
          err.response?.data?.error || "Invalid login details."
        );
      } else {
        setError("Login failed. Please try again.");
      }
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h2 className="text-center fw-bold mb-4">
                Login
              </h2>

              {error && (
                <div className="alert alert-danger">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label
                    htmlFor="role"
                    className="form-label"
                  >
                    Account Type
                  </label>

                  <select
                    id="role"
                    className="form-select"
                    value={role}
                    onChange={(event) =>
                      setRole(event.target.value)
                    }
                  >
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                    <option value="assistant">Assistant</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label
                    htmlFor="email"
                    className="form-label"
                  >
                    Email
                  </label>

                  <input
                    id="email"
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    autoComplete="username"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label
                    htmlFor="credential"
                    className="form-label"
                  >
                    Password
                  </label>

                  <input
                    id="credential"
                    type="password"
                    className="form-control"
                    value={credential}
                    onChange={(event) =>
                      setCredential(event.target.value)
                    }
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