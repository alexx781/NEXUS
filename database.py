from dotenv import load_dotenv
import os
import psycopg

load_dotenv()

database_url = os.getenv("DATABASE_URL")


def get_connection():
    return psycopg.connect(database_url)