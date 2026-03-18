import { useParams } from 'react-router-dom'
import { getMovieDetail } from '../services/movieService'
import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'

export default function MovieDetailPage() {
    const { id } = useParams()
    const [movie, setMovie] = useState(null)

    useEffect(() => {
        getMovieDetail(id).then(data => setMovie(data))
    }, [id])

    if (!movie) return null

    return (
        <div className='bg-sala min-h-screen text-crema'>
            <Navbar />

            {/* Backdrop */}
            <div className='max-w-7xl mx-auto px-5 pt-24'>
                <div className='relative w-full  rounded-2xl overflow-hidden aspect-video'>
                    <img 
                        src={movie.backdrop_url} 
                        alt={movie.title}
                        className='w-full h-full object-cover'
                    />
                    {/* degradado*/}
                    <div className="absolute inset-0 bg-gradient-to-t from-sala/40 via-sala/10 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-b from-sala via-sala/10 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-sala/10 via-sala/10 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-l from-sala/10 via-sala/10 to-transparent" />

                </div>

                {/* poster + detalles */}
                <div className='flex items-end gap-8 -mt-96 px-8'>

                    {/* Poster y tagline*/}        
                    <div className='flex flex-col items-center gap-5 z-10'>
                        <img 
                            src={movie.poster_url} 
                            alt={movie.title} 
                            className='w-80 rounded-lg shadow-2xl'    
                        />
                        {movie.tagline && (
                            <p className="text-pergamino text-base italic text-center w-80">
                                "{movie.tagline}"
                            </p>
                        )}
                    </div>

                    <div>

                        
                    </div>

                </div>

            </div>

        </div>
    )
}