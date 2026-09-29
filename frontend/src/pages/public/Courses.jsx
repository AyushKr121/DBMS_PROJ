import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import Loading from "../../components/common/Loading";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCourses = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axiosInstance.get("/courses");
      setCourses(Array.isArray(response.data) ? response.data : []);
    } catch {
      setError("Unable to load courses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  if (loading) return <Loading message="Loading courses..." />;

  return (
    <div className="container py-5">
      <h1 className="fw-bold text-center mb-4">Our Courses</h1>

      {error && <ErrorMessage message={error} onRetry={fetchCourses} />}

      {!error && courses.length === 0 && (
        <EmptyState
          title="No courses available"
          message="Courses will appear here when they are available."
        />
      )}

      <div className="row g-4">
        {courses.map((course) => (
          <div className="col-md-6 col-lg-4" key={course.courseId}>
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{course.courseName}</h5>

                <p className="card-text text-muted">
                  {course.description || "No description available."}
                </p>

                <p className="mb-1">
                  <strong>Duration:</strong>{" "}
                  {course.noOfWeeks ?? "N/A"} weeks
                </p>

                <p className="mb-1">
                  <strong>Modules:</strong>{" "}
                  {course.noOfModules ?? "N/A"}
                </p>

                <p className="mb-0">
                  <strong>Price:</strong>{" "}
                  {course.price != null ? `₹${course.price}` : "N/A"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}