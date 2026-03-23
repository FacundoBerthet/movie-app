"""
Capa de servicio para la API de TMDB.
Aca hay funciones mapper para convertir las respuestas JSON de TMDB en los modelos 
propios, y funciones async que realizan los requests HTTP.
"""

import httpx, asyncio, random
from datetime import date, timedelta
from app.errors.app_errors import UpstreamError, NotFoundError
from app.models.movie import (
    PaginatedMovies, MovieSummary, MovieDetail, Genre, CastMember, 
    StreamingProvider, WatchProviders, CrewHighlight, HeroMovie
)

# ---------------------------------------------------------------------------
# Mappers — dict crudo de TMDB → modelos
# ---------------------------------------------------------------------------

CREW_ROLES = {"Director", "Screenplay", "Novel", "Original Music Composer"}

def to_paginated_movies(data: dict) -> PaginatedMovies:
    return PaginatedMovies(
        list_of_movies=[to_movie_summary(movie) for movie in data["results"]],
        page=data["page"],
        total_pages=data["total_pages"],
        total_results=data["total_results"]
    )

def to_movie_summary(data: dict) -> MovieSummary:
    poster_path = data.get("poster_path")
    return MovieSummary(
        id=data["id"],
        title=data["title"],
        overview=data.get("overview"),
        year=data.get("release_date", "")[:4] or None,
        rating=data.get("vote_average"),
        poster_url=f"https://image.tmdb.org/t/p/w500{poster_path}" if poster_path else None
    )

def to_crew_highlights(data: dict) -> CrewHighlight:
    profile_path = data.get("profile_path")
    return CrewHighlight(
        role=data.get("job"),
        name=data.get("name"),
        profile_url=f"https://image.tmdb.org/t/p/w185{profile_path}" if profile_path else None
    )

def to_movie_detail(
        data: dict,
        credits_data: dict,
        providers_data: dict,
        recommendations_data: dict
) -> MovieDetail:
    cast = [to_cast_member(m) for m in credits_data.get("cast", [])]

    unique = set()
    crew_highlights = []
    for member in credits_data.get("crew", []):
        if member.get("job") in CREW_ROLES and member["name"] not in unique:
            unique.add(member["name"])
            crew_highlights.append(to_crew_highlights(member))

    watch_providers = to_watch_provider(providers_data) if providers_data else None

    recommendations = [to_movie_summary(r) for r in recommendations_data.get("results", [])]

    poster_path = data.get("poster_path")
    backdrop_path = data.get("backdrop_path")

    return MovieDetail(
        id = data["id"],
        title = data["title"],
        original_title=data.get("original_title"),
        overview = data.get("overview"),
        release_date = data.get("release_date"),
        poster_url = f"https://image.tmdb.org/t/p/w500{poster_path}" if poster_path else None,
        tagline=data.get("tagline"),
        runtime=data.get("runtime"),
        rating=data.get("vote_average"),
        backdrop_url=f"https://image.tmdb.org/t/p/original{backdrop_path}" if backdrop_path else None,
        genres=[Genre(id=g["id"], name=g["name"]) for g in data.get("genres", [])],
        cast=cast,
        crew_highlights=crew_highlights,
        watch_providers=watch_providers,
        recommendations=recommendations,
    )

def to_cast_member(data: dict) -> CastMember:
    profile_path = data.get("profile_path")
    return CastMember(
        id = data["id"],
        name = data.get("name"),
        character = data.get("character"),
        profile_url = f"https://image.tmdb.org/t/p/w185{profile_path}" if profile_path else None
    )

def to_streaming_provider(data: dict) -> StreamingProvider:
    logo_path = data.get("logo_path")
    return StreamingProvider(
        id = data.get("provider_id"),
        name = data.get("provider_name"),
        logo_url = f"https://image.tmdb.org/t/p/w92{logo_path}" if logo_path else None
    )

def to_watch_provider(data:dict) -> WatchProviders:
    return WatchProviders(
        stream= [to_streaming_provider(s) for s in data.get("flatrate", [])],
        rent = [to_streaming_provider(s) for s in data.get("rent", [])],
        buy = [to_streaming_provider(s) for s in data.get("buy", [])]
    )

