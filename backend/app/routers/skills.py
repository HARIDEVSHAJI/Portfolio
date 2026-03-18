from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import Skill
from app.schemas import SkillResponse, SkillCreate, SkillUpdate
from app.dependencies import get_current_admin

router = APIRouter(prefix="/api/skills", tags=["Skills"])


@router.get("", response_model=List[SkillResponse])
def get_skills(db: Session = Depends(get_db)):
    return db.query(Skill).order_by(Skill.order.asc(), Skill.id.asc()).all()


@router.post("", response_model=SkillResponse)
def create_skill(
    skill: SkillCreate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    db_skill = Skill(**skill.model_dump())
    db.add(db_skill)
    db.commit()
    db.refresh(db_skill)
    return db_skill


@router.put("/{skill_id}", response_model=SkillResponse)
def update_skill(
    skill_id: int,
    skill: SkillUpdate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    db_skill = db.query(Skill).filter(Skill.id == skill_id).first()
    if not db_skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    for key, value in skill.model_dump(exclude_unset=True).items():
        setattr(db_skill, key, value)
    db.commit()
    db.refresh(db_skill)
    return db_skill


@router.delete("/{skill_id}")
def delete_skill(
    skill_id: int,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    db_skill = db.query(Skill).filter(Skill.id == skill_id).first()
    if not db_skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    db.delete(db_skill)
    db.commit()
    return {"detail": "Skill deleted"}
