from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import get_settings

from app.routers import (
    movies, genres
)

settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    description="API Backend para busqueda de peliculas y proximos lanzamientos"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_methods=["GET"],
    allow_headers=["*"],
)

app.include_router(movies.router)
app.include_router(genres.router)