def to_hero_movie(trending_movie: dict,
    detail_data: dict,
    region: str = "AR") -> HeroMovie:
    backdrop_path = trending_movie.get("backdrop_path")

    # logo — español primero, inglés si no hay, None si no hay ninguno
    logos = detail_data.get("images", {}).get("logos", [])
    logo_path = get_logo(logos)

    # watch providers
    providers_raw = detail_data.get("watch/providers", {}).get("results", {}).get(region.upper(), {})
    watch_providers = to_watch_provider(providers_raw) if providers_raw else None

    # director
    crew = detail_data.get("credits", {}).get("crew", [])
    director = None
    for member in crew:
        if member.get("job") == "Director":
            director = member.get("name")
            break

    return HeroMovie(
        id=trending_movie["id"],
        title=trending_movie["title"],
        overview=trending_movie.get("overview"),
        backdrop_url=f"https://image.tmdb.org/t/p/original{backdrop_path}" if backdrop_path else None,
        logo_url=f"https://image.tmdb.org/t/p/original{logo_path}" if logo_path else None,
        genres=[Genre(id=g["id"], name=g["name"]) for g in detail_data.get("genres", [])],
        director=director,
        watch_providers=watch_providers,
    )

# Funcion aux que toma el logo en español, de no haberlo toma el logo en ingles o sino None
def get_logo(logos: list) -> str | None:
    for logo in logos:
        if logo.get("iso_639_1") == "es":
            return logo.get("file_path")
    for logo in logos:
        if logo.get("iso_639_1") == "en":
            return logo.get("file_path")
    return None

# ---------------------------------------------------------------------------
# Llamadas a la API
# ---------------------------------------------------------------------------
async def get_now_playing(client: httpx.AsyncClient,
    language: str = "es-AR",
    region: str = "AR",
    page: int = 1) -> PaginatedMovies:
    """Devuelve películas con actualmente en cines."""
    params = {
        "language": language,
        "page": page,
        "sort_by": "popularity.desc",
    }

    try:
        response = await client.get("/movie/now_playing", params=params)
        response.raise_for_status()

    except httpx.TimeoutException:
        raise UpstreamError("TMDB request timed out")
    except httpx.HTTPStatusError as e:
        raise UpstreamError(f"TMDB returned status {e.response.status_code}")
    except httpx.RequestError:
        raise UpstreamError("Could not connect to TMDB")

    data = response.json()
    if "results" not in data:
        raise UpstreamError("Invalid response from TMDB")

    return to_paginated_movies(data)


async def get_upcoming_movies(client: httpx.AsyncClient,
    language: str = "es-AR",
    region: str = "AR",
    page: int = 1,
    days_ahead:int = 90,
    sort_by: str = "popularity.desc") -> PaginatedMovies:
    """Devuelve películas con estreno en cines dentro de los próximos `days_ahead` días."""

    today = date.today()
    end_date = today + timedelta(days=days_ahead)

    params = {
        "language": language,
        "page": page,
        "region": region,
        "sort_by": sort_by,
        "release_date.gte": today.isoformat(),
        "release_date.lte": end_date.isoformat(),
        "with_release_type": "2|3",
    }

    try:
        response = await client.get("/discover/movie", params=params)
        response.raise_for_status()

    except httpx.TimeoutException:
        raise UpstreamError("TMDB request timed out")
    except httpx.HTTPStatusError as e:
        raise UpstreamError(f"TMDB returned status {e.response.status_code}")
    except httpx.RequestError:
        raise UpstreamError("Could not connect to TMDB")

    data = response.json()
    if "results" not in data:
        raise UpstreamError("Invalid response from TMDB")

    return to_paginated_movies(data)


async def get_trending(client: httpx.AsyncClient,
    language: str = "es-AR") -> PaginatedMovies:
    """Devuelve películas populares esta semana."""
    params = {"language": language,
              "sort_by": "popularity.desc",}
    try:
        response = await client.get("/trending/movie/week", params=params)
        response.raise_for_status()
    except httpx.TimeoutException:
        raise UpstreamError("TMDB request timed out")
    except httpx.HTTPStatusError as e:
        raise UpstreamError(f"TMDB returned status {e.response.status_code}")
    except httpx.RequestError:
        raise UpstreamError("Could not connect to TMDB")

    data = response.json()
    if "results" not in data:
        raise UpstreamError("Invalid response from TMDB")
    return to_paginated_movies(data)


async def get_top_rated(client: httpx.AsyncClient,
    language: str = "es-AR",
    region: str = "AR",
    page: int = 1) -> PaginatedMovies:
    """Devuelve películas mejor valoradas históricamente."""
    params = {
        "language": language,
        "page": page,
    }
    try:
        response = await client.get("/movie/top_rated", params=params)
        response.raise_for_status()
    except httpx.TimeoutException:
        raise UpstreamError("TMDB request timed out")
    except httpx.HTTPStatusError as e:
        raise UpstreamError(f"TMDB returned status {e.response.status_code}")
    except httpx.RequestError:
        raise UpstreamError("Could not connect to TMDB")

    data = response.json()
    if "results" not in data:
        raise UpstreamError("Invalid response from TMDB")
    return to_paginated_movies(data)


