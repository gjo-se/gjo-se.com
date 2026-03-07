"""Application configuration via pydantic-settings.

Loads all settings from environment variables or a .env file.
"""

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Central application settings.

    Attributes:
        APP_NAME: Human-readable name of the application.
        DEBUG: Enable debug mode (never True in production).
        ENVIRONMENT: Deployment environment (dev / test / prod).
        DATABASE_URL: Full DSN for the database connection.
        ALLOWED_ORIGINS: List of origins permitted for CORS requests.
        SECRET_KEY: Secret key for JWT signing – must be changed in production.
        ACCESS_TOKEN_EXPIRE_MINUTES: JWT access token lifetime in minutes.
        ALGORITHM: JWT signing algorithm.
        COOKIE_SECURE: Set Secure flag on auth cookies (True in production/HTTPS).
    """

    APP_NAME: str = Field(default="gjo-se.com", description="Application name")
    DEBUG: bool = Field(default=False, description="Enable debug mode")
    ENVIRONMENT: str = Field(default="dev", description="Deployment environment")
    DATABASE_URL: str = Field(
        default="sqlite+aiosqlite:///:memory:",
        description="Database connection string",
    )
    ALLOWED_ORIGINS: list[str] = Field(
        default=["http://localhost:3000"],
        description="Permitted CORS origins",
    )
    SECRET_KEY: str = Field(
        default="change-me-in-production",
        description="JWT signing secret – never use default in production",
    )
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(
        default=30,
        description="JWT access token lifetime in minutes",
    )
    ALGORITHM: str = Field(default="HS256", description="JWT signing algorithm")
    COOKIE_SECURE: bool = Field(
        default=False,
        description="Secure flag for auth cookies – True in production (HTTPS)",
    )

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


settings: Settings = Settings()
