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
