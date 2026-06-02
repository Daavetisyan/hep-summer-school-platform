from datetime import datetime
from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from app.database import get_session
from app.models import QuizAnswer, Progress, Student
from app.schemas import QuizSubmissionRequest, QuizSubmissionResponse
from app.core.security import CurrentUser, get_current_user, enforce_student_visibility, enforce_class_visibility

router = APIRouter(prefix="/quizzes", tags=["quizzes"])


QUESTION_BANK = {
    "day9_q1": {
        "module_id": 9,
        "question": "Which detector signal best identifies a muon?",
        "answer": "track plus muon hit",
        "keywords": ["track", "muon"],
        "feedback": "A muon usually leaves a charged track and reaches the muon system."
    },
    "day9_q2": {
        "module_id": 9,
        "question": "What signal suggests a photon?",
        "answer": "no track plus ECAL energy",
        "keywords": ["no track", "ecal"],
        "feedback": "A photon has no charged track but deposits energy in the electromagnetic calorimeter."
    },
}


@router.get("/module/{module_id}/questions")
def get_questions(module_id: int):
    return [
        {"question_id": qid, "question": item["question"]}
        for qid, item in QUESTION_BANK.items()
        if item["module_id"] == module_id
    ]


@router.post("/submit", response_model=QuizSubmissionResponse)
def submit_quiz_answer(
    request: QuizSubmissionRequest,
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    item = QUESTION_BANK.get(request.question_id)
    if not item:
        return QuizSubmissionResponse(is_correct=False, score=0, feedback="Unknown question.")
    if item["module_id"] != request.module_id:
        return QuizSubmissionResponse(is_correct=False, score=0, feedback="Question does not belong to this module.")

    normalized = request.answer.strip().lower()
    is_correct = all(keyword in normalized for keyword in item["keywords"])
    score = 1.0 if is_correct else 0.0

    answer = QuizAnswer(
        student_id=user.user_id,
        module_id=request.module_id,
        question_id=request.question_id,
        answer=request.answer,
        is_correct=is_correct,
        score=score,
    )
    session.add(answer)

    progress = session.exec(
        select(Progress).where(
            Progress.student_id == user.user_id,
            Progress.module_id == request.module_id
        )
    ).first()
    if not progress:
        progress = Progress(student_id=user.user_id, module_id=request.module_id)

    progress.quiz_completed = True
    progress.score = max(progress.score, score * 100)
    progress.updated_at = datetime.utcnow()
    session.add(progress)
    session.commit()

    return QuizSubmissionResponse(
        is_correct=is_correct,
        score=score,
        feedback=item["feedback"]
    )


@router.get("/student/{student_id}")
def get_student_quiz_answers(
    student_id: int,
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    student = session.get(Student, student_id)
    enforce_student_visibility(user, student_id, student.class_id if student else None)
    return session.exec(select(QuizAnswer).where(QuizAnswer.student_id == student_id)).all()


@router.get("/class/{class_id}")
def get_class_quiz_results(
    class_id: int,
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    enforce_class_visibility(user, class_id)
    return {
        "class_id": class_id,
        "results": session.exec(
            select(QuizAnswer).join(Student, Student.id == QuizAnswer.student_id).where(Student.class_id == class_id)
        ).all(),
        "visibility": "teacher_or_mentor_only"
    }
