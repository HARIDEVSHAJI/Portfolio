import os
import uuid
import shutil
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Resume
from app.schemas import ResumeResponse
from app.dependencies import get_current_admin
from app.config import settings

router = APIRouter(prefix="/api/resume", tags=["Resume"])


@router.get("", response_model=ResumeResponse)
def get_resume(db: Session = Depends(get_db)):
    resume = db.query(Resume).order_by(Resume.id.desc()).first()
    if not resume:
        raise HTTPException(status_code=404, detail="No resume uploaded")
    return resume


@router.get("/download")
def download_resume(db: Session = Depends(get_db)):
    resume = db.query(Resume).order_by(Resume.id.desc()).first()
    if not resume:
        raise HTTPException(status_code=404, detail="No resume uploaded")
    full_path = os.path.join(settings.UPLOAD_DIR, "resume", os.path.basename(resume.file_path))
    if not os.path.exists(full_path):
        raise HTTPException(status_code=404, detail="Resume file not found on disk")
    return FileResponse(
        path=full_path,
        filename=resume.original_name or "resume.pdf",
        media_type="application/pdf",
    )


@router.post("", response_model=ResumeResponse)
def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    ext = os.path.splitext(file.filename)[1]
    filename = f"{uuid.uuid4().hex}{ext}"
    filepath = os.path.join(settings.UPLOAD_DIR, "resume", filename)
    with open(filepath, "wb") as f:
        shutil.copyfileobj(file.file, f)

    resume = Resume(
        file_path=f"/uploads/resume/{filename}",
        original_name=file.filename,
    )
    db.add(resume)
    db.commit()
    db.refresh(resume)
    return resume
