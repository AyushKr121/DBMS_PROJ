import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import Loading from "../../components/common/Loading";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";

export default function Tests() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axiosInstance.get("/student/tests");
      setTests(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load tests."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Tests & Results</h2>
        <button className="btn btn-outline-primary" onClick={fetchTests}>
          Refresh
        </button>
      </div>

      {tests.length === 0 ? (
        <EmptyState message="No tests available." />
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Test</th>
                <th>Batch</th>
                <th>Date</th>
                <th>Score</th>
                <th>Question Paper</th>
                <th>Answer Key</th>
              </tr>
            </thead>

            <tbody>
              {tests.map((test) => (
                <tr key={`${test.testId}-${test.batchId}`}>
                  <td>{test.title}</td>
                  <td>{test.batchId}</td>
                  <td>
                    {test.testDate
                      ? new Date(test.testDate).toLocaleDateString()
                      : "—"}
                  </td>
                  <td>
                    {test.score !== null && test.score !== undefined
                      ? test.score
                      : "Not evaluated"}
                  </td>
                  <td>
                    {test.questionPaper ? (
                      <a
                        href={test.questionPaper}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-sm btn-outline-primary"
                      >
                        View
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>
                    {test.answerKey ? (
                      <a
                        href={test.answerKey}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-sm btn-outline-secondary"
                      >
                        View
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}