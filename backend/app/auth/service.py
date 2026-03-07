"""Geschäftslogik für das Auth-Modul."""

import logging

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth import repository as user_repo
from app.auth.models import User
from app.auth.security import hash_password, verify_password

logger = logging.getLogger(__name__)


async def register(
    db: AsyncSession,
    email: str,
    name: str,
    password: str,
) -> User:
    """Registriert einen neuen Benutzer.

    Args:
        db: Aktive Datenbankverbindung.
        email: E-Mail-Adresse des neuen Benutzers.
        name: Anzeigename.
        password: Klartextpasswort (wird gehasht).

    Returns:
        Neu angelegter User.

    Raises:
        HTTPException 400: E-Mail-Adresse ist bereits registriert.
    """
    existing = await user_repo.get_by_email(db, email)
    if existing is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    hashed = hash_password(password)
    return await user_repo.create(db, email=email, name=name, hashed_password=hashed)


async def login(
    db: AsyncSession,
    email: str,
    password: str,
) -> User:
    """Authentifiziert einen Benutzer anhand von E-Mail und Passwort.

    Args:
        db: Aktive Datenbankverbindung.
        email: E-Mail-Adresse.
        password: Klartextpasswort.

    Returns:
        Authentifizierter User.

    Raises:
        HTTPException 401: Ungültige Credentials (bewusst generische Message).
        HTTPException 403: Account ist nicht aktiviert.
    """
    user = await user_repo.get_by_email(db, email)

    # Bewusst gleiche Fehlermeldung für "nicht gefunden" und "falsches Passwort"
    # → verhindert User-Enumeration
    if user is None or not verify_password(password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account not verified. Please check your email.",
        )

    return user
