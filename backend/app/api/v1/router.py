"""Central API router for version 1.

All sub-routers are registered here and included in main.py
under the /api/v1 prefix.
"""

from fastapi import APIRouter

from app.api.v1.routers import health
from app.auth.router import router as auth_router

api_router = APIRouter()

api_router.include_router(health.router, tags=["health"])
api_router.include_router(auth_router, prefix="/auth", tags=["auth"])
