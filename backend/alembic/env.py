"""Alembic migration environment – async configuration.

DATABASE_URL is loaded from app.core.config (via .env) instead of alembic.ini,
so that no credentials are stored in version control.
"""

import asyncio
from logging.config import fileConfig

from sqlalchemy.ext.asyncio import create_async_engine

from alembic import context
from app.auth.models import User  # noqa: F401 – registers User for autogenerate
from app.core.config import settings
from app.db.base import Base  # noqa: F401 – triggers model registration

config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata


def run_migrations_offline() -> None:
    """Run migrations in offline mode without a live DB connection.

    Emits migration SQL to stdout without connecting to the database.
    """
    context.configure(
        url=settings.DATABASE_URL,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()


async def run_async_migrations() -> None:
    """Run migrations against a live database using an async engine.

    Creates a transient AsyncEngine from settings.DATABASE_URL and runs
    all pending migrations inside a synchronous connection context.
    """
    connectable = create_async_engine(settings.DATABASE_URL, future=True)
    async with connectable.begin() as connection:
        await connection.run_sync(
            lambda sync_conn: context.configure(
                connection=sync_conn,
                target_metadata=target_metadata,
            )
        )
        await connection.run_sync(lambda _: context.run_migrations())
    await connectable.dispose()


def run_migrations_online() -> None:
    """Entry point for online migration mode."""
    asyncio.run(run_async_migrations())


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
