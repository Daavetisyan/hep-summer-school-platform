from pydantic import BaseModel
from typing import Any


class DetectorEventRequest(BaseModel):
    particle: str | None = None
    random_particle: bool = True


class DetectorEventResponse(BaseModel):
    event_id: int
    tracker_hit: bool
    ecal_energy: float
    hcal_energy: float
    muon_hit: bool
    missing_energy: float


class StudentClassificationRequest(BaseModel):
    event_id: int
    student_prediction: str


class StudentClassificationResponse(BaseModel):
    correct: bool
    true_particle: str
    student_prediction: str
    feedback: str
    explanation: str


class SubmitExperimentRunRequest(BaseModel):
    module_id: int
    simulation_type: str
    parameters_json: dict[str, Any]
    results_json: dict[str, Any]


class QuizSubmissionRequest(BaseModel):
    module_id: int
    question_id: str
    answer: str


class QuizSubmissionResponse(BaseModel):
    is_correct: bool
    score: float
    feedback: str
