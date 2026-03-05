"""Async database engine and session factory for FastAPI."""

from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

from app.core.config import settings

engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    future=True,
)

AsyncSessionLocal: async_sessionmaker[AsyncSession] = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """FastAPI dependency that provides a transactional async database session.

    Yields an AsyncSession that is automatically closed after the request
    completes. Use with FastAPI's Depends() mechanism.

    Yields:
        AsyncSession: An active database session scoped to the current request.

    Example:
        @router.get("/items")
        async def list_items(
            db: AsyncSession = Depends(get_db),
        ) -> list[Item]:
            result = await db.execute(select(Item))
            return list(result.scalars().all())
    """
    async with AsyncSessionLocal() as session:
        yield session
