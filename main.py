from database import get_connection
from models import Candidate, Client, Mission, Application, UserRegister, UserLogin
from security import hash_password, verify_password, create_access_token
from fastapi import FastAPI, Depends, HTTPException
from security import get_current_user, require_admin
from psycopg.errors import UniqueViolation, ForeignKeyViolation
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI()

frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        frontend_url,
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# HEALTH

@app.get("/health")
def health():
    return {"status": "ok", "version": "1.1"}

# STATS

@app.get("/stats")
def get_stats(current_user = Depends(get_current_user)):
    with get_connection() as connection:
        candidates = connection.execute(
            "SELECT COUNT(*) FROM candidates"
        ).fetchone()[0]

        clients = connection.execute(
            "SELECT COUNT(*) FROM clients"
        ).fetchone()[0]

        missions = connection.execute(
            "SELECT COUNT(*) FROM missions"
        ).fetchone()[0]

        applications = connection.execute(
            "SELECT COUNT(*) FROM applications"
        ).fetchone()[0]

    return {
        "candidates": candidates,
        "clients": clients,
        "missions": missions,
        "applications": applications
    }


# CANDIDATES

@app.get("/candidates")
def get_candidates(current_user = Depends(get_current_user)):
    with get_connection() as connection:
        cursor = connection.execute("""
            SELECT id, first_name, last_name, email, phone, job, status
            FROM candidates
            ORDER BY id
        """)

        rows = cursor.fetchall()

    return [
        {
            "id": row[0],
            "first_name": row[1],
            "last_name": row[2],
            "email": row[3],
            "phone": row[4],
            "job": row[5],
            "status": row[6]
        }
        for row in rows
    ]


@app.post("/candidates")
def create_candidate(
    candidate: Candidate,
    current_user = Depends(get_current_user)
):
    with get_connection() as connection:
        connection.execute(
            """
            INSERT INTO candidates
            (first_name, last_name, email, phone, job, status)
            VALUES (%s, %s, %s, %s, %s, %s)
            """,
            (
                candidate.first_name,
                candidate.last_name,
                candidate.email,
                candidate.phone,
                candidate.job,
                candidate.status
            )
        )

    return candidate


@app.delete("/candidates/{candidate_id}")
def delete_candidate(
    candidate_id: int,
    current_user = Depends(require_admin)
):
    with get_connection() as connection:
        connection.execute(
            "DELETE FROM candidates WHERE id = %s",
            (candidate_id,)
        )

    return {"message": "Candidate deleted"}


@app.put("/candidates/{candidate_id}")
def update_candidate(
    candidate_id: int,
    candidate: Candidate,
    current_user = Depends(get_current_user)
):
    with get_connection() as connection:
        connection.execute(
            """
            UPDATE candidates
            SET first_name = %s,
                last_name = %s,
                email = %s,
                phone = %s,
                job = %s,
                status = %s
            WHERE id = %s
            """,
            (
                candidate.first_name,
                candidate.last_name,
                candidate.email,
                candidate.phone,
                candidate.job,
                candidate.status,
                candidate_id
            )
        )

    return {"message": "Candidate updated"}


# CLIENTS

@app.get("/clients")
def get_clients(current_user = Depends(get_current_user)):
    with get_connection() as connection:
        cursor = connection.execute("""
            SELECT id, name, email, phone
            FROM clients
            ORDER BY id
        """)

        rows = cursor.fetchall()

    return [
        {
            "id": row[0],
            "name": row[1],
            "email": row[2],
            "phone": row[3]
        }
        for row in rows
    ]


@app.post("/clients")
def create_client(
    client: Client,
    current_user = Depends(get_current_user)
):
    with get_connection() as connection:
        cursor = connection.execute(
            """
            INSERT INTO clients (name, email, phone)
            VALUES (%s, %s, %s)
            RETURNING id
            """,
            (client.name, client.email, client.phone)
        )

        client_id = cursor.fetchone()[0]

    return {"id": client_id, **client.model_dump()}


