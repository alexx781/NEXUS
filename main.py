from fastapi import FastAPI
from pydantic import BaseModel
import sqlite3

app = FastAPI()

connection = sqlite3.connect("nexus.db", check_same_thread=False)
connection.execute("""
CREATE TABLE IF NOT EXISTS candidates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    job TEXT NOT NULL
)
""")

candidates = []
class Candidate(BaseModel):
    name: str
    job: str

@app.get("/health")
def health():
    return {"status": "ok"}

#GET Candidate
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

#POST Candidate
@app.post("/candidates")
def create_candidate(candidate: Candidate):
    connection.execute(
        "INSERT INTO candidates (name, job) VALUES (?, ?)",
        (candidate.name, candidate.job)
    )
    connection.commit()

    return candidate

#DELETE Candidate
@app.delete("/candidates/{candidate_id}")
def delete_candidate(candidate_id: int):
    connection.execute(
        "DELETE FROM candidates WHERE id = ?",
        (candidate_id,)
    )
    connection.commit()

    return {"message": "Candidate deleted"}

#UPDATE Candidate
@app.put("/candidates/{candidate_id}")
def update_candidate(candidate_id: int, candidate: Candidate):
    connection.execute(
        "UPDATE candidates SET name = ?, job = ? WHERE id = ?",
        (candidate.name, candidate.job, candidate_id)
    )
    connection.commit()

    return {"message": "Candidate updated"}