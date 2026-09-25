"""add applications

Revision ID: cb9ac9308f5f
Revises: 0b9feb00382f
Create Date: 2026-09-24 02:47:46.221488

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'cb9ac9308f5f'
down_revision: Union[str, Sequence[str], None] = '0b9feb00382f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "applications",
        sa.Column("id", sa.Integer(), primary_key=True),

        sa.Column(
            "candidate_id",
            sa.Integer(),
            sa.ForeignKey("candidates.id", ondelete="CASCADE"),
            nullable=False
        ),

        sa.Column(
            "mission_id",
            sa.Integer(),
            sa.ForeignKey("missions.id", ondelete="CASCADE"),
            nullable=False
        ),

        sa.Column(
            "status",
            sa.Text(),
            nullable=False,
            server_default="proposed"
        ),

        sa.UniqueConstraint(
            "candidate_id",
            "mission_id",
            name="uq_candidate_mission"
        )
    )


def downgrade() -> None:
    op.drop_table("applications")
