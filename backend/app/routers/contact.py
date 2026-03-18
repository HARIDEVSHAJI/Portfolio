from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Contact
from app.schemas import ContactResponse, ContactUpdate
from app.dependencies import get_current_admin

router = APIRouter(prefix="/api/contact", tags=["Contact"])


@router.get("", response_model=ContactResponse)
def get_contact(db: Session = Depends(get_db)):
    contact = db.query(Contact).first()
    if not contact:
        raise HTTPException(status_code=404, detail="Contact info not found")
    return contact


@router.put("", response_model=ContactResponse)
def update_contact(
    data: ContactUpdate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    contact = db.query(Contact).first()
    if not contact:
        contact = Contact()
        db.add(contact)
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(contact, key, value)
    db.commit()
    db.refresh(contact)
    return contact
