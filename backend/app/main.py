from fastapi import FastAPI
from app.config import get_settings

from app.routers import movies

settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    description="API Backend para busqueda de peliculas y proximos lanzamientos"
)

app.include_router(movies.router)
