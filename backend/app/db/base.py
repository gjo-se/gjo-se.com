"""SQLAlchemy declarative base for all ORM models."""

from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    """Central declarative base class.

    All ORM models must inherit from this class to be picked up
    by SQLAlchemy metadata and Alembic autogenerate.
    """
