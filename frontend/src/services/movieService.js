import { upcomingMoviesMock } from "../mocks/movies"
import {mockHero}  from "../mocks/MovieHero"
import { movieDetailMock } from "../mocks/movieDetail"

const USE_MOCK = false
const BASE_URL = "http://localhost:8000"

export async function getUpcomingMovies({ page = 1 } = {}) {
    if (USE_MOCK) return upcomingMoviesMock
    const res = await fetch(`${BASE_URL}/movies/upcoming?page=${page}`)
    if (!res.ok) throw new Error("Error al obtener estrenos")
    return res.json()
}

export async function getHeroMovie() {
    if (USE_MOCK) return mockHero
    const res = await fetch(`${BASE_URL}/movies/hero`)
    if (!res.ok) throw new Error("Error al obtener hero")
    return res.json()
}

export async function getMovieDetail(id) {
    if (USE_MOCK) return movieDetailMock
    const res = await fetch(`${BASE_URL}/movies/${id}`)
    if (!res.ok) throw new Error("Error al obtener detalle")
    return res.json()
}

export async function getNowPlaying({ page = 1 } = {}) {
    const res = await fetch(`${BASE_URL}/movies/now_playing?page=${page}`)
    if (!res.ok) throw new Error("Error al obtener en cartelera")
    return res.json()
}

export async function getTrending() {
    const res = await fetch(`${BASE_URL}/movies/trending`)
    if (!res.ok) throw new Error("Error al obtener tendencias")
    return res.json()
}

export async function getTopRated({ page = 1 } = {}) {
    const res = await fetch(`${BASE_URL}/movies/top_rated?page=${page}`)
    if (!res.ok) throw new Error("Error al obtener mejor valoradas")
    return res.json()
}

export async function searchMovies({ query, page = 1 } = {}) {
    if (USE_MOCK) return upcomingMoviesMock 
    const res = await fetch(`${BASE_URL}/movies/search?query=${encodeURIComponent(query)}&page=${page}`)
    if (!res.ok) throw new Error("Error al buscar películas")
    return res.json()
}