"""add users

Revision ID: f8ba1969315f
Revises: cb9ac9308f5f
Create Date: 2026-09-24 02:54:32.766822

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f8ba1969315f'
down_revision: Union[str, Sequence[str], None] = 'cb9ac9308f5f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("email", sa.Text(), nullable=False),
        sa.Column("password_hash", sa.Text(), nullable=False),
        sa.Column("role", sa.Text(), nullable=False, server_default="recruiter"),
        sa.UniqueConstraint("email", name="uq_users_email")
    )


def downgrade() -> None:
    op.drop_table("users")
