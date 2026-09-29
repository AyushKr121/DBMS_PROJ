import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div>
      <section className="bg-light py-5">
        <div className="container py-5 text-center">
          <h1 className="display-4 fw-bold">
            Welcome to Our Institute
          </h1>

          <p className="lead text-muted mt-3">
            Learn new skills, explore courses, and track your progress
            through our institute management portal.
          </p>

          <div className="mt-4">
            <Link to="/courses" className="btn btn-primary btn-lg me-2">
              Explore Courses
            </Link>

            <Link to="/login" className="btn btn-outline-primary btn-lg">
              Login
            </Link>
          </div>
        </div>
      </section>

      <section className="container py-5">
        <h2 className="text-center mb-4">Our Portal</h2>

        <div className="row g-4">
          <div className="col-md-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body text-center">
                <h5 className="card-title">Students</h5>
                <p className="card-text">
                  View attendance, test results, course progress,
                  fees, and notifications.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body text-center">
                <h5 className="card-title">Teachers</h5>
                <p className="card-text">
                  Manage assigned batches, mark student attendance,
                  and view salary records.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body text-center">
                <h5 className="card-title">Assistants</h5>
                <p className="card-text">
                  Manage student and teacher records, batches,
                  enrollments, payments, and attendance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}