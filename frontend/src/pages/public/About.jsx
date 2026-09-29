export default function About() {
  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="fw-bold">About Us</h1>
        <p className="text-muted">
          Learn more about our institute and its management portal.
        </p>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-8">
          <h3>Our Institute</h3>
          <p>
            Our institute provides structured courses and batch-based
            learning. Students can access their academic information
            through the online portal.
          </p>

          <h3 className="mt-4">Our Management Portal</h3>
          <p>
            The portal provides separate dashboards for students,
            teachers, and assistants. It helps manage courses,
            attendance, assessments, fees, and notifications.
          </p>

          <h3 className="mt-4">Our Users</h3>
          <ul>
            <li>
              <strong>Students:</strong> Access academic records,
              attendance, results, and fee information.
            </li>
            <li>
              <strong>Teachers:</strong> Manage assigned batches
              and student attendance.
            </li>
            <li>
              <strong>Assistants:</strong> Manage institute records
              and administrative operations.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}