"""${message}

Revision ID: ${revision}
Revises: ${repr(down_revision)}
Create Date: ${create_date}
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op
${imports if imports else ""}

revision: str = ${repr(revision)}
down_revision: str | None = ${repr(down_revision)}
branch_labels: str | Sequence[str] | None = ${repr(branch_labels)}
depends_on: str | Sequence[str] | None = ${repr(depends_on)}


def upgrade() -> None:
    ## ...existing code...
    ${upgrades if upgrades else "pass"}


def downgrade() -> None:
    ## ...existing code...
    ${downgrades if downgrades else "pass"}
