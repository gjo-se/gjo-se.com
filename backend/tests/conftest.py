"""Shared pytest fixtures for all tests."""

from collections.abc import AsyncGenerator

import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

from app.auth.models import User  # noqa: F401 – registers User for Base.metadata
from app.db.base import Base
from app.db.session import get_db
from app.main import app

_TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

_test_engine = create_async_engine(
    _TEST_DATABASE_URL,
    echo=False,
    future=True,
)

_TestSessionLocal: async_sessionmaker[AsyncSession] = async_sessionmaker(
    bind=_test_engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)


async def _override_get_db() -> AsyncGenerator[AsyncSession, None]:
    """Yield a test database session backed by In-Memory-SQLite.

    Yields:
        AsyncSession: A session scoped to the current test.
    """
    async with _TestSessionLocal() as session:
        yield session


@pytest.fixture()
async def client() -> AsyncGenerator[AsyncClient, None]:
    """Provide an AsyncClient wired to the FastAPI app with an In-Memory-SQLite DB.

    Sets up the full DB schema before each test and tears it down afterwards.
    The ``get_db`` dependency is overridden so no real database is required.

    Yields:
        AsyncClient: Configured async HTTP client for the test.
    """
    async with _test_engine.begin() as connection:
        await connection.run_sync(Base.metadata.create_all)

    app.dependency_overrides[get_db] = _override_get_db

    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
    ) as async_client:
        yield async_client

    app.dependency_overrides.clear()

    async with _test_engine.begin() as connection:
        await connection.run_sync(Base.metadata.drop_all)
