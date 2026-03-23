import { useSearchParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { discoverMovies } from '../services/movieService'
import MovieGrid from '../components/MovieGrid'

const TYPE_LABELS = {
    upcoming: "Próximos estrenos",
    now_playing: "En cartelera",
    trending: "Tendencias",
    top_rated: "Top rated",
}

export default function DiscoverPage() {
    const [searchParams, setSearchParams] = useSearchParams()
    const type = searchParams.get("type") || null
    const page = parseInt(searchParams.get("page") || "1")

    const [results, setResults] = useState([])
    const [totalPages, setTotalPages] = useState(0)
    const [totalResults, setTotalResults] = useState(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        discoverMovies({ type, page })
            .then(data => {
                setResults(data.list_of_movies)
                setTotalPages(data.total_pages)
                setTotalResults(data.total_results)
            })
            .finally(() => setLoading(false))
    }, [type, page])

    function goToPage(newPage) {
        setSearchParams({ ...(type && { type }), page: newPage })
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <div className="bg-sala min-h-screen text-crema pt-28 pb-16">
            <div className="max-w-6xl mx-auto px-6">

                <div className="mb-8">
                    <h1 className="font-display text-3xl text-crema">
                        {type ? TYPE_LABELS[type] : "Explorar"}
                    </h1>
                    {!loading && totalResults > 0 && (
                        <p className="text-pergamino text-sm mt-1">
                            {totalResults.toLocaleString()} películas
                        </p>
                    )}
                </div>

                {!loading && results.length === 0 && (
                    <p className="text-pergamino text-center mt-20">
                        No hay resultados.
                    </p>
                )}

                {!loading && results.length > 0 && (
                    <MovieGrid movies={results} />
                )}

                {!loading && totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-12">
                        <button
                            onClick={() => goToPage(page - 1)}
                            disabled={page === 1}
                            className={`px-4 py-2 rounded-full text-sm transition-colors
                            ${page === 1
                                ? 'text-sombra pointer-events-none'
                                : 'text-reflector hover:text-reflector2'}`}>
                            ← Anterior
                        </button>
                        <span className="text-pergamino text-sm px-4">
                            {page} / {Math.min(totalPages, 500)}
                        </span>
                        <button
                            onClick={() => goToPage(page + 1)}
                            disabled={page >= Math.min(totalPages, 500)}
                            className={`px-4 py-2 rounded-full text-sm transition-colors
                            ${page >= Math.min(totalPages, 500)
                                ? 'text-sombra pointer-events-none'
                                : 'text-reflector hover:text-reflector2'}`}>
                            Siguiente →
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}