import httpx

from fastapi import APIRouter, Depends, Query, HTTPException
from app.services.tmdb_service import get_upcoming_movies
from app.config import get_tmdb_client
from app.errors.app_errors import UpstreamError

router = APIRouter(prefix="/movies", tags=["movies"])


@router.get("/upcoming",
            summary="Obtener los proximos estrenos",
            description="""
            Devuelve una lista con los proximos estrenos de TMDB.
            Se puede filtrar por lenguage, region, y numero de dias a tomar
            """)
async def upcoming_movies(client: httpx.AsyncClient = Depends(get_tmdb_client),
                          language: str = Query(default="es-AR"),
                          region: str = Query(default="AR"),
                          page: int = Query(default=1, ge=1),
                          days_ahead: int = Query(default=30, ge=0, le=365)):
    try:
        return await get_upcoming_movies(client, language, region, page, days_ahead)
    except UpstreamError as e:
        raise HTTPException(status_code=502, detail=e.message)