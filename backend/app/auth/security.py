"""JWT- und Passwort-Sicherheitsfunktionen für das Auth-Modul."""

import logging
from datetime import UTC, datetime, timedelta

import bcrypt
from fastapi import Cookie, Depends, HTTPException, status
from jose import JWTError, jwt
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth import repository as user_repo
from app.auth.models import User
from app.core.config import settings
from app.db.session import get_db

logger = logging.getLogger(__name__)


def hash_password(plain: str) -> str:
    """Erstellt einen bcrypt-Hash des Klartextpassworts.

    Args:
        plain: Klartextpasswort.

    Returns:
        bcrypt-Hash-String.
    """
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(plain.encode(), salt).decode()


def verify_password(plain: str, hashed: str) -> bool:
    """Prüft ob ein Klartextpasswort zum gespeicherten Hash passt.

    Args:
        plain: Klartextpasswort.
        hashed: Gespeicherter bcrypt-Hash.

    Returns:
        True wenn das Passwort korrekt ist, sonst False.
    """
    return bcrypt.checkpw(plain.encode(), hashed.encode())


def create_access_token(
    data: dict,
    expires_delta: timedelta | None = None,
) -> str:
    """Erstellt ein signiertes JWT Access-Token.

    Args:
        data: Payload-Daten (werden in den Token kodiert).
        expires_delta: Optionale Ablaufzeit. Fallback: ACCESS_TOKEN_EXPIRE_MINUTES.

    Returns:
        Signierter JWT-String.
    """
    to_encode = data.copy()
    expire = datetime.now(UTC) + (
        expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode["exp"] = expire
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


async def get_current_user(
    access_token: str | None = Cookie(default=None),
    db: AsyncSession = Depends(get_db),
) -> User:
    """FastAPI-Dependency: Gibt den authentifizierten User zurück.

    Liest das JWT aus dem httpOnly-Cookie, verifiziert es und lädt
    den zugehörigen User aus der Datenbank.

    Args:
        access_token: JWT aus dem Cookie (automatisch injiziert).
        db: Datenbankverbindung (automatisch injiziert).

    Returns:
        Authentifizierter und aktiver User.

    Raises:
        HTTPException 401: Token fehlt, ungültig oder abgelaufen.
        HTTPException 403: Account ist nicht aktiviert.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
    )

    if access_token is None:
        raise credentials_exception

    try:
        payload = jwt.decode(
            access_token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
        )
        user_id: str | None = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        logger.warning("JWT validation failed")
        raise credentials_exception

    user = await user_repo.get_by_id(db, int(user_id))
    if user is None:
        raise credentials_exception

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account not verified",
        )

    return user
