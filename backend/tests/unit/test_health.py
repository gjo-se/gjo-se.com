"""Unit tests for the health router."""

from httpx import AsyncClient

from app.api.v1.routers.health import HEALTH_STATUS_OK


async def test_health_returns_200(client: AsyncClient) -> None:
    """GET /api/v1/health responds with HTTP 200.

    Args:
        client: Pytest fixture providing an async FastAPI test client.
    """
    response = await client.get("/api/v1/health")
    assert response.status_code == 200


async def test_health_returns_ok_status(client: AsyncClient) -> None:
    """GET /api/v1/health response body contains status 'ok'.

    Args:
        client: Pytest fixture providing an async FastAPI test client.
    """
    response = await client.get("/api/v1/health")
    assert response.json() == {"status": HEALTH_STATUS_OK}
