from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


# ─── Auth ─────────────────────────────────────────────
class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


# ─── Project ─────────────────────────────────────────
class ProjectBase(BaseModel):
    title: str
    description: Optional[str] = None
    tech_stack: Optional[str] = None
    image_url: Optional[str] = None
    live_url: Optional[str] = None
    github_url: Optional[str] = None
    featured: bool = False
    order: int = 0


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(ProjectBase):
    title: Optional[str] = None


class ProjectImageResponse(BaseModel):
    id: int
    project_id: int
    image_url: str
    order: int

    class Config:
        from_attributes = True


class ProjectResponse(ProjectBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    images: List[ProjectImageResponse] = []

    class Config:
        from_attributes = True


# ─── Role ──────────────────────────────────────────────
class RoleBase(BaseModel):
    name: str
    order: int = 0

class RoleCreate(RoleBase):
    pass

class RoleUpdate(RoleBase):
    name: Optional[str] = None

class RoleResponse(RoleBase):
    id: int

    class Config:
        from_attributes = True


# ─── Skill ────────────────────────────────────────────
class SkillBase(BaseModel):
    name: str
    category: Optional[str] = None
    proficiency: int = 80
    icon: Optional[str] = None
    order: int = 0


class SkillCreate(SkillBase):
    pass


class SkillUpdate(SkillBase):
    name: Optional[str] = None


class SkillResponse(SkillBase):
    id: int

    class Config:
        from_attributes = True


# ─── About ────────────────────────────────────────────
class AboutBase(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    subtitle: Optional[str] = None
    avatar_url: Optional[str] = None
    years_experience: int = 0
    projects_completed: int = 0
    happy_clients: int = 0


class AboutUpdate(AboutBase):
    pass


class AboutResponse(AboutBase):
    id: int

    class Config:
        from_attributes = True


# ─── Resume ───────────────────────────────────────────
class ResumeResponse(BaseModel):
    id: int
    file_path: str
    original_name: Optional[str] = None
    uploaded_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ─── Certificate ─────────────────────────────────────
class CertificateBase(BaseModel):
    title: str
    issuer: Optional[str] = None
    date: Optional[str] = None
    image_url: Optional[str] = None
    credential_url: Optional[str] = None
    order: int = 0


class CertificateCreate(CertificateBase):
    pass


class CertificateResponse(CertificateBase):
    id: int

    class Config:
        from_attributes = True


# ─── Contact ─────────────────────────────────────────
class ContactBase(BaseModel):
    email: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    github: Optional[str] = None
    linkedin: Optional[str] = None
    twitter: Optional[str] = None
    website: Optional[str] = None


class ContactUpdate(ContactBase):
    pass


class ContactResponse(ContactBase):
    id: int

    class Config:
        from_attributes = True
