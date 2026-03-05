"""Abstract base model with common columns for all domain entities."""

from datetime import datetime
from uuid import UUID, uuid4

from sqlalchemy import DateTime, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class BaseModel(Base):
    """Abstract ORM base class providing id, created_at and updated_at.

    All domain models should inherit from this class instead of Base directly.

    Attributes:
        id: UUID primary key, auto-generated on the application side.
        created_at: Timestamp of record creation, set by the database.
        updated_at: Timestamp of last update, maintained by the database.
    """

    __abstract__ = True

    id: Mapped[UUID] = mapped_column(
        primary_key=True,
        default=uuid4,
        index=True,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
