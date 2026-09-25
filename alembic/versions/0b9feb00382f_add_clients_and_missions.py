"""add clients and missions

Revision ID: 0b9feb00382f
Revises: e3840d40be97
Create Date: 2026-09-24 02:24:50.392341

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '0b9feb00382f'
down_revision: Union[str, Sequence[str], None] = 'e3840d40be97'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "clients",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.Text(), nullable=False),
        sa.Column("email", sa.Text(), nullable=True),
        sa.Column("phone", sa.Text(), nullable=True)
    )

    op.create_table(
        "missions",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("title", sa.Text(), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("status", sa.Text(), nullable=False, server_default="open"),

        sa.Column(
            "client_id",
            sa.Integer(),
            sa.ForeignKey("clients.id"),
            nullable=False
        )
    )


def downgrade() -> None:
    op.drop_table("missions")
    op.drop_table("clients")
