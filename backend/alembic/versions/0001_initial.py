"""Initial migration – empty baseline.

No tables yet: first domain models will be added in subsequent migrations.

Revision ID: 0001
Revises:
Create Date: 2026-03-04
"""

from collections.abc import Sequence

revision: str = "0001"
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    """Apply initial (empty) migration."""
    pass


def downgrade() -> None:
    """Revert initial (empty) migration."""
    pass
