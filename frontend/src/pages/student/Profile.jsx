import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import Loading from "../../components/common/Loading";
import ErrorMessage from "../../components/common/ErrorMessage";

const editableFields = [
  "email",
  "phone",
  "address",
];

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    email: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchProfile = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axiosInstance.get("/students/me");
      const data = response.data;

      setProfile(data);
      setForm({
        email: data.email ?? "",
        phone: data.phone ?? "",
        address: data.address ?? "",
      });
    } catch {
      setError("Unable to load your profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setSaving(true);

    try {
      const payload = Object.fromEntries(
        editableFields.map((field) => [field, form[field].trim()])
      );

      const response = await axiosInstance.patch(
        "/students/me",
        payload
      );

      const updatedProfile = response.data;
      setProfile(updatedProfile);
      setForm({
        email: updatedProfile.email ?? "",
        phone: updatedProfile.phone ?? "",
        address: updatedProfile.address ?? "",
      });
      setSuccess("Profile updated successfully.");
    } catch {
      setError("Unable to update your profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading message="Loading profile..." />;

  if (error && !profile) {
    return <ErrorMessage message={error} onRetry={fetchProfile} />;
  }

  return (
    <div>
      <h2 className="fw-bold mb-4">My Profile</h2>

      {error && <ErrorMessage message={error} />}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="card shadow-sm">
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Student ID</label>
                <input
                  className="form-control"
                  value={profile?.studentId ?? ""}
                  disabled
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">First Name</label>
                <input
                  className="form-control"
                  value={profile?.firstName ?? ""}
                  disabled
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Last Name</label>
                <input
                  className="form-control"
                  value={profile?.lastName ?? ""}
                  disabled
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Date of Birth</label>
                <input
                  className="form-control"
                  value={profile?.dob ?? ""}
                  disabled
                />
              </div>

              <div className="col-md-6">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="form-control"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label htmlFor="phone" className="form-label">
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className="form-control"
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="col-12">
                <label htmlFor="address" className="form-label">
                  Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  className="form-control"
                  rows="3"
                  value={form.address}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary mt-4"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}