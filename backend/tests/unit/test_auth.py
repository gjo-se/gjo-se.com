"""Unit-Tests für den Auth-Flow (Phase 2h.1).

Testet alle Auth-Endpunkte gegen eine In-Memory-SQLite-Datenbank.
"""

import pytest
from httpx import AsyncClient

from app.auth import repository as user_repo
from app.db.session import get_db
from app.main import app

BASE = "/api/v1/auth"


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


async def _register(client: AsyncClient, email: str = "test@example.com"):
    """Registriert einen Test-User und gibt den Response zurück."""
    return await client.post(
        f"{BASE}/register",
        json={"email": email, "name": "Test User", "password": "securepass123"},
    )


async def _activate(email: str = "test@example.com") -> None:
    """Setzt is_active=True über die aktive Test-DB-Session."""
    db_override = app.dependency_overrides.get(get_db)
    if db_override is None:
        return
    async for db in db_override():
        user = await user_repo.get_by_email(db, email)
        if user:
            user.is_active = True
            await db.commit()
        break


# ---------------------------------------------------------------------------
# Register
# ---------------------------------------------------------------------------


@pytest.mark.asyncio
async def test_register_success(client: AsyncClient) -> None:
    """Registrierung mit gültigen Daten liefert 201 und UserOut."""
    resp = await _register(client)
    assert resp.status_code == 201
    data = resp.json()
    assert data["email"] == "test@example.com"
    assert data["name"] == "Test User"
    assert data["is_active"] is False
    assert "hashed_password" not in data


@pytest.mark.asyncio
async def test_register_duplicate_email(client: AsyncClient) -> None:
    """Zweite Registrierung mit gleicher E-Mail liefert 400."""
    await _register(client)
    resp = await _register(client)
    assert resp.status_code == 400
    assert resp.json()["detail"] == "Email already registered"


@pytest.mark.asyncio
async def test_register_password_too_short(client: AsyncClient) -> None:
    """Passwort unter 8 Zeichen liefert 422."""
    resp = await client.post(
        f"{BASE}/register",
        json={"email": "short@example.com", "name": "Short", "password": "1234567"},
    )
    assert resp.status_code == 422


# ---------------------------------------------------------------------------
# Login
# ---------------------------------------------------------------------------


@pytest.mark.asyncio
async def test_login_success(client: AsyncClient) -> None:
    """Login mit korrekten Credentials setzt httpOnly Cookie."""
    await _register(client)
    await _activate()

    resp = await client.post(
        f"{BASE}/login",
        json={"email": "test@example.com", "password": "securepass123"},
    )
    assert resp.status_code == 200
    assert "access_token" in resp.cookies
    data = resp.json()
    assert data["message"] == "Login successful"
    assert data["user"]["email"] == "test@example.com"


@pytest.mark.asyncio
async def test_login_wrong_password(client: AsyncClient) -> None:
    """Login mit falschem Passwort liefert 401 mit generischer Message."""
    await _register(client)
    await _activate()

    resp = await client.post(
        f"{BASE}/login",
        json={"email": "test@example.com", "password": "wrongpassword"},
    )
    assert resp.status_code == 401
    assert resp.json()["detail"] == "Invalid credentials"


@pytest.mark.asyncio
async def test_login_unknown_email(client: AsyncClient) -> None:
    """Login mit unbekannter E-Mail liefert 401 – gleiche Message wie falsches PW."""
    resp = await client.post(
        f"{BASE}/login",
        json={"email": "nobody@example.com", "password": "securepass123"},
    )
    assert resp.status_code == 401
    # Gleiche generische Message – keine User-Enumeration möglich
    assert resp.json()["detail"] == "Invalid credentials"


@pytest.mark.asyncio
async def test_login_inactive_user(client: AsyncClient) -> None:
    """Login mit nicht-aktiviertem Account liefert 403."""
    await _register(client)
    # Kein _activate() – User bleibt is_active=False

    resp = await client.post(
        f"{BASE}/login",
        json={"email": "test@example.com", "password": "securepass123"},
    )
    assert resp.status_code == 403
    assert "verified" in resp.json()["detail"].lower()


# ---------------------------------------------------------------------------
# Me
# ---------------------------------------------------------------------------


@pytest.mark.asyncio
async def test_me_authenticated(client: AsyncClient) -> None:
    """GET /me mit gültigem Cookie liefert 200 und UserOut."""
    await _register(client)
    await _activate()
    await client.post(
        f"{BASE}/login",
        json={"email": "test@example.com", "password": "securepass123"},
    )

    resp = await client.get(f"{BASE}/me")
    assert resp.status_code == 200
    data = resp.json()
    assert data["email"] == "test@example.com"
    assert "hashed_password" not in data


@pytest.mark.asyncio
async def test_me_unauthenticated(client: AsyncClient) -> None:
    """GET /me ohne Cookie liefert 401."""
    resp = await client.get(f"{BASE}/me")
    assert resp.status_code == 401


# ---------------------------------------------------------------------------
# Logout
# ---------------------------------------------------------------------------


@pytest.mark.asyncio
async def test_logout(client: AsyncClient) -> None:
    """Logout löscht das Cookie und /me liefert danach 401."""
    await _register(client)
    await _activate()
    await client.post(
        f"{BASE}/login",
        json={"email": "test@example.com", "password": "securepass123"},
    )

    resp = await client.post(f"{BASE}/logout")
    assert resp.status_code == 200
    assert resp.json()["message"] == "Logged out successfully"

    # Nach Logout: /me muss 401 liefern
    resp = await client.get(f"{BASE}/me")
    assert resp.status_code == 401
