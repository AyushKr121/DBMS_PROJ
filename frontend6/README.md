# EduPortal frontend (React + Vite)

    npm install
    npm run dev        # http://localhost:5173  (backend expected at VITE_API_BASE_URL, default http://localhost:8080)
    npm run build

Roles: public site, student, teacher, assistant, admin. Session-cookie login (`/api/auth/*`).

Structure: `src/api` (resource registry + service layer), `src/pages/{public,shared,student,teacher,staff,batch}`,
`src/components/{ui,layout,people,batch,finance}`, `src/styles/*.css` (one stylesheet per concern), `src/utils`.

Notes
- Attendance tables are keyed by date; the backend's by-key URLs for dates are not usable, so the app lists and saves (upsert) instead. Attendance rows cannot be deleted.
- The backend sends no email: new-account and password-reset details are shown in a dialog with a "Compose email" button.
- Fee dues (price, discount, payments) and multi-valued attributes (phones, middle names) are computed in the frontend with repeated API calls.

Property names
- Every request body and every response field uses the PascalCase column names from schema.sql
  (Student_id, First_name, Course_Name, Receipt_id ...). There is no converter layer.
- Only the hand-written /api/auth/* endpoints use lower-case keys (role, email, credential, first_name ...), because the controller reads them that way.
- DOB: the schema column is DOB. `dobOf()` reads DOB or Dob and edits send both, in case your Jackson naming turns it into "Dob".

Debugging
- Every failed API call prints a collapsed group in the browser console: [API http] METHOD /path -> status, with the URL, the request body (passwords hidden) and the server's answer.
- A page that crashes shows a message with a Try again button (the rest of the app keeps working) and logs the stack as [page crashed].
- Data that fails to load shows which table failed, and a Try again button.
