"""FastAPI-Router für das Auth-Modul.

Endpunkte:
    POST /register  – Neuen Benutzer registrieren
    POST /login     – Einloggen, JWT-Cookie setzen
    POST /logout    – Ausloggen, Cookie löschen
    GET  /me        – Aktuellen Benutzer abrufen
"""

import logging

from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth import service as auth_service
from app.auth.dependencies import CurrentUser
from app.auth.schemas import LoginRequest, LoginResponse, RegisterRequest, UserOut
from app.auth.security import create_access_token
from app.core.config import settings
from app.db.session import get_db

logger = logging.getLogger(__name__)

router = APIRouter()

_ACCESS_TOKEN_COOKIE = "access_token"


@router.post(
    "/register",
    response_model=UserOut,
    status_code=status.HTTP_201_CREATED,
    summary="Neuen Benutzer registrieren",
)
async def register(
    body: RegisterRequest,
    db: AsyncSession = Depends(get_db),
) -> UserOut:
    """Registriert einen neuen Benutzer.

    Der Account ist nach der Registrierung inaktiv (is_active=False).
    Die Aktivierung erfolgt in Phase 2i via E-Mail-Bestätigung.

    Args:
        body: Registrierungsdaten (email, name, password).
        db: Datenbankverbindung.

    Returns:
        Öffentliche Benutzerdaten ohne Passwort-Hash.
    """
    user = await auth_service.register(
        db,
        email=body.email,
        name=body.name,
        password=body.password,
    )
    logger.info("New user registered: %s", user.email)
    return UserOut.model_validate(user)


@router.post(
    "/login",
    response_model=LoginResponse,
    summary="Einloggen und JWT-Cookie setzen",
)
async def login(
    body: LoginRequest,
    response: Response,
    db: AsyncSession = Depends(get_db),
) -> LoginResponse:
    """Authentifiziert den Benutzer und setzt ein httpOnly JWT-Cookie.

    Args:
        body: Login-Daten (email, password).
        response: FastAPI Response-Objekt für Cookie-Handling.
        db: Datenbankverbindung.

    Returns:
        Bestätigungsnachricht und öffentliche Benutzerdaten.
    """
    user = await auth_service.login(db, email=body.email, password=body.password)

    token = create_access_token(
        data={"sub": str(user.id), "email": user.email, "role": user.role}
    )

    response.set_cookie(
        key=_ACCESS_TOKEN_COOKIE,
        value=token,
        httponly=True,
        samesite="lax",
        secure=settings.COOKIE_SECURE,
        path="/",
    )

    logger.info("User logged in: %s", user.email)
    return LoginResponse(message="Login successful", user=UserOut.model_validate(user))


@router.post(
    "/logout",
    summary="Ausloggen und Cookie löschen",
)
async def logout(response: Response) -> dict[str, str]:
    """Löscht das JWT-Cookie und loggt den Benutzer aus.

    Args:
        response: FastAPI Response-Objekt für Cookie-Handling.

    Returns:
        Bestätigungsnachricht.
    """
    response.delete_cookie(key=_ACCESS_TOKEN_COOKIE, path="/")
    return {"message": "Logged out successfully"}


@router.get(
    "/me",
    response_model=UserOut,
    summary="Aktuellen Benutzer abrufen",
)
async def me(user: CurrentUser) -> UserOut:
    """Gibt die Daten des aktuell eingeloggten Benutzers zurück.

    Erfordert ein gültiges JWT-Cookie (gesetzt via /login).

    Args:
        user: Aktuell eingeloggter Benutzer (via Dependency).

    Returns:
        Öffentliche Benutzerdaten.
    """
    return UserOut.model_validate(user)
