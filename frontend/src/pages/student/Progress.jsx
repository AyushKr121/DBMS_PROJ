import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import Loading from "../../components/common/Loading";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";

export default function Progress() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProgress = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axiosInstance.get("/students/me/batches");
      setBatches(Array.isArray(response.data) ? response.data : []);
    } catch {
      setError("Unable to load your course progress.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  if (loading) return <Loading message="Loading progress..." />;

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchProgress} />;
  }

  return (
    <div>
      <h2 className="fw-bold mb-4">My Progress</h2>

      {batches.length === 0 ? (
        <EmptyState
          title="No enrolled batches"
          message="Your course progress will appear here after enrollment."
        />
      ) : (
        <div className="row g-3">
          {batches.map((batch) => {
            const completed = Number(batch.modulesCompleted ?? 0);
            const total = Number(batch.totalModules ?? 0);

            const percentage =
              total > 0
                ? Math.min(100, (completed / total) * 100)
                : null;

            return (
              <div className="col-md-6" key={batch.batchId}>
                <div className="card shadow-sm h-100">
                  <div className="card-body">
                    <h5 className="fw-bold">
                      {batch.courseName || "Course"}
                    </h5>

                    <p className="text-muted">
                      Batch ID: {batch.batchId}
                    </p>

                    <div className="d-flex justify-content-between mb-2">
                      <span>Modules completed</span>
                      <strong>
                        {completed} / {total || "N/A"}
                      </strong>
                    </div>

                    {percentage === null ? (
                      <p className="text-muted mb-0">
                        Total module count unavailable.
                      </p>
                    ) : (
                      <>
                        <div
                          className="progress"
                          role="progressbar"
                          aria-valuenow={percentage}
                          aria-valuemin="0"
                          aria-valuemax="100"
                          aria-label={`${batch.courseName} progress`}
                        >
                          <div
                            className="progress-bar"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>

                        <p className="text-muted mt-2 mb-0">
                          {percentage.toFixed(1)}% completed
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}