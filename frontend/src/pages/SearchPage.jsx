// pages/SearchPage.jsx
import { useSearchParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { searchMovies } from '../services/movieService'
import MovieGrid from '../components/MovieGrid'

export default function SearchPage() {
    const [searchParams, setSearchParams] = useSearchParams()
    const query = searchParams.get('q') || ''
    const page = parseInt(searchParams.get('page') || '1')

    const [results, setResults] = useState([])
    const [totalPages, setTotalPages] = useState(0)
    const [totalResults, setTotalResults] = useState(0)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!query) return

        const fetchData = async () => {
            setLoading(true)
            try {
                const data = await searchMovies({ query, page })
                setResults(data.list_of_movies)
                setTotalPages(data.total_pages)
                setTotalResults(data.total_results)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [query, page])

    function goToPage(newPage) {
        setSearchParams({ q: query, page: newPage })
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <div className="bg-sala min-h-screen text-crema pt-28 pb-16">
            <div className="max-w-6xl mx-auto px-6">

                {/* header */}
                {query && (
                    <div className="mb-8">
                        <h1 className="font-display text-3xl text-crema">
                            Resultados para{' '}
                            <span className="text-reflector">"{query}"</span>
                        </h1>
                        {!loading && totalResults > 0 && (
                            <p className="text-pergamino text-sm mt-1">
                                {totalResults} películas encontradas
                            </p>
                        )}
                    </div>
                )}

                {/* sin query */}
                {!query && (
                    <p className="text-pergamino text-center mt-20">
                        Escribí algo en el buscador para encontrar películas.
                    </p>
                )}

                {/* sin resultados */}
                {!loading && query && results.length === 0 && (
                    <p className="text-pergamino text-center mt-20">
                        No encontramos resultados para "{query}".
                    </p>
                )}

                {/* grid */}
                {!loading && results.length > 0 && (
                    <MovieGrid movies={results} />
                )}

                {/* paginación */}
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
                            {page} / {totalPages}
                        </span>

                        <button
                            onClick={() => goToPage(page + 1)}
                            disabled={page === totalPages}
                            className={`px-4 py-2 rounded-full text-sm transition-colors
                            ${page === totalPages
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