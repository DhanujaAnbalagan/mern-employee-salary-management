# MERN Employee Salary Management (SIPEKA)

A full-stack HRMS built with **MongoDB / MySQL · Express · React · Node.js**.

---

## Setup

```bash
# Backend
cd Backend
npm install
npm start          # runs on http://localhost:5000

# Frontend
cd Frontend
npm install
npm run dev        # runs on http://localhost:5173
```

---

## Features

| Feature | Description |
|---|---|
| Employee Management | CRUD with photo upload, status, and role |
| Attendance (Kehadiran) | Monthly attendance tracking per employee |
| Salary Calculation | Auto-calculates base + allowances − deductions |
| Payslip / Reports | Printable PDF payslips and salary reports |
| **Overtime Entry (Lembur)** | Form with full validation (hours 1–6, date window, reason ≥ 10 chars, monthly cap 60 hrs) |
| **LF-101 Date Format** | All print pages and employee list now show DD/MM/YYYY |
| **LF-102 Salary Validation** | Negative salary rejected on frontend (Swal alert) and backend (400 response) |
| **LF-103 Designation Field** | Dropdown (Mason / Electrician / Plumber / Supervisor / Helper) in Add Employee form; column visible in employee list |
| **LF-104 CSV Export** | One-click Download CSV button on employee list page |
| **LF-105 Mobile Layout** | Table containers use `overflow-x: auto` for horizontal scroll on small screens |

---

## API Endpoints

```
POST   /api/overtime          ← in-memory, no DB required
GET    /api/overtime

POST   /data_lembur           ← planned DB endpoint
GET    /data_lembur
```

---

## AI Usage

Used AI assistance to:
- Scaffold Redux boilerplate (actions, reducers, barrel exports) following existing project patterns
- Generate the in-memory Express overtime route with all 4 validation rules
- Speed up repetitive JSX edits across PrintPdf components

Manually reviewed and corrected:
- Field naming mismatch between frontend payload and backend destructuring
- `toDateOnly()` timezone edge case in date validation
- Ensured `finally` block re-enables the submit button on network error
- Verified dual validation (frontend UX + backend data integrity) before shipping each ticket
