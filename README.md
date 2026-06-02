# HEP Summer School Platform

A starter educational platform for Armenian 9th–12th grade students learning high-energy and particle physics.

The first implemented MVP module is **Day 9 — Detector and Event Display Simulator**.

## Core privacy rule

Students can see **only their own progress, answers, and scores**.

Teachers, mentors, and admins can see:
- class progress,
- individual student progress,
- quiz scores,
- exported class data.

This is enforced at the API authorization layer with role checks.

## Roles

- `student`: sees only own data
- `teacher`: sees all students in assigned classes
- `mentor`: same visibility as teacher
- `admin`: full platform access

## MVP modules included

- Day 9 detector simulation engine
- Quiz system
- Progress tracking
- CSV export
- ROOT export with `uproot`
- Role-based access-control structure
- Student-facing detector simulator, quiz, and private progress view

## Backend setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Open:

```text
http://127.0.0.1:8000/docs
```

## Frontend setup

The frontend is a Next.js application for the demo student account.

```bash
cd frontend
npm install
npm run dev
```

Set `NEXT_PUBLIC_API_BASE` if the backend is not running at `http://127.0.0.1:8000`.

## Important

This is a scaffold/MVP, not a finished production system. Before using with real students, add:
- account provisioning and password-reset flows,
- HTTPS,
- database migrations,
- persistent teacher-class assignment management,
- deployment security review.

## Authentication

Day 9 uses signed login sessions. The seeded classroom student account is:

```text
username: demo.student
password: learn-particles
```

Set `JWT_SECRET` in hosted environments. Optionally set `ADMIN_INITIAL_PASSWORD`
on the first deployment to create an `admin` bootstrap account, then rotate it.

## Deployment

`render.yaml` provisions the FastAPI backend and Postgres database on Render.
Deploy the `frontend/` directory to Vercel and set:

```text
NEXT_PUBLIC_API_BASE=https://your-api.onrender.com
```
