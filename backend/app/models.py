from datetime import datetime
from typing import Optional
from sqlmodel import Field, SQLModel, Column, JSON


class Student(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    grade: int
    class_id: int


class Module(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    day_number: int
    title: str
    description: str


class ExperimentRun(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    student_id: int = Field(index=True)
    module_id: int = Field(index=True)
    simulation_type: str
    parameters_json: dict = Field(sa_column=Column(JSON))
    results_json: dict = Field(sa_column=Column(JSON))
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class DetectorChallenge(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    student_id: int = Field(index=True)
    true_particle: str
    tracker_hit: bool
    ecal_energy: float
    hcal_energy: float
    muon_hit: bool
    missing_energy: float
    explanation: str
    created_at: datetime = Field(default_factory=datetime.utcnow)


class QuizAnswer(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    student_id: int = Field(index=True)
    module_id: int = Field(index=True)
    question_id: str
    answer: str
    is_correct: bool
    score: float
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class Progress(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    student_id: int = Field(index=True)
    module_id: int = Field(index=True)
    simulation_completed: bool = False
    quiz_completed: bool = False
    data_exported: bool = False
    score: float = 0.0
    updated_at: datetime = Field(default_factory=datetime.utcnow)
