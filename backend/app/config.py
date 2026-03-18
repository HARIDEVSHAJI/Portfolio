import os
from pathlib import Path
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://portfolio:portfolio123@localhost:5432/portfolio_db"
    SECRET_KEY: str = "dev-secret-key-change-in-production"
    JWT_SECRET: str = "dev-jwt-secret-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    FRONTEND_URL: str = "http://localhost:3000"
    UPLOAD_DIR: str = str(Path(__file__).resolve().parent.parent.parent / "uploads")

    class Config:
        env_file = ".env"
        extra = "allow"


settings = Settings()

# Ensure upload directories exist
for sub in ["projects", "resume", "certificates"]:
    os.makedirs(os.path.join(settings.UPLOAD_DIR, sub), exist_ok=True)
