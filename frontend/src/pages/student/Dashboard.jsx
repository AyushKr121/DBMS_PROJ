import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import Loading from "../../components/common/Loading";
import ErrorMessage from "../../components/common/ErrorMessage";

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axiosInstance.get("/students/me/dashboard");
      setDashboard(response.data);
    } catch {
      setError("Unable to load your dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) return <Loading message="Loading dashboard..." />;

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchDashboard} />;
  }

  const summary = [
    {
      title: "Enrolled Batches",
      value: dashboard?.enrolledBatches ?? 0,
    },
    {
      title: "Attendance",
      value:
        dashboard?.attendancePercentage != null
          ? `${dashboard.attendancePercentage}%`
          : "N/A",
    },
    {
      title: "Tests Taken",
      value: dashboard?.testsTaken ?? 0,
    },
    {
      title: "Pending Fees",
      value:
        dashboard?.pendingFees != null
          ? `₹${dashboard.pendingFees}`
          : "N/A",
    },
  ];

  return (
    <div>
      <div className="mb-4">
        <h2 className="fw-bold">
          Welcome, {dashboard?.firstName || "Student"}
        </h2>
        <p className="text-muted">
          Here's an overview of your academic information.
        </p>
      </div>

      <div className="row g-3">
        {summary.map((item) => (
          <div className="col-sm-6 col-xl-3" key={item.title}>
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <p className="text-muted mb-2">{item.title}</p>
                <h3 className="fw-bold mb-0">{item.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      <section className="card shadow-sm mt-4">
        <div className="card-body">
          <h5 className="fw-bold">Recent Notifications</h5>

          {!dashboard?.recentNotifications?.length ? (
            <p className="text-muted mb-0">No recent notifications.</p>
          ) : (
            <ul className="list-group list-group-flush">
              {dashboard.recentNotifications.map((notification) => (
                <li
                  className="list-group-item px-0"
                  key={notification.notificationId}
                >
                  <strong>{notification.title}</strong>
                  <p className="mb-0 text-muted">
                    {notification.description}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}


// The dashboard currently expects this response shape:

// {
//   "firstName": "Amit",
//   "enrolledBatches": 2,
//   "attendancePercentage": 85.5,
//   "testsTaken": 4,
//   "pendingFees": 1500,
//   "recentNotifications": [
//     {
//       "notificationId": 1,
//       "title": "Test announcement",
//       "description": "The next test is scheduled."
//     }
//   ]
// }