"""Central API router for version 1.

All sub-routers are registered here and included in main.py
under the /api/v1 prefix.
"""

from fastapi import APIRouter

from app.api.v1.routers import health

api_router = APIRouter()

api_router.include_router(health.router, tags=["health"])
