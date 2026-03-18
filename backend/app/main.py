from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
import os

from app.config import settings
from app.database import engine, Base, get_db
from app.models import Admin
from app.auth import verify_password, create_access_token
from app.schemas import LoginRequest, TokenResponse
from app.seed import run_seeds

from app.routers import projects, skills, about, resume, certificates, contact, roles


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create all tables on startup
    Base.metadata.create_all(bind=engine)
    # Run seeds
    run_seeds()
    yield


app = FastAPI(
    title="Portfolio API",
    description="Backend API for personal portfolio website",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS
origins = [
    settings.FRONTEND_URL,
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount uploads as static files
uploads_path = settings.UPLOAD_DIR
if os.path.exists(uploads_path):
    app.mount("/uploads", StaticFiles(directory=uploads_path), name="uploads")


# ─── Auth endpoint ────────────────────────────────────
@app.post("/api/login", response_model=TokenResponse, tags=["Auth"])
def login(data: LoginRequest, db: Session = Depends(get_db)):
    admin = db.query(Admin).filter(Admin.username == data.username).first()
    if not admin or not verify_password(data.password, admin.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token(data={"sub": admin.username})
    return TokenResponse(access_token=token)


# ─── Health check ─────────────────────────────────────
@app.get("/api/health", tags=["Health"])
def health_check():
    return {"status": "ok", "message": "Portfolio API is running"}


# ─── Include routers ──────────────────────────────────
app.include_router(projects.router)
app.include_router(skills.router)
app.include_router(about.router)
app.include_router(resume.router)
app.include_router(certificates.router)
app.include_router(contact.router)
app.include_router(roles.router)
