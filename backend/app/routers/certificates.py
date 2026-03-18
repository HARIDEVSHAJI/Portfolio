import os
import uuid
import shutil
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models import Certificate
from app.schemas import CertificateResponse
from app.dependencies import get_current_admin
from app.config import settings

router = APIRouter(prefix="/api/certificates", tags=["Certificates"])


@router.get("", response_model=List[CertificateResponse])
def get_certificates(db: Session = Depends(get_db)):
    return db.query(Certificate).order_by(Certificate.order.asc(), Certificate.id.desc()).all()


@router.post("", response_model=CertificateResponse)
def create_certificate(
    title: str = Form(...),
    issuer: Optional[str] = Form(None),
    date: Optional[str] = Form(None),
    credential_url: Optional[str] = Form(None),
    order: int = Form(0),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    image_url = None
    if image and image.filename:
        ext = os.path.splitext(image.filename)[1]
        filename = f"{uuid.uuid4().hex}{ext}"
        filepath = os.path.join(settings.UPLOAD_DIR, "certificates", filename)
        with open(filepath, "wb") as f:
            shutil.copyfileobj(image.file, f)
        image_url = f"/uploads/certificates/{filename}"

    cert = Certificate(
        title=title,
        issuer=issuer,
        date=date,
        image_url=image_url,
        credential_url=credential_url,
        order=order,
    )
    db.add(cert)
    db.commit()
    db.refresh(cert)
    return cert


@router.delete("/{cert_id}")
def delete_certificate(
    cert_id: int,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    cert = db.query(Certificate).filter(Certificate.id == cert_id).first()
    if not cert:
        raise HTTPException(status_code=404, detail="Certificate not found")
    db.delete(cert)
    db.commit()
    return {"detail": "Certificate deleted"}
