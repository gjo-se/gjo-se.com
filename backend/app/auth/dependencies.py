"""Wiederverwendbare Dependency-Funktionen für das Auth-Modul.

Verwendung in anderen Feature-Modulen:

    from app.auth.dependencies import CurrentUser, require_admin

    @router.get("/protected")
    async def protected(user: CurrentUser) -> ...:
        ...
"""

from typing import Annotated

from fastapi import Depends, HTTPException, status

from app.auth.models import User
from app.auth.security import get_current_user

CurrentUser = Annotated[User, Depends(get_current_user)]
"""Type-Alias für die `get_current_user`-Dependency.

Wirft 401 wenn nicht eingeloggt, 403 wenn Account nicht verifiziert.
"""


async def require_admin(user: CurrentUser) -> User:
    """Dependency: Stellt sicher, dass der User die Rolle 'admin' hat.

    Args:
        user: Aktuell eingeloggter User (via get_current_user).

    Returns:
        User mit admin-Rolle.

    Raises:
        HTTPException 403: User ist kein Admin.
    """
    if user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required",
        )
    return user


AdminUser = Annotated[User, Depends(require_admin)]
"""Type-Alias für die `require_admin`-Dependency."""
