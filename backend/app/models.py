from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base


class Admin(Base):
    __tablename__ = "admins"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    tech_stack = Column(String(500), nullable=True)
    image_url = Column(String(500), nullable=True)
    live_url = Column(String(500), nullable=True)
    github_url = Column(String(500), nullable=True)
    featured = Column(Boolean, default=False)
    order = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    images = relationship("ProjectImage", back_populates="project", cascade="all, delete-orphan")


class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    category = Column(String(100), nullable=True)
    proficiency = Column(Integer, default=80)
    icon = Column(String(100), nullable=True)
    order = Column(Integer, default=0)


class About(Base):
    __tablename__ = "about"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=True)
    description = Column(Text, nullable=True)
    subtitle = Column(String(300), nullable=True)
    avatar_url = Column(String(500), nullable=True)
    years_experience = Column(Integer, default=0)
    projects_completed = Column(Integer, default=0)
    happy_clients = Column(Integer, default=0)


class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    file_path = Column(String(500), nullable=False)
    original_name = Column(String(300), nullable=True)
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())


class Certificate(Base):
    __tablename__ = "certificates"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    issuer = Column(String(200), nullable=True)
    date = Column(String(50), nullable=True)
    image_url = Column(String(500), nullable=True)
    credential_url = Column(String(500), nullable=True)
    order = Column(Integer, default=0)


class Contact(Base):
    __tablename__ = "contacts"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(200), nullable=True)
    phone = Column(String(50), nullable=True)
    location = Column(String(200), nullable=True)
    github = Column(String(300), nullable=True)
    linkedin = Column(String(300), nullable=True)
    twitter = Column(String(300), nullable=True)
    website = Column(String(300), nullable=True)


class ProjectImage(Base):
    __tablename__ = "project_images"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    image_url = Column(String(500), nullable=False)
    order = Column(Integer, default=0)

    project = relationship("Project", back_populates="images")


class Role(Base):
    __tablename__ = "roles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    order = Column(Integer, default=0)
