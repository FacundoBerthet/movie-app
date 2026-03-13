import httpx

from fastapi import APIRouter, Depends, Query, Path, HTTPException
from app.services.tmdb_service import get_upcoming_movies, search_movies, get_movie_details
from app.config import get_tmdb_client
from app.errors.app_errors import UpstreamError, NotFoundError
from app.models.movie import PaginatedMovies, MovieDetail

router = APIRouter(prefix="/movies", tags=["movies"])


@router.get("/upcoming", response_model=PaginatedMovies,
    summary="Obtener los proximos estrenos",
    description="""
    Devuelve una lista con los proximos estrenos de TMDB.
    Se puede filtrar por lenguage, region, y numero de dias a tomar
    """)
async def upcoming_movies(
    client: httpx.AsyncClient = Depends(get_tmdb_client),
    language: str = Query(default="es-AR"),
    region: str = Query(default="AR"),
    page: int = Query(default=1, ge=1),
    days_ahead: int = Query(default=30, ge=0, le=365)):
    
    try:
        return await get_upcoming_movies(client, language, region, page, days_ahead)
    except UpstreamError as e:
        raise HTTPException(status_code=502, detail=e.message)



@router.get("/search", response_model=PaginatedMovies,
    summary="Buscar películas",
    description="Busca películas por título en TMDB.")
async def search(
    client: httpx.AsyncClient = Depends(get_tmdb_client),
    query: str = Query(min_length=2, max_length=50),
    language: str = Query(default= "es-AR"),
    page: int = Query(default=1, ge=1)):

    try: 
        return await search_movies(client, query, language, page)
    except UpstreamError as e:
        raise HTTPException(status_code=502, detail=e.message)




@router.get("/{movie_id}", response_model=MovieDetail,
    summary="Detalle de una película",
    description="""
    Devuelve el detalle completo de una 
    película incluyendo cast, géneros y plataformas.
    """)
async def movie_details(
    client: httpx.AsyncClient = Depends(get_tmdb_client),
    movie_id: int = Path(gt=0),
    region: str = Query(default="AR"),
    language: str = Query(default="es-AR")
    ):
    
    try:
        return await get_movie_details(client, movie_id, region, language)
    except NotFoundError as e:
        raise HTTPException(status_code=404, detail=e.message)
    except UpstreamError as e:
        raise HTTPException(status_code=502, detail=e.message)