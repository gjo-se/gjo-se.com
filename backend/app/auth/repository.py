"""Datenbankzugriff für das Auth-Modul."""

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.models import User


async def get_by_email(db: AsyncSession, email: str) -> User | None:
    """Sucht einen Benutzer anhand der E-Mail-Adresse.

    Args:
        db: Aktive Datenbankverbindung.
        email: E-Mail-Adresse des gesuchten Benutzers.

    Returns:
        User-Objekt oder None wenn nicht gefunden.
    """
    result = await db.execute(select(User).where(User.email == email))
    return result.scalar_one_or_none()


async def get_by_id(db: AsyncSession, user_id: int) -> User | None:
    """Sucht einen Benutzer anhand der ID.

    Args:
        db: Aktive Datenbankverbindung.
        user_id: ID des gesuchten Benutzers.

    Returns:
        User-Objekt oder None wenn nicht gefunden.
    """
    result = await db.execute(select(User).where(User.id == user_id))
    return result.scalar_one_or_none()


async def create(
    db: AsyncSession,
    email: str,
    name: str,
    hashed_password: str,
) -> User:
    """Legt einen neuen Benutzer in der Datenbank an.

    Args:
        db: Aktive Datenbankverbindung.
        email: E-Mail-Adresse des neuen Benutzers.
        name: Anzeigename des neuen Benutzers.
        hashed_password: bcrypt-Hash des Passworts.

    Returns:
        Neu angelegter User mit gesetzter ID.
    """
    user = User(email=email, name=name, hashed_password=hashed_password)
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user
