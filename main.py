from fastapi import FastAPI
from pydantic import BaseModel
import os
import psycopg

# Récupère l'adresse de PostgreSQL depuis les variables d'environnement
database_url = os.getenv("DATABASE_URL")

app = FastAPI()

# Connexion à PostgreSQL
connection = psycopg.connect(database_url)

# Création de la table si elle n'existe pas déjà
connection.execute("""
CREATE TABLE IF NOT EXISTS candidates (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    job TEXT NOT NULL
)
""")

connection.commit()


class Candidate(BaseModel):
    name: str
    job: str


# HEALTH
@app.get("/health")
def health():
    return {"status": "ok", "version": "1.1"}


# GET Candidates
@app.get("/candidates")
def get_candidates():
    cursor = connection.execute(
        "SELECT id, name, job FROM candidates"
    )

    rows = cursor.fetchall()

    return [
        {"id": row[0], "name": row[1], "job": row[2]}
        for row in rows
    ]


# POST Candidate
@app.post("/candidates")
def create_candidate(candidate: Candidate):
    connection.execute(
        "INSERT INTO candidates (name, job) VALUES (%s, %s)",
        (candidate.name, candidate.job)
    )

    connection.commit()

    return candidate


# DELETE Candidate
@app.delete("/candidates/{candidate_id}")
def delete_candidate(candidate_id: int):
    connection.execute(
        "DELETE FROM candidates WHERE id = %s",
        (candidate_id,)
    )

    connection.commit()

    return {"message": "Candidate deleted"}


# UPDATE Candidate
@app.put("/candidates/{candidate_id}")
def update_candidate(candidate_id: int, candidate: Candidate):
    connection.execute(
        "UPDATE candidates SET name = %s, job = %s WHERE id = %s",
        (candidate.name, candidate.job, candidate_id)
    )

    connection.commit()

    return {"message": "Candidate updated"}