# MISSIONS

@app.get("/missions")
def get_missions(current_user = Depends(get_current_user)):
    with get_connection() as connection:
        cursor = connection.execute("""
            SELECT
                missions.id,
                missions.title,
                missions.description,
                missions.status,
                missions.client_id,
                clients.name
            FROM missions
            JOIN clients ON missions.client_id = clients.id
            ORDER BY missions.id
        """)

        rows = cursor.fetchall()

    return [
        {
            "id": row[0],
            "title": row[1],
            "description": row[2],
            "status": row[3],
            "client_id": row[4],
            "client_name": row[5]
        }
        for row in rows
    ]


@app.post("/missions")
def create_mission(
    mission: Mission,
    current_user = Depends(get_current_user)
):
    with get_connection() as connection:
        cursor = connection.execute(
            """
            INSERT INTO missions
            (title, description, status, client_id)
            VALUES (%s, %s, %s, %s)
            RETURNING id
            """,
            (
                mission.title,
                mission.description,
                mission.status,
                mission.client_id
            )
        )

        mission_id = cursor.fetchone()[0]

    return {"id": mission_id, **mission.model_dump()}


# APPLICATIONS

@app.post("/applications")
def create_application(
    application: Application,
    current_user = Depends(get_current_user)
):
    try:
        with get_connection() as connection:
            cursor = connection.execute(
                """
                INSERT INTO applications
                (candidate_id, mission_id, status)
                VALUES (%s, %s, %s)
                RETURNING id
                """,
                (
                    application.candidate_id,
                    application.mission_id,
                    application.status
                )
            )

            application_id = cursor.fetchone()[0]

    except UniqueViolation:
        raise HTTPException(
            status_code=409,
            detail="Candidate already proposed for this mission"
        )

    except ForeignKeyViolation:
        raise HTTPException(
            status_code=400,
            detail="Candidate or mission does not exist"
        )

    return {
        "id": application_id,
        **application.model_dump()
    }


@app.get("/applications")
def get_applications(
    current_user = Depends(get_current_user)
):
    with get_connection() as connection:
        cursor = connection.execute("""
            SELECT
                applications.id,
                candidates.first_name,
                candidates.last_name,
                missions.title,
                clients.name,
                applications.status
            FROM applications
            JOIN candidates
                ON applications.candidate_id = candidates.id
            JOIN missions
                ON applications.mission_id = missions.id
            JOIN clients
                ON missions.client_id = clients.id
            ORDER BY applications.id
        """)

        rows = cursor.fetchall()

    return [
        {
            "id": row[0],
            "candidate": f"{row[1]} {row[2]}",
            "mission": row[3],
            "client": row[4],
            "status": row[5]
        }
        for row in rows
    ]


# AUTH

@app.post("/register", status_code=201)
def register(user: UserRegister):
    password_hash = hash_password(user.password)

    try:
        with get_connection() as connection:
            cursor = connection.execute(
                """
                INSERT INTO users (email, password_hash)
                VALUES (%s, %s)
                RETURNING id, email, role
                """,
                (user.email, password_hash)
            )

            new_user = cursor.fetchone()

    except UniqueViolation:
        raise HTTPException(
            status_code=409,
            detail="Email already registered"
        )

    return {
        "id": new_user[0],
        "email": new_user[1],
        "role": new_user[2]
    }


@app.post("/login")
def login(user: UserLogin):
    with get_connection() as connection:
        cursor = connection.execute(
            """
            SELECT id, email, password_hash, role
            FROM users
            WHERE email = %s
            """,
            (user.email,)
        )

        db_user = cursor.fetchone()

    if db_user is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    if not verify_password(user.password, db_user[2]):
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    access_token = create_access_token(
        user_id=db_user[0],
        role=db_user[3]
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }