from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlmodel import Session

from app.core.security import CurrentUser, authenticate_user, create_access_token, get_current_user
from app.database import get_session

router = APIRouter(prefix="/auth", tags=["auth"])


class LoginRequest(BaseModel):
    username: str
    password: str


@router.post("/login")
def login(request: LoginRequest, session: Session = Depends(get_session)):
    account = authenticate_user(session, request.username, request.password)
    if not account:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password.")
    return {"access_token": create_access_token(account), "token_type": "bearer", "role": account.role}


@router.get("/me")
def me(user: CurrentUser = Depends(get_current_user)):
    return user
