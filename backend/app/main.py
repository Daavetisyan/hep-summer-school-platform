import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import create_db_and_tables
from app.data.seed import seed_database
from app.routers import auth, simulations, progress, quizzes, exports

cors_origins = [
    origin.strip()
    for origin in os.getenv("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000").split(",")
    if origin.strip()
]

app = FastAPI(
    title="HEP Summer School Platform API",
    description="MVP backend for simulations, quizzes, progress tracking, CSV export, and ROOT export.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    create_db_and_tables()
    seed_database()


app.include_router(auth.router)
app.include_router(simulations.router)
app.include_router(progress.router)
app.include_router(quizzes.router)
app.include_router(exports.router)


@app.get("/")
def root():
    return {
        "message": "HEP Summer School Platform API",
        "privacy_rule": "Students see only their own scores. Teachers, mentors, and admins see class progress."
    }
