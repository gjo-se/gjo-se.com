"""Health check router.

Provides a simple liveness endpoint for infrastructure probes.
"""

from fastapi import APIRouter
from fastapi.responses import JSONResponse

HEALTH_STATUS_OK = "ok"

router = APIRouter()


@router.get(
    "/health",
    summary="Health check",
    response_description="Service status",
    status_code=200,
    tags=["health"],
)
def get_health() -> JSONResponse:
    """Return the current health status of the service.

    Returns:
        JSONResponse: A JSON object with a single ``status`` field set to ``"ok"``.
    """
    return JSONResponse(content={"status": HEALTH_STATUS_OK})
