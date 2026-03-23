import httpx
from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Variables de entorno necesarias para el backend."""

    app_name: str = "Movie App API"

    tmdb_api_key: str
    tmdb_base_url: str
    backend_cors_origins: str = "http://localhost:5173,http://localhost:4173"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8"
    )

    @property
    def cors_origins(self) -> list[str]:
        """Convierte BACKEND_CORS_ORIGINS en lista de origins válidos."""
        return [origin.strip() for origin in self.backend_cors_origins.split(",") if origin.strip()]

@lru_cache
def get_settings() -> Settings:
    return Settings()

@lru_cache
def get_tmdb_client() -> httpx.AsyncClient:
    """Crea un AsyncClient cacheado con base_url, api_key y timeout por defecto."""

    settings = get_settings()
    return httpx.AsyncClient(
        base_url=settings.tmdb_base_url,
        params={"api_key": settings.tmdb_api_key},
        timeout=10.0,
    )