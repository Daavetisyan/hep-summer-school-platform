import os
from datetime import datetime, timedelta, timezone
from enum import Enum

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pwdlib import PasswordHash
from pydantic import BaseModel
from sqlmodel import Session, select

from app.database import get_session
from app.models import UserAccount

JWT_SECRET = os.getenv("JWT_SECRET", "local-development-secret-change-before-deploying")
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_MINUTES = int(os.getenv("ACCESS_TOKEN_MINUTES", "480"))
password_hash = PasswordHash.recommended()
bearer_scheme = HTTPBearer(auto_error=False)


class Role(str, Enum):
    student = "student"
    teacher = "teacher"
    mentor = "mentor"
    admin = "admin"


class CurrentUser(BaseModel):
    user_id: int
    role: Role
    class_id: int | None = None


def hash_password(password: str) -> str:
    return password_hash.hash(password)


def verify_password(password: str, hashed: str) -> bool:
    return password_hash.verify(password, hashed)


def create_access_token(account: UserAccount) -> str:
    expires = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_MINUTES)
    return jwt.encode({"sub": str(account.id), "exp": expires}, JWT_SECRET, algorithm=JWT_ALGORITHM)


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    session: Session = Depends(get_session),
) -> CurrentUser:
    if not credentials:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Sign in to access this lab.")
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        account_id = int(payload["sub"])
    except (jwt.PyJWTError, KeyError, ValueError):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Your session is invalid or expired.")
    account = session.get(UserAccount, account_id)
    if not account:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User account not found.")
    return CurrentUser(user_id=account.student_id or account.id, role=Role(account.role), class_id=account.class_id)


def authenticate_user(session: Session, username: str, password: str) -> UserAccount | None:
    account = session.exec(select(UserAccount).where(UserAccount.username == username)).first()
    return account if account and verify_password(password, account.password_hash) else None


def require_teacher_like(user: CurrentUser) -> None:
    if user.role not in {Role.teacher, Role.mentor, Role.admin}:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only teachers, mentors, or admins can access this.")


def can_view_student_record(user: CurrentUser, student_id: int, student_class_id: int | None = None) -> bool:
    if user.role == Role.student:
        return user.user_id == student_id
    if user.role == Role.admin:
        return True
    return user.role in {Role.teacher, Role.mentor} and user.class_id == student_class_id


def enforce_student_visibility(user: CurrentUser, student_id: int, student_class_id: int | None = None) -> None:
    if not can_view_student_record(user, student_id, student_class_id):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You cannot view this student's progress and scores.")


def enforce_class_visibility(user: CurrentUser, class_id: int) -> None:
    require_teacher_like(user)
    if user.role != Role.admin and user.class_id != class_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Teachers and mentors can only access their assigned class.")
