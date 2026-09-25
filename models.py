from pydantic import BaseModel

class Candidate(BaseModel):
    first_name: str
    last_name: str
    email: str
    phone: str | None = None
    job: str
    status: str = "available"

class Client(BaseModel):
    name: str
    email: str | None = None
    phone: str | None = None


class Mission(BaseModel):
    title: str
    description: str | None = None
    status: str = "open"
    client_id: int

class Application(BaseModel):
    candidate_id: int
    mission_id: int
    status: str = "proposed"

class UserRegister(BaseModel):
    email: str
    password: str


class UserLogin(BaseModel):
    email: str
    password: str