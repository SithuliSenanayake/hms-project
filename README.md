# Hospital Management System (HMS)

A web-based Hospital Management System built as a university project, implementing core hospital operations: authentication with role-based access, patient management, appointment scheduling, and billing.

**Live demo:** [add your Vercel URL here]
**Test credentials:** see submission document (not included in this public repo for security)

## Tech Stack

- **Frontend:** React, React Router, React-Bootstrap
- **Backend:** Node.js, Express.js
- **Database:** MySQL
- **Authentication:** JWT (JSON Web Tokens) + bcrypt password hashing
- **Deployment:** Railway (backend + MySQL), Vercel (frontend)

## Features Implemented

### Authentication & Access Control
- Secure login with hashed passwords (bcrypt)
- JWT-based session management with 8-hour token expiry
- Role-based access control (Admin, Doctor, Receptionist)
- Protected routes on both frontend and backend
- Automatic session-expiry handling with redirect to login

### Patient Management
- Register new patients
- Search patients by name
- View and edit patient records (name, DOB, gender, phone, address)

### Appointment Management
- Book appointments linking a patient to a doctor
- View all appointments with patient/doctor names
- Reschedule appointments
- Track appointment status (scheduled / completed / cancelled)

### Billing
- Generate bills linked to a patient (optionally linked to an appointment)
- Record payments (mark bills as paid)
- View billing history with paid/unpaid status
- Input validation (bill amounts cannot be zero or negative)

### Dashboard
- Live summary cards: total patients, today's appointments, revenue collected, unpaid bill count

## Project Structure

```
hms-project/
├── client/          # React frontend
│   └── src/
│       ├── pages/       # Login, Dashboard, Patients, Appointments, Billing
│       ├── components/  # AppNavbar, ProtectedRoute
│       └── services/    # API call logic (axios)
├── server/          # Express backend
│   ├── routes/       # auth, patients, doctors, appointments, bills
│   ├── middleware/   # JWT verification, role checking
│   └── db.js         # MySQL connection pool
```

## Database Schema

Five core tables: `users`, `doctors`, `patients`, `appointments`, `bills`, with foreign key relationships linking appointments to patients/doctors, and bills to patients/appointments.

## Running Locally

**Backend:**
```bash
cd server
npm install
# create a .env file with DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, JWT_SECRET, PORT
npm run dev
```

**Frontend:**
```bash
cd client
npm install
npm start
```

## Scope Notes

This project was built against a full Hospital Management System specification covering ten modules (patient, doctor, appointment, EMR, laboratory, pharmacy, billing, staff, reports, and more). Given the project timeframe, development was intentionally scoped to four core modules — Authentication, Patient Management, Appointment Management, and Billing — to ensure a fully functional, well-tested system rather than a partially-working full-scope build.

**Not implemented (future work):**
- Electronic Medical Records
- Laboratory Management
- Pharmacy Management
- Staff Management (beyond basic user roles)
- Reports & Analytics module
- Audit logs

These modules were deliberately excluded due to time constraints and are documented here as a conscious scoping decision rather than an oversight.
