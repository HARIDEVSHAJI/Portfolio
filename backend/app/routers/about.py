from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
import os
import shutil
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import About
from app.schemas import AboutResponse, AboutUpdate
from app.dependencies import get_current_admin

router = APIRouter(prefix="/api/about", tags=["About"])


@router.get("", response_model=AboutResponse)
def get_about(db: Session = Depends(get_db)):
    about = db.query(About).first()
    if not about:
        raise HTTPException(status_code=404, detail="About info not found")
    return about


@router.put("", response_model=AboutResponse)
def update_about(
    data: AboutUpdate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    about = db.query(About).first()
    if not about:
        about = About()
        db.add(about)
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(about, key, value)
    db.commit()
    db.refresh(about)
    return about


@router.post("/profile-image", response_model=AboutResponse)
def upload_profile_image(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    upload_dir = "uploads/profile"
    os.makedirs(upload_dir, exist_ok=True)
    
    file_path = f"{upload_dir}/{file.filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    about = db.query(About).first()
    if not about:
        about = About()
        db.add(about)
        
    about.avatar_url = f"/{file_path}"
    
    db.commit()
    db.refresh(about)
    return about
