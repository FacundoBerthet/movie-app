import { useEffect, useState } from 'react'
import MovieGrid from '../components/MovieGrid'
import { getUpcomingMovies } from '../services/movieService'

export default function Home() {
    const [movies, setMovies] = useState([])

    useEffect(() => {
        getUpcomingMovies().then(data => setMovies(data.results))
    }, [])

    return(
        <div className="bg-zinc-950 min-h-screen">
            <h2 className="text-white text-2xl font-bold px-6 pt-6">Próximos estrenos</h2>
            <MovieGrid movies={movies} />
        </div>
    )
}