async def search_movies(
    client: httpx.AsyncClient,
    query: str,
    language: str,
    page: int = 1) -> PaginatedMovies:
    """Busca películas por título en TMDB."""

    params = {
        "query": query,
        "language": language,
        "page": page,
    }

    try:
        response = await client.get("/search/movie", params=params)
        response.raise_for_status()

    except httpx.TimeoutException:
        raise UpstreamError("TMDB request timed out")
    except httpx.HTTPStatusError as e:
        raise UpstreamError(f"TMDB returned status {e.response.status_code}")
    except httpx.RequestError:
        raise UpstreamError("Could not connect to TMDB")

    data = response.json()
    if "results" not in data:
        raise UpstreamError("Invalid response from TMDB")

    return to_paginated_movies(data)

async def get_movie_details(client: httpx.AsyncClient,
                            movie_id: int,
                            region: str = "AR",
                            language: str = "es-AR") -> MovieDetail:
    """Obtiene el detalle completo de una película en un único round-trip paralelo.

    Realiza de forma concurrente los requests de detalles, credits, watch providers
    y recomendaciones, y los ensambla en un único objeto MovieDetail.
    """
    try:
        details, credits, providers, recommendations = await asyncio.gather(
            client.get(f"/movie/{movie_id}", params={"language": language}),
            client.get(f"/movie/{movie_id}/credits", params={"language": language}),
            client.get(f"/movie/{movie_id}/watch/providers"),
            client.get(f"/movie/{movie_id}/recommendations", params={"language": language}),
        )
        details.raise_for_status()
        credits.raise_for_status()
        providers.raise_for_status()
        recommendations.raise_for_status()

    except httpx.TimeoutException:
        raise UpstreamError("TMDB request timed out")
    except httpx.HTTPStatusError as e:
        if e.response.status_code == 404:
            raise NotFoundError("Movie not found")
        raise UpstreamError(f"TMDB returned status {e.response.status_code}")
    except httpx.RequestError:
        raise UpstreamError("Could not connect to TMDB")

    detail_data = details.json()
    credits_data = credits.json()
    providers_data = providers.json().get("results", {}).get(region.upper(), {})
    recommendations_data = recommendations.json()

    movie = to_movie_detail(detail_data, credits_data, providers_data, recommendations_data)

    return movie


async def get_hero_movie(client: httpx.AsyncClient,
    language: str = "es-AR",
    region: str = "AR") -> HeroMovie:
    """
    Devuelve una película aleatoria del trending del día con todos los datos para el hero banner.
    """

    # 1 — traer el trending del día
    try:
        trending_response = await client.get(
            "/trending/movie/day",
            params={"language": language}
        )
        trending_response.raise_for_status()
    except httpx.TimeoutException:
        raise UpstreamError("TMDB request timed out")
    except httpx.HTTPStatusError as e:
        raise UpstreamError(f"TMDB returned status {e.response.status_code}")
    except httpx.RequestError:
        raise UpstreamError("Could not connect to TMDB")

    trending_data = trending_response.json()
    if not trending_data.get("results"):
        raise UpstreamError("Invalid response from TMDB")

    # 2 — filtrar por popularidad y elegir random
    MIN_POPULARITY = 50
    results = trending_data["results"]
    popular = [m for m in results if m.get("popularity", 0) >= MIN_POPULARITY]
    trending_movie = random.choice(popular) if popular else random.choice(results)
    movie_id = trending_movie["id"]

    # 3 — traer el detalle con append_to_response
    try:
        detail_response = await client.get(
            f"/movie/{movie_id}",
            params={
                "language": language,
                "append_to_response": "images,watch/providers,credits",
                "include_image_language": "es,en,null",
            }
        )
        detail_response.raise_for_status()
    except httpx.TimeoutException:
        raise UpstreamError("TMDB request timed out")
    except httpx.HTTPStatusError as e:
        raise UpstreamError(f"TMDB returned status {e.response.status_code}")
    except httpx.RequestError:
        raise UpstreamError("Could not connect to TMDB")

    detail_data = detail_response.json()

    return to_hero_movie(trending_movie, detail_data, region)


async def get_genres(client: httpx.AsyncClient, language: str = "es-AR") -> list[Genre]:
    try:
        response = await client.get("/genre/movie/list", params={"language": language})
        response.raise_for_status()
    except httpx.TimeoutException:
        raise UpstreamError("TMDB request timed out")
    except httpx.HTTPStatusError as e:
        raise UpstreamError(f"TMDB returned status {e.response.status_code}")
    except httpx.RequestError:
        raise UpstreamError("Could not connect to TMDB")

    data = response.json()
    return [Genre(id=g["id"], name=g["name"]) for g in data.get("genres", [])]