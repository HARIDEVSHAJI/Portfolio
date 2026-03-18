# Portfolio — Full Stack Personal Website

Production-ready portfolio website built with **Next.js 14** + **FastAPI** + **PostgreSQL**.

## ✨ Features

- 🎨 **Stunning animations** — Three.js particles, GSAP parallax, Framer Motion, terminal typing effect
- 🔒 **JWT admin panel** — Full CRUD for projects, skills, about, resume, certificates, contact
- 📁 **File uploads** — Project images, resume PDF, certificate images
- 🚀 **Deploy-ready** — Environment-based config for Vercel, Render, Railway, Neon, Supabase

## 📁 Project Structure

```
portfolio/
├── frontend/          # Next.js 14 (TypeScript, Tailwind, Framer Motion, GSAP, Three.js)
├── backend/           # FastAPI (SQLAlchemy, Alembic, JWT, Pydantic)
├── uploads/           # Uploaded files (projects, resume, certificates)
├── docker-compose.yml # PostgreSQL + pgAdmin
└── README.md
```

## 🚀 Quick Start

### 1. Start PostgreSQL

```bash
docker compose up -d
```

Or point `DATABASE_URL` in `backend/.env` to any existing Postgres instance.

### 2. Backend

```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
# Edit .env with your settings

uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

API docs → http://localhost:8000/docs

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with your API URL

npm run dev
```

Portfolio → http://localhost:3000
Admin → http://localhost:3000/admin

### Default Admin Credentials

```
Username: admin
Password: admin123
```

> ⚠️ Change these immediately in production!

## 🌐 Deployment

### Frontend (Vercel)

1. Push `frontend/` to GitHub
2. Import in Vercel
3. Set env: `NEXT_PUBLIC_API_URL=https://your-backend.com`

### Backend (Render/Railway)

1. Push `backend/` to GitHub
2. Set env vars: `DATABASE_URL`, `SECRET_KEY`, `JWT_SECRET`, `FRONTEND_URL`
3. Start command: `uvicorn app.main:app --host 0.0.0.0 --port 8000`

### Database (Neon/Supabase)

1. Create a PostgreSQL database
2. Copy the connection string → set as `DATABASE_URL`

## 🔧 Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `SECRET_KEY` | App secret key |
| `JWT_SECRET` | JWT signing secret |
| `JWT_ALGORITHM` | Default: HS256 |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Default: 1440 (24h) |
| `FRONTEND_URL` | Frontend origin for CORS |
| `UPLOAD_DIR` | Path to uploads directory |

### Frontend (`frontend/.env.local`)

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend API URL |

## 📝 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/login` | ❌ | Admin login |
| GET | `/api/projects` | ❌ | List projects |
| POST | `/api/projects` | ✅ | Create project |
| PUT | `/api/projects/:id` | ✅ | Update project |
| DELETE | `/api/projects/:id` | ✅ | Delete project |
| GET | `/api/skills` | ❌ | List skills |
| POST | `/api/skills` | ✅ | Create skill |
| PUT | `/api/skills/:id` | ✅ | Update skill |
| DELETE | `/api/skills/:id` | ✅ | Delete skill |
| GET | `/api/about` | ❌ | Get about info |
| PUT | `/api/about` | ✅ | Update about |
| GET | `/api/resume` | ❌ | Get resume info |
| GET | `/api/resume/download` | ❌ | Download PDF |
| POST | `/api/resume` | ✅ | Upload resume |
| GET | `/api/certificates` | ❌ | List certificates |
| POST | `/api/certificates` | ✅ | Add certificate |
| DELETE | `/api/certificates/:id` | ✅ | Delete certificate |
| GET | `/api/contact` | ❌ | Get contact info |
| PUT | `/api/contact` | ✅ | Update contact |

## Tech Stack

**Frontend:** Next.js 14, React, TypeScript, Tailwind CSS, Framer Motion, GSAP, Three.js, Axios
**Backend:** FastAPI, SQLAlchemy, Alembic, PostgreSQL, JWT, Pydantic, Python
