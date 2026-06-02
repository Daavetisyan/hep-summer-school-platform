from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.database import get_session
from app.models import ExperimentRun, Progress, Student
from app.schemas import SubmitExperimentRunRequest
from app.core.security import CurrentUser, get_current_user, enforce_student_visibility, enforce_class_visibility

router = APIRouter(prefix="/progress", tags=["progress"])


@router.post("/submit-run")
def submit_experiment_run(
    request: SubmitExperimentRunRequest,
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    # Student submissions are saved under their own user_id.
    run = ExperimentRun(
        student_id=user.user_id,
        module_id=request.module_id,
        simulation_type=request.simulation_type,
        parameters_json=request.parameters_json,
        results_json=request.results_json,
    )
    session.add(run)

    progress = session.exec(
        select(Progress).where(
            Progress.student_id == user.user_id,
            Progress.module_id == request.module_id
        )
    ).first()

    if not progress:
        progress = Progress(student_id=user.user_id, module_id=request.module_id)

    progress.simulation_completed = True
    progress.updated_at = datetime.utcnow()
    session.add(progress)
    session.commit()
    return {"status": "saved", "privacy": "Only you and teacher-like roles can view this record."}


@router.get("/student/{student_id}")
def get_student_progress(
    student_id: int,
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    # Critical privacy enforcement.
    student = session.get(Student, student_id)
    enforce_student_visibility(user, student_id, student.class_id if student else None)

    records = session.exec(select(Progress).where(Progress.student_id == student_id)).all()
    return records


@router.get("/class/{class_id}")
def get_class_progress(
    class_id: int,
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    # Students are blocked from class dashboard.
    enforce_class_visibility(user, class_id)

    records = session.exec(
        select(Progress).join(Student, Student.id == Progress.student_id).where(Student.class_id == class_id)
    ).all()
    return {
        "class_id": class_id,
        "records": records,
        "visibility": "teacher_or_mentor_only"
    }
