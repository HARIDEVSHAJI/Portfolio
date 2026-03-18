from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import Admin, About, Contact
from app.auth import get_password_hash


def seed_admin(db: Session):
    """Seed default admin user if not exists."""
    existing = db.query(Admin).filter(Admin.username == "admin").first()
    if not existing:
        admin = Admin(
            username="admin",
            hashed_password=get_password_hash("admin123"),
        )
        db.add(admin)
        db.commit()
        print("[SEED] Admin user created: admin / admin123")
    else:
        print("[SEED] Admin user already exists.")


def seed_about(db: Session):
    """Seed default about entry if not exists."""
    existing = db.query(About).first()
    if not existing:
        about = About(
            title="Full Stack Developer",
            description="Passionate developer with expertise in building modern web applications.",
            subtitle="I build things for the web",
            years_experience=3,
            projects_completed=15,
            happy_clients=10,
        )
        db.add(about)
        db.commit()
        print("[SEED] About entry created.")


def seed_contact(db: Session):
    """Seed default contact entry if not exists."""
    existing = db.query(Contact).first()
    if not existing:
        contact = Contact(
            email="hello@portfolio.com",
            location="Your City, Country",
            github="https://github.com/yourusername",
            linkedin="https://linkedin.com/in/yourusername",
        )
        db.add(contact)
        db.commit()
        print("[SEED] Contact entry created.")


def run_seeds():
    db = SessionLocal()
    try:
        seed_admin(db)
        seed_about(db)
        seed_contact(db)
    finally:
        db.close()
