from enum import Enum
from fastapi import Header, HTTPException, status
from pydantic import BaseModel


class Role(str, Enum):
    student = "student"
    teacher = "teacher"
    mentor = "mentor"
    admin = "admin"


class CurrentUser(BaseModel):
    user_id: int
    role: Role
    class_id: int | None = None


def get_current_user(
    x_user_id: int = Header(..., description="Temporary MVP user id header"),
    x_role: Role = Header(..., description="Temporary MVP role header"),
    x_class_id: int | None = Header(None, description="Temporary MVP class id header"),
) -> CurrentUser:
    '''
    MVP-only authentication.

    In production, replace this with real login/JWT/OAuth.
    For now, the frontend or API tester passes:
    - X-User-Id
    - X-Role
    - X-Class-Id
    '''
    return CurrentUser(user_id=x_user_id, role=x_role, class_id=x_class_id)


def require_teacher_like(user: CurrentUser) -> None:
    if user.role not in {Role.teacher, Role.mentor, Role.admin}:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only teachers, mentors, or admins can access this."
        )


def can_view_student_record(user: CurrentUser, student_id: int, student_class_id: int | None = None) -> bool:
    '''
    Privacy rule:
    - students can view only their own records
    - teachers/mentors/admins can view student records
    '''
    if user.role == Role.student:
        return user.user_id == student_id
    if user.role == Role.admin:
        return True
    return user.role in {Role.teacher, Role.mentor} and user.class_id == student_class_id


def enforce_student_visibility(user: CurrentUser, student_id: int, student_class_id: int | None = None) -> None:
    if not can_view_student_record(user, student_id, student_class_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You cannot view this student's progress and scores."
        )


def enforce_class_visibility(user: CurrentUser, class_id: int) -> None:
    require_teacher_like(user)
    if user.role != Role.admin and user.class_id != class_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Teachers and mentors can only access their assigned class."
        )
