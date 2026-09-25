"""expand candidate fields

Revision ID: e3840d40be97
Revises: 
Create Date: 2026-09-24 01:35:08.958610

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e3840d40be97'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. Add the new columns
    op.add_column(
        "candidates",
        sa.Column("first_name", sa.Text(), nullable=True)
    )
    op.add_column(
        "candidates",
        sa.Column("last_name", sa.Text(), nullable=True)
    )
    op.add_column(
        "candidates",
        sa.Column("email", sa.Text(), nullable=True)
    )
    op.add_column(
        "candidates",
        sa.Column("phone", sa.Text(), nullable=True)
    )
    op.add_column(
        "candidates",
        sa.Column(
            "status",
            sa.Text(),
            nullable=False,
            server_default="available"
        )
    )

    # 2. Migrate existing candidate data
    op.execute("""
        UPDATE candidates
        SET first_name = split_part(name, ' ', 1),
            last_name = substring(name from position(' ' in name) + 1),
            email = 'candidate_' || id || '@nexus.local'
    """)

    # 3. New fields are now required
    op.alter_column("candidates", "first_name", nullable=False)
    op.alter_column("candidates", "last_name", nullable=False)
    op.alter_column("candidates", "email", nullable=False)

    # 4. Each candidate must have a unique email
    op.create_unique_constraint(
        "uq_candidates_email",
        "candidates",
        ["email"]
    )

    # 5. Remove the old name column
    op.drop_column("candidates", "name")


def downgrade() -> None:
    """Downgrade schema."""
    pass
