"""Modelos Pydantic usados por endpoints y capa de servicio."""

from pydantic import BaseModel

class Genre(BaseModel):
    id: int
    name: str

class CastMember(BaseModel):
    id: int 
    name: str
    character:str
    profile_url: str | None

class CrewHighlight(BaseModel):
    role: str   
    name: str
    profile_url: str | None

class StreamingProvider(BaseModel):
    id: int
    name: str
    logo_url: str

class WatchProviders(BaseModel):
    stream: list[StreamingProvider] 
    rent: list[StreamingProvider]
    buy: list[StreamingProvider]

class MovieSummary(BaseModel):
    """
    Clase para las listas de estrenos y busquedas
    """
    id: int
    title: str
    overview: str | None
    year: str | None
    rating: float | None
    poster_url: str | None
    predicted_rating: float | None = None
    predicted_rating_label: str | None = None

class MovieDetail(BaseModel):
    """
    Clase para las peliculas con todos sus detalles
    """
    id: int
    title: str
    original_title: str | None
    overview: str | None
    release_date: str | None
    poster_url: str | None
    tagline: str | None
    runtime: int | None
    rating: float | None
    backdrop_url: str | None
    genres: list[Genre]
    cast: list[CastMember]
    crew_highlights: list[CrewHighlight]
    watch_providers: WatchProviders | None
    recommendations: list[MovieSummary]

class HeroMovie(BaseModel):
    """
    Peli para el banner principal de home
    """
    id: int
    title: str
    overview: str | None
    backdrop_url: str | None
    logo_url: str | None
    genres: list[Genre]
    director: str | None
    watch_providers: WatchProviders | None


class PaginatedMovies(BaseModel):
    """Clase para respuestas paginadas de peliculas."""

    list_of_movies: list[MovieSummary]
    page: int
    total_pages: int
    total_results: int
