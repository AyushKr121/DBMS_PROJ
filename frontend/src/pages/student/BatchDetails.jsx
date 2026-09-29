import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import Loading from "../../components/common/Loading";
import ErrorMessage from "../../components/common/ErrorMessage";

export default function BatchDetails() {
  const { batchId } = useParams();

  const [batch, setBatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBatch = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axiosInstance.get(
        `/students/me/batches/${encodeURIComponent(batchId)}`
      );
      setBatch(response.data);
    } catch {
      setError("Unable to load batch details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatch();
  }, [batchId]);

  if (loading) return <Loading message="Loading batch details..." />;

  if (error) {
    return (
      <div>
        <Link to="/student/batches" className="btn btn-link px-0">
          ← Back to batches
        </Link>
        <ErrorMessage message={error} onRetry={fetchBatch} />
      </div>
    );
  }

  if (!batch) {
    return <p className="text-muted">Batch not found.</p>;
  }

  return (
    <div>
      <Link to="/student/batches" className="btn btn-link px-0 mb-3">
        ← Back to batches
      </Link>

      <h2 className="fw-bold mb-4">
        {batch.courseName || "Batch Details"}
      </h2>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5 className="fw-bold mb-3">Batch Information</h5>

          <div className="row g-3">
            <div className="col-md-6">
              <strong>Batch ID</strong>
              <p>{batch.batchId}</p>
            </div>

            <div className="col-md-6">
              <strong>Course</strong>
              <p>{batch.courseName || "N/A"}</p>
            </div>

            <div className="col-md-6">
              <strong>Teacher</strong>
              <p>{batch.teacherName || "Not assigned"}</p>
            </div>

            <div className="col-md-6">
              <strong>Start Date</strong>
              <p>{batch.startDate || "N/A"}</p>
            </div>

            <div className="col-md-6">
              <strong>Class Time</strong>
              <p>
                {batch.startTime || "N/A"} – {batch.endTime || "N/A"}
              </p>
            </div>

            <div className="col-md-6">
              <strong>Venue</strong>
              <p>{batch.venue || "N/A"}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="fw-bold mb-3">Course Progress</h5>

          <p>
            <strong>Modules completed:</strong>{" "}
            {batch.modulesCompleted ?? 0}
            {batch.totalModules != null
              ? ` / ${batch.totalModules}`
              : ""}
          </p>

          {batch.totalModules > 0 && (
            <>
              <div
                className="progress"
                role="progressbar"
                aria-label="Course progress"
                aria-valuenow={Math.min(
                  100,
                  (batch.modulesCompleted / batch.totalModules) * 100
                )}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                <div
                  className="progress-bar"
                  style={{
                    width: `${Math.min(
                      100,
                      (batch.modulesCompleted / batch.totalModules) * 100
                    )}%`,
                  }}
                />
              </div>

              <small className="text-muted">
                {Math.round(
                  (batch.modulesCompleted / batch.totalModules) * 100
                )}
                % completed
              </small>
            </>
          )}
        </div>
      </div>
    </div>
  );
}