import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import authApi from "../../api/authApi";

const initialForm = {
  role: "student",
  first_name: "",
  last_name: "",
  email: "",
  credential: "",
  sex: "",
  dob: "",
  pincode: "",
  aadhar_id: "",
};

export default function Signup() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Only assistants can access this page.
  if (loading) {
    return <p className="text-center mt-5">Loading...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "ASSISTANT") {
    return <Navigate to="/unauthorized" replace />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !form.first_name.trim() ||
      !form.email.trim() ||
      !form.credential
    ) {
      setError("First name, email, and password are required.");
      return;
    }

    if (form.credential.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        ...form,
        role: form.role,
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim() || null,
        email: form.email.trim(),
        sex: form.sex || null,
        dob: form.dob || null,
        pincode: form.pincode.trim() || null,
        aadhar_id: form.aadhar_id.trim() || null,
      };

      const response = await authApi.signup(payload);

      setSuccess(
        `${form.role.charAt(0).toUpperCase() + form.role.slice(1)} account created successfully. ID: ${response.id}`
      );

      setForm(initialForm);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to create account."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="card shadow-sm mx-auto" style={{ maxWidth: "750px" }}>
        <div className="card-body p-4">
          <h2 className="mb-4">Create User Account</h2>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success" role="alert">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Account type */}
            <div className="mb-3">
              <label htmlFor="role" className="form-label">
                Account Type
              </label>

              <select
                id="role"
                name="role"
                className="form-select"
                value={form.role}
                onChange={handleChange}
                required
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="assistant">Assistant</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Name */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="first_name" className="form-label">
                  First Name *
                </label>

                <input
                  id="first_name"
                  type="text"
                  name="first_name"
                  className="form-control"
                  value={form.first_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="last_name" className="form-label">
                  Last Name
                </label>

                <input
                  id="last_name"
                  type="text"
                  name="last_name"
                  className="form-control"
                  value={form.last_name}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Email */}
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email *
              </label>

              <input
                id="email"
                type="email"
                name="email"
                className="form-control"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password */}
            <div className="mb-3">
              <label htmlFor="credential" className="form-label">
                Password *
              </label>

              <input
                id="credential"
                type="password"
                name="credential"
                className="form-control"
                value={form.credential}
                onChange={handleChange}
                required
                minLength={8}
                autoComplete="new-password"
              />

              <div className="form-text">
                Password must contain at least 8 characters.
              </div>
            </div>

            {/* Date of birth and sex */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="dob" className="form-label">
                  Date of Birth
                </label>

                <input
                  id="dob"
                  type="date"
                  name="dob"
                  className="form-control"
                  value={form.dob}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="sex" className="form-label">
                  Sex
                </label>

                <select
                  id="sex"
                  name="sex"
                  className="form-select"
                  value={form.sex}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                  <option value="O">Other</option>
                </select>
              </div>
            </div>

            {/* Pincode and Aadhaar */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="pincode" className="form-label">
                  Pincode
                </label>

                <input
                  id="pincode"
                  type="text"
                  name="pincode"
                  className="form-control"
                  value={form.pincode}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="aadhar_id" className="form-label">
                  Aadhaar ID
                </label>

                <input
                  id="aadhar_id"
                  type="text"
                  name="aadhar_id"
                  className="form-control"
                  value={form.aadhar_id}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="d-flex gap-2 mt-3">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? "Creating..." : "Create Account"}
              </button>

              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => navigate("/assistant")}
                disabled={submitting}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}