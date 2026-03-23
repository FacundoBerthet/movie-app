from fastapi import APIRouter, Depends, HTTPException
import httpx
from app.config import get_tmdb_client
from app.services.tmdb_service import get_genres
from app.errors.app_errors import UpstreamError
from app.models.movie import Genre

router = APIRouter(prefix="/genres", tags=["genres"])

@router.get("/", response_model=list[Genre])
async def genres(
    client: httpx.AsyncClient = Depends(get_tmdb_client),
    language: str = "es-AR"
):
    try:
        return await get_genres(client, language)
    except UpstreamError as e:
        raise HTTPException(status_code=502, detail=e.message)