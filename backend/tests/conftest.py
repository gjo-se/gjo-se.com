"""Shared pytest fixtures for all tests."""

import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture()
def client() -> TestClient:
    """Return a synchronous test client for the FastAPI app.

    Returns:
        TestClient: Configured test client instance.
    """
    return TestClient(app)
