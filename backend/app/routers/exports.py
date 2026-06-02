from pathlib import Path
from fastapi import APIRouter, Depends
from fastapi.responses import FileResponse
from sqlmodel import Session, select
from app.database import get_session
from app.models import ExperimentRun, Progress, Student
from app.core.security import CurrentUser, get_current_user, enforce_student_visibility, enforce_class_visibility
from app.exporters.csv_export import experiment_runs_to_csv
from app.exporters.root_export import experiment_runs_to_root

router = APIRouter(prefix="/exports", tags=["exports"])

EXPORT_DIR = Path("exports")
EXPORT_DIR.mkdir(exist_ok=True)


@router.get("/student/{student_id}/csv")
def export_student_csv(
    student_id: int,
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    student = session.get(Student, student_id)
    enforce_student_visibility(user, student_id, student.class_id if student else None)
    rows = session.exec(select(ExperimentRun).where(ExperimentRun.student_id == student_id)).all()
    output_path = EXPORT_DIR / f"student_{student_id}_runs.csv"
    experiment_runs_to_csv(rows, str(output_path))

    progress_rows = session.exec(select(Progress).where(Progress.student_id == student_id)).all()
    for p in progress_rows:
        p.data_exported = True
        session.add(p)
    session.commit()

    return FileResponse(str(output_path), filename=output_path.name)


@router.get("/class/{class_id}/csv")
def export_class_csv(
    class_id: int,
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    enforce_class_visibility(user, class_id)
    rows = session.exec(
        select(ExperimentRun).join(Student, Student.id == ExperimentRun.student_id).where(Student.class_id == class_id)
    ).all()
    output_path = EXPORT_DIR / f"class_{class_id}_runs.csv"
    experiment_runs_to_csv(rows, str(output_path))
    return FileResponse(str(output_path), filename=output_path.name)


@router.get("/class/{class_id}/root")
def export_class_root(
    class_id: int,
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    enforce_class_visibility(user, class_id)
    rows = session.exec(
        select(ExperimentRun).join(Student, Student.id == ExperimentRun.student_id).where(Student.class_id == class_id)
    ).all()
    output_path = EXPORT_DIR / f"class_{class_id}_runs.root"
    experiment_runs_to_root(rows, str(output_path))
    return FileResponse(str(output_path), filename=output_path.name)
