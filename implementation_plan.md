# Full-Stack Portfolio Website — Implementation Plan

Production-ready personal portfolio with **Next.js 14 App Router + FastAPI + PostgreSQL**. Features advanced animations (Framer Motion, GSAP, Three.js), JWT-protected admin panel for full CRUD, file uploads, and environment-based deployment config.

## User Review Required

> [!IMPORTANT]
> **~80+ files** will be created in `c:\codes\Portfolio\` with `/frontend` and `/backend` subdirectories. The frontend uses `create-next-app` with TailwindCSS (user-requested). The backend is manually scaffolded.

> [!WARNING]
> **PostgreSQL required.** A `docker-compose.yml` is included for local Postgres. You need Docker installed, or point `DATABASE_URL` at an existing Postgres instance (Neon, Supabase, Railway, etc.).

> [!IMPORTANT]
> **Default admin creds**: `admin` / `admin123` — seeded on first run. Change in production.

---

## Proposed Changes

### Root Files

#### [NEW] [docker-compose.yml](file:///c:/codes/Portfolio/docker-compose.yml)
PostgreSQL 15 + pgAdmin services with env-based config

#### [NEW] [README.md](file:///c:/codes/Portfolio/README.md)
Setup instructions, env config, deployment guide for Vercel/Render/Railway

---

### Backend — FastAPI + PostgreSQL

#### [NEW] [requirements.txt](file:///c:/codes/Portfolio/backend/requirements.txt)
fastapi, uvicorn, sqlalchemy, alembic, psycopg2-binary, python-jose, passlib, python-multipart, python-dotenv, aiofiles, pydantic-settings

#### [NEW] [.env.example](file:///c:/codes/Portfolio/backend/.env.example)
DATABASE_URL, SECRET_KEY, JWT_SECRET, FRONTEND_URL, UPLOAD_DIR

#### [NEW] [app/\_\_init\_\_.py](file:///c:/codes/Portfolio/backend/app/__init__.py)
Empty init

#### [NEW] [app/config.py](file:///c:/codes/Portfolio/backend/app/config.py)
Pydantic `Settings` class reading from `.env`

#### [NEW] [app/database.py](file:///c:/codes/Portfolio/backend/app/database.py)
SQLAlchemy sync engine + SessionLocal + Base

#### [NEW] [app/models.py](file:///c:/codes/Portfolio/backend/app/models.py)
Tables: `Admin`, `Project`, `Skill`, `About`, `Resume`, `Certificate`, `Contact`

#### [NEW] [app/schemas.py](file:///c:/codes/Portfolio/backend/app/schemas.py)
Pydantic request/response models for all entities

#### [NEW] [app/auth.py](file:///c:/codes/Portfolio/backend/app/auth.py)
JWT token creation/verification, password hashing (bcrypt), login endpoint

#### [NEW] [app/dependencies.py](file:///c:/codes/Portfolio/backend/app/dependencies.py)
`get_db` session dependency, `get_current_admin` auth guard

#### [NEW] [app/routers/\_\_init\_\_.py](file:///c:/codes/Portfolio/backend/app/routers/__init__.py)

#### [NEW] [app/routers/projects.py](file:///c:/codes/Portfolio/backend/app/routers/projects.py)
GET/POST/PUT/DELETE projects with image upload

#### [NEW] [app/routers/skills.py](file:///c:/codes/Portfolio/backend/app/routers/skills.py)
GET/POST/PUT/DELETE skills

#### [NEW] [app/routers/about.py](file:///c:/codes/Portfolio/backend/app/routers/about.py)
GET/PUT about info

#### [NEW] [app/routers/resume.py](file:///c:/codes/Portfolio/backend/app/routers/resume.py)
POST upload resume PDF, GET download resume

#### [NEW] [app/routers/certificates.py](file:///c:/codes/Portfolio/backend/app/routers/certificates.py)
GET/POST/DELETE certificates with image upload

#### [NEW] [app/routers/contact.py](file:///c:/codes/Portfolio/backend/app/routers/contact.py)
GET/PUT contact info + social links

#### [NEW] [app/main.py](file:///c:/codes/Portfolio/backend/app/main.py)
FastAPI app: CORS middleware, static file mount for `/uploads`, all router includes, startup event to create tables + seed admin

#### [NEW] [app/seed.py](file:///c:/codes/Portfolio/backend/app/seed.py)
Seed default admin user (admin/admin123) if not exists

#### [NEW] [alembic.ini](file:///c:/codes/Portfolio/backend/alembic.ini) + [alembic/env.py](file:///c:/codes/Portfolio/backend/alembic/env.py)
Alembic migration config pointing to models

---

### Frontend — Next.js 14 + Tailwind + Animations

#### Project Init
`npx -y create-next-app@latest ./ --typescript --tailwind --eslint --app --src-dir --no-import-alias --use-npm`

#### Additional npm packages
`framer-motion three @react-three/fiber @react-three/drei gsap axios @types/three js-cookie @types/js-cookie`

#### [NEW] [tailwind.config.ts](file:///c:/codes/Portfolio/frontend/tailwind.config.ts)
Extended with custom animations, keyframes, glassmorphism utilities

#### [NEW] [src/app/globals.css](file:///c:/codes/Portfolio/frontend/src/app/globals.css)
Custom CSS: cursor glow, gradient animations, scrollbar, glassmorphism, matrix rain, floating

#### [NEW] [src/app/layout.tsx](file:///c:/codes/Portfolio/frontend/src/app/layout.tsx)
Root layout: dark theme body, Inter + JetBrains Mono fonts, metadata

#### [NEW] [src/app/page.tsx](file:///c:/codes/Portfolio/frontend/src/app/page.tsx)
Main portfolio page composing all sections with LoadingScreen gate

#### [NEW] [src/components/LoadingScreen.tsx](file:///c:/codes/Portfolio/frontend/src/components/LoadingScreen.tsx)
Terminal-style loading animation with code typing effect

#### [NEW] [src/components/CustomCursor.tsx](file:///c:/codes/Portfolio/frontend/src/components/CustomCursor.tsx)
Mouse-following glow dot with trail effect

#### [NEW] [src/components/ParticleBackground.tsx](file:///c:/codes/Portfolio/frontend/src/components/ParticleBackground.tsx)
Three.js animated particle field with mouse reactivity

#### [NEW] [src/components/Navbar.tsx](file:///c:/codes/Portfolio/frontend/src/components/Navbar.tsx)
Fixed glassmorphic navbar, smooth scroll, mobile hamburger

#### [NEW] [src/components/sections/Hero.tsx](file:///c:/codes/Portfolio/frontend/src/components/sections/Hero.tsx)
Animated terminal typing, floating code snippets, GSAP parallax on mouse, gradient text

#### [NEW] [src/components/sections/About.tsx](file:///c:/codes/Portfolio/frontend/src/components/sections/About.tsx)
Scroll-reveal with Framer Motion, glassmorphic card

#### [NEW] [src/components/sections/Skills.tsx](file:///c:/codes/Portfolio/frontend/src/components/sections/Skills.tsx)
Animated progress bars with stagger, category grouping

#### [NEW] [src/components/sections/Projects.tsx](file:///c:/codes/Portfolio/frontend/src/components/sections/Projects.tsx)
3D tilt cards with hover effects, image overlay, tech tags

#### [NEW] [src/components/sections/Resume.tsx](file:///c:/codes/Portfolio/frontend/src/components/sections/Resume.tsx)
Download button linked to API, timeline-style experience display

#### [NEW] [src/components/sections/Certificates.tsx](file:///c:/codes/Portfolio/frontend/src/components/sections/Certificates.tsx)
Certificate gallery grid with modal view

#### [NEW] [src/components/sections/Contact.tsx](file:///c:/codes/Portfolio/frontend/src/components/sections/Contact.tsx)
Contact info + social links, animated icons

#### [NEW] [src/lib/api.ts](file:///c:/codes/Portfolio/frontend/src/lib/api.ts)
Axios instance with base URL from env, interceptors for JWT

#### [NEW] [src/context/AuthContext.tsx](file:///c:/codes/Portfolio/frontend/src/context/AuthContext.tsx)
JWT auth context provider + `useAuth` hook + `ProtectedRoute` wrapper

#### [NEW] [src/app/admin/login/page.tsx](file:///c:/codes/Portfolio/frontend/src/app/admin/login/page.tsx)
Styled login form with JWT auth

#### [NEW] [src/app/admin/dashboard/page.tsx](file:///c:/codes/Portfolio/frontend/src/app/admin/dashboard/page.tsx)
Admin dashboard: tabbed CRUD interface for projects, skills, about, resume, certificates, contact

#### [NEW] [.env.example](file:///c:/codes/Portfolio/frontend/.env.example)
`NEXT_PUBLIC_API_URL` template

---

## Phase 7: UI Redesign & Architecture Change

### [Frontend Router/Layout]
#### [MODIFY] [page.tsx](file:///c:/codes/Portfolio/frontend/src/app/page.tsx)
Convert the continuous scrolling layout into a state-driven SPA where only one section (Home, About, Skills, etc.) is visible at a time. The active section will be controlled via URL hash or local state.

#### [MODIFY] [Navbar.tsx](file:///c:/codes/Portfolio/frontend/src/components/Navbar.tsx)
Update navigation links to trigger state changes instead of scrolling down the page.

### [Frontend Components & Spacing]
#### [MODIFY] [Hero, About, Skills, Projects, Resume, Certificates, Contact]
Increase vertical padding (`py-32` instead of `py-24`), adjust header font sizes, and improve alignment across all sections to ensure a more breathable, professional aesthetic.

### [Project Details Page]
#### [NEW] [src/app/project/[id]/page.tsx](file:///c:/codes/Portfolio/frontend/src/app/project/[id]/page.tsx)
Create a dedicated dynamic route for viewing a specific project. This page will display the project's cover image/screenshots, detailed description, technology stack tags, and prominent buttons for Live Demo and GitHub.

---

## Phase 8: Comprehensive UI Overhaul and DB Extensions

### Backend Updates
1. **New Models**: Create a `Role` table (id, name, order) and a `ProjectImage` table (id, project_id, image_url, order).
2. **API Routes**: Create CRUD endpoints for `Role` and extended endpoints for `Project` to handle multiple images. Include these in the FastAPI app.
3. **Database Migration**: Generate an alembic migration script to apply the schema updates.

### Frontend Navbar & Global Layout
1. **Navbar Fix**: Transform navigation to a professional full-width sticky header. Left-aligned logo, right-aligned menu items with equal spacing, smooth hover animations, and high-quality active state highlights. Remove "About" link.
2. **Global Alignment**: Ensure a centered container (`max-w-6xl` or `7xl`) is used consistently across all sections. Remove all `// SECTION` label tags and make typography polished.
3. **Merge About and Home**: Mount the `About` section beneath the `Hero` section when the Home view is active in the layout.

