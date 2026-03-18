import os
import uuid
import shutil
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models import Project, ProjectImage
from app.schemas import ProjectResponse, ProjectCreate, ProjectUpdate, ProjectImageResponse
from app.dependencies import get_current_admin
from app.config import settings

router = APIRouter(prefix="/api/projects", tags=["Projects"])


@router.get("", response_model=List[ProjectResponse])
def get_projects(db: Session = Depends(get_db)):
    return db.query(Project).order_by(Project.order.asc(), Project.id.desc()).all()


@router.get("/{project_id}", response_model=ProjectResponse)
def get_project(project_id: int, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.post("", response_model=ProjectResponse)
def create_project(
    title: str = Form(...),
    description: Optional[str] = Form(None),
    tech_stack: Optional[str] = Form(None),
    live_url: Optional[str] = Form(None),
    github_url: Optional[str] = Form(None),
    featured: bool = Form(False),
    order: int = Form(0),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    image_url = None
    if image and image.filename:
        ext = os.path.splitext(image.filename)[1]
        filename = f"{uuid.uuid4().hex}{ext}"
        filepath = os.path.join(settings.UPLOAD_DIR, "projects", filename)
        with open(filepath, "wb") as f:
            shutil.copyfileobj(image.file, f)
        image_url = f"/uploads/projects/{filename}"

    project = Project(
        title=title,
        description=description,
        tech_stack=tech_stack,
        image_url=image_url,
        live_url=live_url,
        github_url=github_url,
        featured=featured,
        order=order,
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


@router.put("/{project_id}", response_model=ProjectResponse)
def update_project(
    project_id: int,
    title: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    tech_stack: Optional[str] = Form(None),
    live_url: Optional[str] = Form(None),
    github_url: Optional[str] = Form(None),
    featured: bool = Form(False),
    order: int = Form(0),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    if title is not None:
        project.title = title
    if description is not None:
        project.description = description
    if tech_stack is not None:
        project.tech_stack = tech_stack
    if live_url is not None:
        project.live_url = live_url
    if github_url is not None:
        project.github_url = github_url
    project.featured = featured
    project.order = order

    if image and image.filename:
        ext = os.path.splitext(image.filename)[1]
        filename = f"{uuid.uuid4().hex}{ext}"
        filepath = os.path.join(settings.UPLOAD_DIR, "projects", filename)
        with open(filepath, "wb") as f:
            shutil.copyfileobj(image.file, f)
        project.image_url = f"/uploads/projects/{filename}"

    db.commit()
    db.refresh(project)
    return project


@router.delete("/{project_id}")
def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    db.delete(project)
    db.commit()
    return {"detail": "Project deleted"}


@router.post("/{project_id}/images", response_model=ProjectImageResponse)
def upload_project_image(
    project_id: int,
    image: UploadFile = File(...),
    order: int = Form(0),
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    ext = os.path.splitext(image.filename)[1]
    filename = f"{uuid.uuid4().hex}{ext}"
    filepath = os.path.join(settings.UPLOAD_DIR, "projects", filename)
    with open(filepath, "wb") as f:
        shutil.copyfileobj(image.file, f)
    image_url = f"/uploads/projects/{filename}"

    project_image = ProjectImage(project_id=project_id, image_url=image_url, order=order)
    db.add(project_image)
    db.commit()
    db.refresh(project_image)
    return project_image


@router.delete("/images/{image_id}")
def delete_project_image(
    image_id: int,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    project_image = db.query(ProjectImage).filter(ProjectImage.id == image_id).first()
    if not project_image:
        raise HTTPException(status_code=404, detail="Image not found")
    
    db.delete(project_image)
    db.commit()
    return {"detail": "Image deleted"}
