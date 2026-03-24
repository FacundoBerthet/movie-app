from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import get_settings, close_tmdb_client

from app.routers import (
    movies, genres
)

settings = get_settings()


@asynccontextmanager
async def lifespan(_app: FastAPI):
    yield
    await close_tmdb_client()

app = FastAPI(
    title=settings.app_name,
    description="API Backend para busqueda de peliculas y proximos lanzamientos",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_methods=["GET"],
    allow_headers=["*"],
)

app.include_router(movies.router)
app.include_router(genres.router)


@app.get("/health", tags=["health"])
async def health() -> dict[str, str]:
    """Healthcheck simple para monitoreo y probes de deploy."""
    return {
        "status": "ok",
        "service": "backend",
    }