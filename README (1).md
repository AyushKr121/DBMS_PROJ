# 🎓 EduPortal

### Coaching Institute Management System

*A full-stack web application to run a coaching institute: batches, students, teachers, fees, salaries, attendance and notices, all in one place.*

**5th Semester DBMS Group Project**

![Java](https://img.shields.io/badge/Java-25-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![React](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

---

## 📖 Table of Contents

- [About the Project](#-about-the-project)
- [What We Built](#-what-we-built)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Notes for Developers](#-notes-for-developers)
- [Contributors](#-contributors)
- [Acknowledgements](#-acknowledgements)

---

## 📌 About the Project

**EduPortal** is our 5th semester **Database Management Systems (DBMS)** group project. It manages the daily work of a coaching institute on top of a relational database of **35 tables**, with a Spring Boot REST API and a responsive React frontend.

The core idea is that **everything happens inside a batch**. A student's timings, venue, modules, tests, scores, attendance, fees, certificate and notices all belong to one batch, so the same student enrolled in two batches has two completely separate records.

There is no public sign-up. Accounts are created at the institute by an assistant, who shares the login details with the user.

---

## ✨ What We Built

### 🌐 Institutional website
- Home and About pages, a navbar and a footer
- Course catalog: category cards first, then the courses inside a category
- The navbar shows a profile avatar with the user's initials and a **Dashboard** link when logged in, otherwise a **Log in** button

### 🧑‍🎓 Student
- Sidebar listing every enrolled batch
- A separate page for each part of a batch: details (time, venue, days), modules and progress, tests and scores, attendance, fee status, certificate and feedback, and batch notices
- Institute-wide notifications, profile editing (name and Aadhar are read-only, with a change-password option) and complaints

### 👩‍🏫 Teacher
- Sees **only the batches assigned to them**
- Creates tests, enters scores, marks attendance, tracks module progress and posts batch notices (notices are never deleted)
- Month-by-month salary status with reference numbers, global notifications, profile and complaints

### 🧑‍💼 Assistant
- Registers students and teachers; creates and edits courses, modules, batches (picking an existing course and teacher by name, never by ID), enrollments, certificates and pincodes
- Records fee payments and salary entries, marks attendance for any student, teacher or assistant, and publishes global notifications
- Warns about teacher and venue clashes when scheduling batches
- Cannot delete student, teacher or assistant accounts, or any notification
- Can see their own salary, attendance and complaints

### 🛡️ Admin
- Everything an assistant can do, plus **deleting student, teacher and assistant accounts**
- Read-only view of **all complaints** (admins cannot file them)
- An "All data" explorer showing every table

### 🔔 Notifications
- **Global notifications** use a *last seen* foreign key. `NULL` means nothing has been seen yet.
- **Batch notices** use a boolean on each enrollment. Posting a notice sets it to `false` for everyone in the batch, and opening the notices page sets it to `true`.
- The bell and sidebar show a **red dot** when something is new.

### 🧠 Extra logic handled in the frontend
The backend is plain CRUD, so the frontend adds the extra logic:
- Repeated API calls to read multi-valued attributes (phone numbers, middle names)
- Fee maths: payable = course price less the enrollment discount, minus the payments recorded
- Next-ID generation, cascade-aware deletes with a confirmation that lists what will also be removed, and fresh reads before every write
- Friendly error messages, and detailed API error logs in the browser console for easy debugging

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite 5, React Router v6, plain CSS (one stylesheet per concern) |
| **Backend** | Java 25, Spring Boot, Spring Web (REST), Spring Data JPA, JDBC, Maven Wrapper |
| **Database** | MySQL (35 tables with composite keys, foreign keys and cascade rules) |
| **Auth** | Session cookie (`/api/auth/login`, `signup`, `me`, `logout`) |

---

## 📁 Project Structure

```text
.
├── backend/                 # Spring Boot REST API
│   └── src/main/java/com/example/backend/
│       ├── controller/      # REST endpoints, one per table + AuthController
│       ├── service/         # business layer
│       ├── repository/      # Spring Data JPA repositories
│       ├── entity/          # JPA entities (+ composite key classes)
│       ├── middleware/      # auth interceptor
│       └── config/          # CORS and web configuration
│
└── frontend6/               # React + Vite web app
    └── src/
        ├── api/             # resource registry, API client, multi-call services
        ├── components/      # ui, layout, people, batch, finance
        ├── context/         # auth, toast, confirm dialogs
        ├── hooks/           # data loading and action helpers
        ├── pages/           # public, shared, student, teacher, staff, batch
        ├── styles/          # CSS files
        └── utils/           # formatting, fees, permissions, navigation
```

---

## 🚀 Getting Started

### Prerequisites

- **Java 25** (JDK, including `javac`)
- **Node.js 18+** and npm
- **MySQL** with the project schema (`schema.sql`) loaded
- VS Code (optional) with the **Extension Pack for Java** (Microsoft) and the **Spring Boot Extension Pack** (VMware)

### 1️⃣ Database

1. Create a MySQL database and run the provided `schema.sql` in it to create all tables.
2. Keep the database name, username and password handy for the backend setup.

### 2️⃣ Backend

```bash
cd backend
```

1. Install **Java 25** and make sure both `java -version` and `javac -version` show version 25.
2. In VS Code, install the **Java** extension from Microsoft and the **Spring Boot** extension from VMware (v4.1.0).
3. Set up the backend environment with the database credentials shared by the team (database URL, username and password).
4. Start the server:

```powershell
# Windows
.\mvnw.cmd spring-boot:run
```

```bash
# macOS / Linux
./mvnw spring-boot:run
```

The API runs at **http://localhost:8080**.

### 3️⃣ Frontend

```bash
cd frontend6
npm i
```

Create a `.env` file in `frontend6/` (a `.env.example` is included):

```env
VITE_API_BASE_URL=http://localhost:8080
```

Start the development server:

```bash
npm run dev
```

Open **http://localhost:5173**.

> ⚠️ Keep the frontend on port **5173**. The backend only allows that origin through CORS, and the dev server is configured to refuse any other port.

Production build:

```bash
npm run build
npm run preview
```

---

## 🧩 Notes for Developers

- **Field names are PascalCase** and match the schema columns exactly (`Student_id`, `First_name`, `Course_Name`, `Receipt_id`). The frontend reads and sends them as they are, with no conversion. Only the hand-written `/api/auth/*` endpoints use lowercase keys.
- **Date-keyed tables** (the three attendance tables) are read from the list endpoint and saved with POST, because their by-key URLs are not usable. Attendance rows therefore cannot be deleted.
- **Email is not sent by the backend.** After registering a user or resetting a password, the login details appear in a dialog with a *Compose email* button.
- **Debugging:** every failed API call prints a collapsed group in the browser console (F12) with the URL, status, request body (passwords hidden) and the server's reply.

---

## 👥 Contributors

Thank you to everyone who worked on this project. 💙

| Name | Handle |
|---|---|
| Ayush Kumar | AyushKr121 |
| Amrit Kumar | LogicalLuminary |
| Ashutosh Kumar | soap-48 |
| Arpit Kumar Gupta | Arpit2089 |
| Aman Gupta | JustRelax7 |
| Amod Yadav | amod404 |

---

## 🙏 Acknowledgements

- Our course instructor, Dr. Ravindranath Chowdary C, for guidance throughout the DBMS course (https://www.iitbhu.ac.in/dept/cse/people/rchowdarycse)
- Our institute and classmates, for their feedback and support

---


