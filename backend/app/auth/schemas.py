"""Pydantic-Schemas für das Auth-Modul."""

from pydantic import BaseModel, ConfigDict, EmailStr, field_validator


class RegisterRequest(BaseModel):
    """Request-Body für die Registrierung.

    Attributes:
        email: Gültige E-Mail-Adresse.
        name: Anzeigename des Benutzers.
        password: Klartext-Passwort (min. 8 Zeichen).
    """

    email: EmailStr
    name: str
    password: str

    @field_validator("password")
    @classmethod
    def password_min_length(cls, value: str) -> str:
        """Stellt sicher, dass das Passwort mindestens 8 Zeichen hat."""
        if len(value) < 8:
            raise ValueError("Password must be at least 8 characters long")
        return value


class LoginRequest(BaseModel):
    """Request-Body für den Login.

    Attributes:
        email: E-Mail-Adresse des Benutzers.
        password: Klartext-Passwort.
    """

    email: EmailStr
    password: str


class UserOut(BaseModel):
    """Öffentliche Benutzerdaten – niemals hashed_password einschließen.

    Attributes:
        id: Primärschlüssel.
        email: E-Mail-Adresse.
        name: Anzeigename.
        role: Benutzerrolle.
        is_active: Aktivierungsstatus.
    """

    model_config = ConfigDict(from_attributes=True)

    id: int
    email: EmailStr
    name: str
    role: str
    is_active: bool


class LoginResponse(BaseModel):
    """Response-Body für erfolgreichen Login.

    Attributes:
        message: Bestätigungsnachricht.
        user: Öffentliche Benutzerdaten.
    """

    message: str
    user: UserOut
