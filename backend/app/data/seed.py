from sqlmodel import Session, select
from app.database import engine
from app.models import Module, Student


def seed_database():
    with Session(engine) as session:
        existing_modules = session.exec(select(Module)).first()
        if not existing_modules:
            modules = [
                Module(day_number=1, title="Scale of Matter", description="From humans to quarks."),
                Module(day_number=2, title="Collisions and Conservation Laws", description="Energy and momentum."),
                Module(day_number=4, title="Radioactive Decay", description="Half-life and randomness."),
                Module(day_number=8, title="Accelerators", description="Electric and magnetic fields."),
                Module(day_number=9, title="Detector Event Simulator", description="Classify particles from detector signals."),
            ]
            session.add_all(modules)

        existing_students = session.exec(select(Student)).first()
        if not existing_students:
            session.add_all([
                Student(id=1, name="Demo Student", grade=10, class_id=101),
                Student(id=2, name="Ani Example", grade=11, class_id=101),
                Student(id=3, name="Aram Example", grade=12, class_id=101),
            ])

        session.commit()
