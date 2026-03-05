# Stage 1: builder – installs dependencies into .venv
FROM python:3.12-slim AS builder

WORKDIR /app

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

# Copy dependency files first (layer cache)
COPY pyproject.toml uv.lock ./

# Install dependencies into project-local .venv
RUN uv sync --frozen --no-dev

# Copy application code
COPY app ./app
COPY alembic ./alembic
COPY alembic.ini ./

# Stage 2: runtime – lean image without uv or build tools
FROM python:3.12-slim AS runtime

WORKDIR /app

# Copy only the .venv and app code from builder
COPY --from=builder /app/.venv ./.venv
COPY --from=builder /app/app ./app
COPY --from=builder /app/alembic ./alembic
COPY --from=builder /app/alembic.ini ./

# Make .venv binaries available
ENV PATH="/app/.venv/bin:$PATH"

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
