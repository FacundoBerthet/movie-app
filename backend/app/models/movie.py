from pydantic import BaseModel

class Genre(BaseModel):
    id: int
    name: str

class CastMember(BaseModel):
    id: int 
    name: str
    character:str
    profile_url: str | None

class StreamingProvider(BaseModel):
    provider_id: int
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
    genres: list[Genre]

class MovieDetail(BaseModel):
    """
    Clase para las peliculas con todos sus detalles
    """
    id: int
    title: str
    overview: str | None
    release_date: str | None
    poster_url: str | None
    tagline: str | None
    runtime: int | None
    backdrop_url: str | None
    genres: list[Genre]
    cast: list[CastMember]
    watch_providers: WatchProviders | None
    recommendations: list[MovieSummary]

class PaginatedMovies(BaseModel):
    list: list[MovieSummary]
    page: int
    total_pages: int
    total_results: int
