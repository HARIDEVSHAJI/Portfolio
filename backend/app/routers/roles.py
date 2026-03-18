from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import Role
from app.schemas import RoleCreate, RoleResponse, RoleUpdate
from app.dependencies import get_current_admin

router = APIRouter(prefix="/api/roles", tags=["Roles"])

@router.get("/", response_model=List[RoleResponse])
def get_roles(db: Session = Depends(get_db)):
    return db.query(Role).order_by(Role.order.asc(), Role.id.asc()).all()

@router.post("/", response_model=RoleResponse)
def create_role(role: RoleCreate, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    db_role = Role(**role.model_dump())
    db.add(db_role)
    db.commit()
    db.refresh(db_role)
    return db_role

@router.put("/{role_id}", response_model=RoleResponse)
def update_role(role_id: int, role: RoleUpdate, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    db_role = db.query(Role).filter(Role.id == role_id).first()
    if not db_role:
        raise HTTPException(status_code=404, detail="Role not found")
    
    for key, value in role.model_dump(exclude_unset=True).items():
        setattr(db_role, key, value)
        
    db.commit()
    db.refresh(db_role)
    return db_role

@router.delete("/{role_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_role(role_id: int, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    db_role = db.query(Role).filter(Role.id == role_id).first()
    if not db_role:
        raise HTTPException(status_code=404, detail="Role not found")
        
    db.delete(db_role)
    db.commit()
