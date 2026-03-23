import { useParams } from 'react-router-dom'
import { getMovieDetail } from '../services/movieService'
import { useEffect, useState } from 'react'
import CastCard from '../components/CastCard'
import MovieRow from '../components/MovieRow'

export default function MovieDetailPage() {
    const { id } = useParams()
    const [movie, setMovie] = useState(null)

    useEffect(() => {
        getMovieDetail(id).then(data => setMovie(data))
    }, [id])

    if (!movie) return null

    return (
        <div className='bg-sala min-h-screen text-crema'>

            {/* Backdrop */}
            <div className='max-w-7xl mx-auto px-4 md:px-5 pt-20 md:pt-24'>
                <div className='relative w-full rounded-xl md:rounded-2xl overflow-hidden aspect-video'>
                    <img 
                        src={movie.backdrop_url} 
                        alt={movie.title}
                        className='w-full h-full object-cover'
                    />
                    {/* degradado*/}
                    <div className="absolute inset-0 bg-gradient-to-t from-sala via-sala/40 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-b from-sala via-sala/5 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-sala/10 via-sala/5 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-l from-sala/10 via-sala/5 to-transparent" />

                    {/* watch providers — sobre el backdrop arriba derecha */}
                    {movie.watch_providers?.stream?.length > 0 && (
                        <div className="absolute top-2 right-2 md:top-3 md:right-3 lg:top-4 lg:right-4 z-10 flex items-center gap-1 md:gap-2">
                            <span className="text-[10px] md:text-xs text-crema/70 uppercase tracking-widest">
                                Disponible en
                            </span>
                            <div className="flex gap-1 md:gap-1.5">
                                {movie.watch_providers.stream.map(p => (
                                    <div key={p.id} className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 rounded-lg bg-zinc-800 overflow-hidden">
                                        <img
                                            src={p.logo_url}
                                            alt={p.name}
                                            title={p.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>

                {/* poster + detalles */}
                <div className='flex flex-col md:flex-row md:items-end gap-4 md:gap-6 lg:gap-8 -mt-20 md:-mt-40 lg:-mt-[29rem] px-2 md:px-4 lg:px-8'>

                    {/* Poster y tagline*/}        
                    <div className='flex flex-col items-center gap-3 md:gap-4 lg:gap-5 z-10'>
                        <img 
                            src={movie.poster_url} 
                            alt={movie.title} 
                            className='w-40 md:w-56 lg:min-w-80 lg:w-auto rounded-lg shadow-2xl h-auto'    
                        />
                        {movie.tagline && (
                            <p className="text-pergamino text-sm lg:text-base italic text-center w-44 md:w-56 lg:w-80">
                                "{movie.tagline}"
                            </p>
                        )}
                    </div>

                    {/* columna derecha — título, año, etc */}
                    <div className='z-10 pb-1 md:pb-2 flex flex-col gap-2 md:gap-3 lg:gap-3.5'>

                        {/* Titulo y año */}
                        <div className='flex items-baseline gap-2 lg:gap-3 flex-wrap'>
                            <h1 className='font-display text-3xl md:text-4xl lg:text-6xl text-crema'>
                                {movie.title}
                            </h1>
                            <span className='text-pergamino text-xl md:text-2xl lg:text-4xl font-sans'>
                                ({movie.release_date?.slice(0, 4)})
                            </span>
                        </div>
                        
                        {/* Titulo original + fecha completa*/}
                        <div className="flex items-center gap-2 md:gap-3 text-sm md:text-base lg:text-xl text-pergamino flex-wrap">
                            {movie.original_title && movie.original_title !== movie.title && (
                                <span>
                                    Título original: <span className="text-crema italic">{movie.original_title}</span>
                                </span>
                            )}
                            {movie.original_title && movie.original_title !== movie.title && movie.release_date && (
                                <span className="text-reflector/40 text-lg lg:text-2xl">•</span>
                            )}
                            {movie.release_date && (
                                <span className='text-crema'>{movie.release_date.replaceAll("-", "/")}</span>
                            )}
                        </div>

                        {/* géneros · runtime · rating */}
                        <div className='flex items-center gap-1 md:gap-2 text-sm md:text-lg lg:text-2xl text-pergamino flex-wrap'>
                            <div className='flex gap-1 flex-wrap'>
                                {movie.genres.map((g, i) => (
                                    <span key={g.id}>
                                        {g.name}
                                        {i < movie.genres.length - 1 &&
                                            <span className='text-reflector/40 mx-1'>•</span>
                                        }
                                    </span>
                                ))}
                            </div>
                            <span className='text-reflector/40'>•</span>
                            <span>{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span>
                            <span className='text-reflector/40'>•</span>
                            <span className='text-reflector font-medium'>★ {movie.rating?.toFixed(1)}</span>
                        </div>

                        {/* overview */}
                        <p className='text-crema/90 text-sm md:text-base lg:text-xl'>
                            {movie.overview}
                        </p>

                    </div>

                </div>

                {/* crew highlights */}
                {movie.crew_highlights?.length > 0 && (
                    <div className="flex flex-col items-center gap-6 md:gap-8 md:flex-row md:justify-evenly md:flex-wrap pt-4 md:pt-5 lg:pt-6 border-t border-reflector/10 mt-4 md:mt-5 lg:mt-6">
                        {movie.crew_highlights.map((member, i) => (
                            <div key={i} className="flex flex-col items-center md:items-start gap-0.5">

                                {/* foto o iniciales */}
                                {member.profile_url ? (
                                    <img
                                        src={member.profile_url}
                                        alt={member.name}
                                        className="w-34 h-48 md:w-40 md:h-56 lg:w-52 lg:h-72 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-32 h-44 md:w-40 md:h-56 lg:w-52 lg:h-72 rounded-full bg-cortina border border-reflector/20 flex items-center justify-center">
                                        <span className="text-reflector text-3xl md:text-4xl lg:text-5xl font-display font-bold">
                                            {member.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                                        </span>
                                    </div>
                                )}

                                {/* Nombre y rol */}
                                <span className="text-crema text-lg md:text-xl lg:text-2xl font-medium font-display">
                                    {member.name}
                                </span>
                                <span className="text-pergamino text-xs md:text-sm lg:text-lg uppercase tracking-widest">
                                    {member.role}
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                {/* reparto principal */}
                {movie.cast?.length > 0 && (
                    <div className="mt-10 md:mt-12 lg:mt-14 px-2 md:px-4 lg:px-8">
                        <h2 className="font-display text-2xl lg:text-3xl text-crema mb-3 md:mb-4">
                            Reparto principal
                        </h2>
                        <div className="flex gap-3 md:gap-4 overflow-x-auto pb-4 scrollbar-hide">
                            {movie.cast?.slice(0, 12).map(member => (
                                <CastCard key={member.id} member={member} />
                            ))}
                        </div>
                    </div>
                )}

            </div>

            {/* recomendaciones */}
            {movie.recommendations?.length > 0 && (
                <div className="mt-8 md:mt-10 lg:mt-12 pt-4 md:pt-5 lg:pt-6 border-t border-reflector/30">
                    <div className="max-w-6xl mx-auto md:px-4 lg:px-0">
                        <MovieRow
                            movies={movie.recommendations}
                            title="También te puede gustar"
                        />
                    </div>
                </div>
            )}

        </div>
    )
}