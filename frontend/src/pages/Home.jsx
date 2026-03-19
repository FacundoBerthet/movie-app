import { useEffect, useState } from 'react'
import MovieGrid from '../components/MovieGrid'
import MovieRow from '../components/MovieRow'
import Navbar from '../components/Navbar'
import HeroBanner from '../components/HeroBanner'
import { getUpcomingMovies, getHeroMovie } from '../services/movieService'

export default function Home() {
    const[hero, setHero] = useState(null)
    const [movies, setMovies] = useState([])

    useEffect(() => {
        getUpcomingMovies().then(data => setMovies(data.list_of_movies))
        getHeroMovie().then(data => setHero(data))
    }, [])

    return(
        <div className='bg-sala'>

            <div className='hidden md:block'>    
                {hero && <HeroBanner movie={hero}/>}
            </div>

            <div className="relative z-10 max-w-6xl mx-auto mt-0 md:-mt-32 pt-20 md:pt-0">
                <MovieRow movies={movies} title={"En cartelera"} />
            </div>

            <div className="max-w-6xl mx-auto">
                <MovieRow movies={movies} title={"Próximos estrenos"} />
            </div>

            <div className="max-w-6xl mx-auto">
                <MovieRow movies={movies} title={"Populares esta semana"} />
            </div>

            <div className="max-w-6xl mx-auto">
                <MovieRow movies={movies} title={"Mejor valoradas"} />
            </div>

        </div>
    )
}