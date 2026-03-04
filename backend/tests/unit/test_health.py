"""Unit tests for the health router."""

from fastapi.testclient import TestClient

from app.api.v1.routers.health import HEALTH_STATUS_OK


def test_health_returns_200(client: TestClient) -> None:
    """GET /api/v1/health responds with HTTP 200.

    Args:
        client: Pytest fixture providing a FastAPI test client.
    """
    response = client.get("/api/v1/health")
    assert response.status_code == 200


def test_health_returns_ok_status(client: TestClient) -> None:
    """GET /api/v1/health response body contains status 'ok'.

    Args:
        client: Pytest fixture providing a FastAPI test client.
    """
    response = client.get("/api/v1/health")
    assert response.json() == {"status": HEALTH_STATUS_OK}
