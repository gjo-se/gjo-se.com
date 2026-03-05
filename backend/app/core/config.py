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

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


settings: Settings = Settings()
