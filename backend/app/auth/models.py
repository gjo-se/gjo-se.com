"""SQLAlchemy-Modelle für das Auth-Modul."""

from datetime import datetime

from sqlalchemy import Boolean, DateTime, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class User(Base):
    """Repräsentiert einen registrierten Benutzer.

    Attributes:
        id: Primärschlüssel.
        email: Eindeutige E-Mail-Adresse.
        name: Anzeigename.
        hashed_password: bcrypt-Hash des Passworts – niemals Klartext speichern.
        is_active: False bis zur E-Mail-Bestätigung (Phase 2i).
        role: Benutzerrolle ("user" | "admin").
        created_at: Erstellungszeitpunkt (automatisch gesetzt).
        updated_at: Letzter Änderungszeitpunkt (automatisch aktualisiert).
    """

    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    email: Mapped[str] = mapped_column(String, unique=True, nullable=False, index=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    role: Mapped[str] = mapped_column(String, default="user", nullable=False)
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
