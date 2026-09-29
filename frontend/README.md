# Institute Management System - React Frontend

React 18 + Vite + Bootstrap 5 + React Router 6 + Axios. Talks only to the Spring Boot REST API (never to TiDB, never holds secrets).

## Setup
```bash
npm install
cp .env.example .env      # set VITE_API_BASE_URL (default http://localhost:8080/api)
npm run dev               # http://localhost:5173
npm run build             # production bundle in dist/
```
Spring Boot must allow CORS for `http://localhost:5173` and accept `Authorization: Bearer <token>`.

## Configure institute content
Edit `src/config/institute.js` (name, intro, mission, contact - all placeholders).

## Conventions the backend must follow
* JSON keys = the SQL column names (`Student_id`, `Batch_id`, ...). If your API differs, adjust `src/services/index.js` and `src/config/entities.jsx`.
* List endpoints return an array, or a Spring `Page` (`{content:[...]}`).
* Composite keys go in the URL in the order below. Errors: `{message:"..."}`; 401 = session expired, 403 = forbidden.
* Login returns `{token, user:{id, role:"STUDENT|TEACHER|ASSISTANT", name, email}}`. Role is taken only from this response.

## Endpoints the frontend calls (all still to be built)
| Area | Endpoints |
|---|---|
| Auth | POST `/auth/login` `/auth/logout` `/auth/change-password`; GET `/auth/me` |
| Accounts | CRUD `/students` `/teachers` `/assistants` (POST accepts `Phone_nos[]`, `Middle_Names[]`, `Credential`=initial password, must be hashed) |
| Courses | CRUD `/courses`; GET `/courses/{id}/modules`, `/courses/{id}/batches` (courses list + those two must be public/readable by students); CRUD `/modules` (`/{Module_id}/{Course_id}`) |
| Batches | CRUD `/batches` (body may include `Days[]` -> Schedule table); GET `/batches/{id}/students` |
| Enrollments | CRUD `/enrollments` (`/{Student_id}/{Batch_id}`); POST `/enrollments/{sid}/{bid}/certificate` (multipart `file` -> Cloudinary) |
| Attendance | CRUD `/attendance/students` (`/{Date}/{Student_id}/{Batch_id}`), POST `/attendance/students/bulk` `{Batch_id,Date,records:[{Student_id,Status}]}`; CRUD `/attendance/teachers` (`/{Date}/{Teacher_id}`) |
| Tests | CRUD `/tests` (`/{Test_id}/{Batch_id}`); CRUD `/results` (`/{Student_id}/{Batch_id}/{Test_id}`) |
| Payments | CRUD `/payments` (`/{Receipt_id}`, body `Details[]` -> Fee_Details) |
| Notifications | GET/POST/PUT `/notifications/global`, `/notifications/batch` (`/{Notification_id}/{Batch_id}`); DELETE on the collection = flush all. No per-item delete. |
| Complaints | GET + DELETE `/complaints/students|teachers|assistants` (`/{Complaint_id}/{owner_id}`) |
| Dashboard | GET `/dashboard/summary` -> `{totalStudents,totalTeachers,totalAssistants,totalCourses,totalBatches,totalEnrollments,feeCollected,studentAttendancePercent,enrollmentsByCourse:[{Course_Name,count}],recentComplaints:[{type,title,date}],recentNotifications:[{title,date}]}` |
| Me | GET/PUT `/me/profile` (add `City`,`State` via Pincode join, `Phone_nos[]`, `Profile_picture_url`); POST `/me/profile-picture`; GET `/me/enrollments` (Enrollment+Batch+Course joined: `Course_Name, Teacher_name, Days[], Start_time, End_time, Modules_Completed, No_of_modules, Course_id`); `/me/attendance`; `/me/tests` (Test + Takes.Score, **no Answerkey_Link**); `/me/payments`; `/me/notifications/batch`; `/me/batches` (`Student_count`, `Course_Name`, `No_of_modules`); `/me/salary` (`Details[]`); `/me/attendance/staff` |

## Backend notes / gaps found in the schema
* No column for profile picture URL - add one (e.g. `Profile_Picture_URL`) to Student/Teacher/Assistant.
* No auto-increment on IDs; the frontend never sends primary IDs on create (except composite-key entities).
* No complaint status column, so complaints are view + delete only.
* Teacher ownership checks (attendance, tests, batches, notifications) must be enforced server-side.
* Auth token is kept in `localStorage`; prefer an httpOnly cookie if you want stronger XSS protection.
* Not built: a mock API layer, and the `Admin` table has no UI (the app's roles are Student/Teacher/Assistant).
