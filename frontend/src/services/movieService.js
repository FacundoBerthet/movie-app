import { upcomingMoviesMock } from "../mocks/movies"

const USE_MOCK = true
const BASE_URL = "http://localhost:8000"

export async function getUpcomingMovies({ page = 1 } = {}) {
  if (USE_MOCK) {
    return upcomingMoviesMock
  }
  const res = await fetch(`${BASE_URL}/movies/upcoming?page=${page}`)
  if (!res.ok) throw new Error("Error al obtener estrenos")
  return res.json()
}