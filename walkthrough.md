# Portfolio Website — Walkthrough

## What Was Built

A production-ready full-stack portfolio website with **80+ files** across two main directories:

### Backend (`backend/`) — FastAPI + PostgreSQL
- **7 database tables**: Admin, Project, Skill, About, Resume, Certificate, Contact
- **JWT authentication** with bcrypt password hashing
- **6 API routers** with full CRUD + file upload support
- **Alembic** migration setup
- **Auto-seed** of admin user on startup
- **Static file serving** for uploads

### Frontend (`frontend/`) — Next.js 14 + Animations
- **Loading screen** — Terminal-style typing animation with progress bar
- **Custom cursor** — Cyan glow dot with trailing effect, color shift on hover
- **Particle background** — 2000 Three.js particles with mouse reactivity
- **Hero section** — GSAP parallax, floating code snippets, typing role effect, terminal card
- **About section** — API-driven stats cards with scroll-reveal
- **Skills section** — Animated progress bars grouped by category
- **Projects section** — Hover cards with image overlay, tech tags, featured badges
- **Resume section** — PDF download from API
- **Certificates section** — Gallery with click-to-modal viewer
- **Contact section** — Email/phone/location cards, SVG social icons
- **Glassmorphic navbar** — Active section tracking, mobile hamburger
- **Admin login** — Terminal-style JWT login form
- **Admin dashboard** — Tabbed CRUD for all 6 entities with toast notifications

## Verification Results

### Frontend Build ✅
```
✓ Generating static pages (7/7)
Exit code: 0
```

All 7 pages compiled and generated successfully:
- `/` → Portfolio homepage
- `/admin` → Redirect to login
- `/admin/login` → JWT login form
- `/admin/dashboard` → Protected CRUD dashboard

## How to Run

### 1. Start PostgreSQL
```bash
docker compose up -d
```

### 2. Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```

### Default Admin: [admin](file:///c:/codes/Portfolio/backend/app/seed.py#7-20) / `admin123`
