import { useEffect, useState } from 'react'
import MovieGrid from '../components/MovieGrid'
import MovieRow from '../components/MovieRow'
import Navbar from '../components/Navbar'
import HeroBanner from '../components/HeroBanner'
import { getUpcomingMovies, getHeroMovie, 
        getNowPlaying, getTrending, getTopRated} from '../services/movieService'

export default function Home() {
    const [hero, setHero] = useState(null)
    const [nowPlaying, setNowPlaying] = useState([])
    const [upcoming, setUpcoming] = useState([])
    const [trending, setTrending] = useState([])
    const [topRated, setTopRated] = useState([])

    useEffect(() => {
        Promise.all([
            getHeroMovie(),
            getNowPlaying(),
            getUpcomingMovies(),
            getTrending(),
            getTopRated(),
        ]).then(([heroData, nowData, upcomingData, trendingData, topData]) => {
            setHero(heroData)
            setNowPlaying(nowData.list_of_movies)
            setUpcoming(upcomingData.list_of_movies)
            setTrending(trendingData.list_of_movies)
            setTopRated(topData.list_of_movies)
        })
    }, [])


    return(
        <div className='bg-sala'>

            <div className='hidden md:block'>    
                {hero && <HeroBanner movie={hero}/>}
            </div>

            <div className="relative z-10 max-w-6xl mx-auto mt-0 md:-mt-44 pt-20 md:pt-0">
                <MovieRow movies={nowPlaying} title={"En cartelera"} />
            </div>

            <div className="max-w-6xl mx-auto">
                <MovieRow movies={upcoming} title={"Próximos estrenos"} />
            </div>

            <div className="max-w-6xl mx-auto">
                <MovieRow movies={trending} title={"Populares esta semana"} />
            </div>

            <div className="max-w-6xl mx-auto">
                <MovieRow movies={topRated} title={"Mejor valoradas"} />
            </div>

        </div>
    )
}