### Hero Section
1. Hardcode name to "Haridev Shaji" (not editable). Fetch rotating roles from the new API endpoint. Improve typing and snippet animation speeds.

### Admin Panel
1. Add a **Roles Tab** to add, edit, delete, and reorder roles.
2. Update **Projects Tab** to support uploading/deleting multiple images for a single project (a mini-gallery manager per project).

### Project Details & Gallery
1. **Project Details Page**: Update layout to use a responsive grid: Left side for image gallery slider (with pause-on-hover, click-to-zoom), Right side for title, description, and links. Use clean card layouts and limit max image sizes for a minimal, professional aesthetic.

---

## Verification Plan

### Automated Tests

1. **Backend startup check**
   ```
   cd c:\codes\Portfolio\backend
   pip install -r requirements.txt
   uvicorn app.main:app --host 0.0.0.0 --port 8000
   ```
   Verify: no import errors, server starts, logs "Uvicorn running"

2. **API docs load** — Use browser to verify `http://localhost:8000/docs` renders Swagger UI

3. **Frontend build check**
   ```
   cd c:\codes\Portfolio\frontend
   npm install
   npm run build
   ```
   Verify: build completes with no errors

4. **Frontend dev render** — Use browser to verify `http://localhost:3000` renders hero section with animations

### Manual Verification
1. Start Docker Compose for Postgres → verify connection
2. Run seed → verify admin user created
3. Login at `/admin` → verify JWT flow works
4. Test CRUD in admin panel (add project, upload image, verify it shows on public site)
5. Upload resume PDF → verify download button works
