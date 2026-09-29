import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import Loading from "../../components/common/Loading";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";

export default function Attendance() {
  const [records, setRecords] = useState([]);
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAttendance = async () => {
    setLoading(true);
    setError("");

    try {
      const [attendanceResponse, batchesResponse] = await Promise.all([
        axiosInstance.get("/students/me/attendance"),
        axiosInstance.get("/students/me/batches"),
      ]);

      setRecords(
        Array.isArray(attendanceResponse.data)
          ? attendanceResponse.data
          : []
      );
      setBatches(
        Array.isArray(batchesResponse.data) ? batchesResponse.data : []
      );
    } catch {
      setError("Unable to load attendance records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const filteredRecords = records.filter(
    (record) =>
      !selectedBatch ||
      String(record.batchId) === selectedBatch
  );

  const presentCount = filteredRecords.filter(
    (record) => record.status === 1 || record.status === true
  ).length;

  const percentage =
    filteredRecords.length > 0
      ? ((presentCount / filteredRecords.length) * 100).toFixed(1)
      : null;

  if (loading) return <Loading message="Loading attendance..." />;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">My Attendance</h2>
        <button
          className="btn btn-outline-primary"
          onClick={fetchAttendance}
        >
          Refresh
        </button>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchAttendance} />}

      {!error && (
        <>
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <label htmlFor="batchFilter" className="form-label">
                Filter by batch
              </label>
              <select
                id="batchFilter"
                className="form-select"
                value={selectedBatch}
                onChange={(event) => setSelectedBatch(event.target.value)}
              >
                <option value="">All batches</option>
                {batches.map((batch) => (
                  <option key={batch.batchId} value={batch.batchId}>
                    {batch.courseName || "Course"} — {batch.batchId}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <div className="card shadow-sm">
                <div className="card-body">
                  <p className="text-muted mb-1">Classes recorded</p>
                  <h3 className="fw-bold">{filteredRecords.length}</h3>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card shadow-sm">
                <div className="card-body">
                  <p className="text-muted mb-1">Attendance percentage</p>
                  <h3 className="fw-bold">
                    {percentage === null ? "N/A" : `${percentage}%`}
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {filteredRecords.length === 0 ? (
            <EmptyState
              title="No attendance records"
              message="Attendance records will appear here once available."
            />
          ) : (
            <div className="card shadow-sm">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Date</th>
                      <th>Batch ID</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecords.map((record) => (
                      <tr
                        key={`${record.date}-${record.batchId}`}
                      >
                        <td>{record.date}</td>
                        <td>{record.batchId}</td>
                        <td>
                          {record.status === 1 ||
                          record.status === true ? (
                            <span className="badge bg-success">
                              Present
                            </span>
                          ) : (
                            <span className="badge bg-danger">
                              Absent
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}