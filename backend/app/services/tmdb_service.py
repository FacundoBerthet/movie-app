import httpx
from datetime import date, timedelta
from app.errors.app_errors import UpstreamError
from app.models.movie import PaginatedMovies, MovieSummary

def to_paginated_movies(data: dict) -> PaginatedMovies:
    return PaginatedMovies(
        list=[to_movie_summary(movie) for movie in data["results"]],
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
        poster_url=f"https://image.tmdb.org/t/p/w500{poster_path}" if poster_path else None,
        genres=[]  
    )


async def get_upcoming_movies(client: httpx.AsyncClient,
    language: str = "es-AR",
    region: str = "AR",
    page: int = 1,
    days_ahead:int = 30) -> PaginatedMovies:

    today = date.today()
    end_date = today + timedelta(days=days_ahead)

    params = {
        "language": language,
        "region": region.upper(),
        "page": page,
        "sort_by": "primary_release_date.asc",
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