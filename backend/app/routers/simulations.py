from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from app.core.security import CurrentUser, get_current_user
from app.database import get_session
from app.models import DetectorChallenge
from app.physics.detector import PARTICLES, generate_detector_event, check_student_prediction
from app.schemas import (
    DetectorEventRequest,
    DetectorEventResponse,
    StudentClassificationRequest,
    StudentClassificationResponse,
)

router = APIRouter(prefix="/simulations", tags=["simulations"])


@router.post("/day9/detector-event", response_model=DetectorEventResponse)
def create_detector_event(
    request: DetectorEventRequest,
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    # All roles may generate events. This does not reveal grades.
    try:
        particle = None if request.random_particle else request.particle
        event = generate_detector_event(event_id=0, particle=particle)
        challenge = DetectorChallenge(
            student_id=user.user_id,
            true_particle=event.true_particle,
            tracker_hit=event.tracker_hit,
            ecal_energy=event.ecal_energy,
            hcal_energy=event.hcal_energy,
            muon_hit=event.muon_hit,
            missing_energy=event.missing_energy,
            explanation=event.explanation,
        )
        session.add(challenge)
        session.commit()
        session.refresh(challenge)
        return DetectorEventResponse(
            event_id=challenge.id,
            tracker_hit=challenge.tracker_hit,
            ecal_energy=challenge.ecal_energy,
            hcal_energy=challenge.hcal_energy,
            muon_hit=challenge.muon_hit,
            missing_energy=challenge.missing_energy,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))


@router.post("/day9/check-classification", response_model=StudentClassificationResponse)
def check_classification(
    request: StudentClassificationRequest,
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    challenge = session.get(DetectorChallenge, request.event_id)
    if not challenge or challenge.student_id != user.user_id:
        raise HTTPException(status_code=404, detail="Detector event not found.")
    if request.student_prediction not in PARTICLES:
        raise HTTPException(status_code=400, detail="Unknown particle prediction.")
    event_dict = {
        "true_particle": challenge.true_particle,
        "tracker_hit": challenge.tracker_hit,
        "ecal_energy": challenge.ecal_energy,
        "hcal_energy": challenge.hcal_energy,
        "muon_hit": challenge.muon_hit,
        "missing_energy": challenge.missing_energy,
    }
    correct, feedback = check_student_prediction(event_dict, request.student_prediction)
    return StudentClassificationResponse(
        correct=correct,
        true_particle=event_dict["true_particle"],
        student_prediction=request.student_prediction,
        feedback=feedback,
        explanation=challenge.explanation,
    )
