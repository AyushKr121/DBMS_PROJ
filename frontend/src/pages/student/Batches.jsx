import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import Loading from "../../components/common/Loading";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";

export default function Batches() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBatches = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axiosInstance.get("/students/me/batches");
      setBatches(Array.isArray(response.data) ? response.data : []);
    } catch {
      setError("Unable to load your batches.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  if (loading) return <Loading message="Loading your batches..." />;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">My Batches</h2>
        <button className="btn btn-outline-primary" onClick={fetchBatches}>
          Refresh
        </button>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchBatches} />}

      {!error && batches.length === 0 && (
        <EmptyState
          title="No enrolled batches"
          message="You are not currently enrolled in any batches."
        />
      )}

      <div className="row g-3">
        {batches.map((batch) => (
          <div className="col-md-6 col-xl-4" key={batch.batchId}>
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">
                  {batch.courseName || "Course"}
                </h5>

                <p className="text-muted mb-3">
                  Batch ID: {batch.batchId}
                </p>

                <p className="mb-1">
                  <strong>Teacher:</strong>{" "}
                  {batch.teacherName || "Not assigned"}
                </p>

                <p className="mb-1">
                  <strong>Start date:</strong>{" "}
                  {batch.startDate || "N/A"}
                </p>

                <p className="mb-1">
                  <strong>Time:</strong>{" "}
                  {batch.startTime || "N/A"} – {batch.endTime || "N/A"}
                </p>

                <p className="mb-3">
                  <strong>Venue:</strong> {batch.venue || "N/A"}
                </p>

                <Link
                  to={`/student/batches/${encodeURIComponent(batch.batchId)}`}
                  className="btn btn-primary btn-sm"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}



// Expected :-
// [
//   {
//     "batchId": 101,
//     "courseName": "Mathematics",
//     "teacherName": "Rahul Sharma",
//     "startDate": "2026-09-01",
//     "startTime": "10:00",
//     "endTime": "12:00",
//     "venue": "Room 201"
//   }
// ]