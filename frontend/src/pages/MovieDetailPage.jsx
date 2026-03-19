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
            <div className='max-w-7xl mx-auto px-5 pt-24'>
                <div className='relative w-full  rounded-2xl overflow-hidden aspect-video'>
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
                        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                            <span className="text-xs text-crema/70 uppercase tracking-widest">
                                Disponible en
                            </span>
                            <div className="flex gap-1.5">
                                {movie.watch_providers.stream.map(p => (
                                    <div key={p.id} className="w-8 h-8 rounded-lg bg-zinc-800 overflow-hidden">
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
                <div className='flex items-end gap-8 -mt-[29rem] px-8'>

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

                    {/* columna derecha — título, año, etc */}
                    <div className='z-10 pb-2 flex flex-col gap-3.5'>

                        {/* Titulo y año */}
                        <div className='flex items-baseline gap-3'>
                            <h1 className='font-display text-6xl text-crema'>
                                {movie.title}
                            </h1>
                            <span className='text-pergamino text-4xl font-sans'>
                                ({movie.release_date?.slice(0, 4)})
                            </span>
                        </div>
                        
                        {/* Titulo original + fecha completa*/}
                        <div className="flex items-center gap-3 text-xl text-pergamino">
                            {movie.original_title && movie.original_title !== movie.title && (
                                <span>
                                    Título original: <span className="text-crema italic">{movie.original_title}</span>
                                </span>
                            )}
                            {movie.original_title && movie.original_title !== movie.title && movie.release_date && (
                                <span className="text-reflector/40 text-2xl">•</span>
                            )}
                            {movie.release_date && (
                                <span className='text-crema'>{movie.release_date.replaceAll("-", "/")}</span>
                            )}
                        </div>

                        {/* géneros · runtime · rating */}
                        <div className='flex items-center gap-2 text-2xl text-pergamino flex-wrap'>
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
                        <p className='text-crema/90 text-xl'>
                            {movie.overview}
                        </p>

                    </div>

                </div>

                {/* crew highlights */}
                {movie.crew_highlights?.length > 0 && (
                    <div className="flex justify-evenly flex-wrap pt-6 border-t border-reflector/10 mt-6">
                        {movie.crew_highlights.map((member, i) => (
                            <div key={i} className="flex flex-col gap-0.5">

                                {/* foto o iniciales */}
                                {member.profile_url ? (
                                    <img
                                        src={member.profile_url}
                                        alt={member.name}
                                        className="w-52 h-72 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-52 h-72 rounded-full bg-cortina border border-reflector/20 flex items-center justify-center">
                                        <span className="text-reflector text-5xl font-display font-bold">
                                            {member.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                                        </span>
                                    </div>
                                )}

                                {/* Nombre y rol */}
                                <span className="text-crema text-2xl font-medium font-display">
                                    {member.name}
                                </span>
                                <span className="text-pergamino text-lg uppercase tracking-widest">
                                    {member.role}
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                {/* reparto principal */}
                {movie.cast?.length > 0 && (
                    <div className="mt-14 px-8">
                        <h2 className="font-display text-3xl text-crema mb-4">
                            Reparto principal
                        </h2>
                        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                            {movie.cast.map(member => (
                                <CastCard key={member.id} member={member} />
                            ))}
                        </div>
                    </div>
                )}

                {/* recomendaciones */}
                {movie.recommendations?.length > 0 && (
                    <div className="mt-12 pt-6 border-t border-reflector/30">
                        <MovieRow
                            movies={movie.recommendations}
                            title="También te puede gustar"
                        />
                    </div>
                )}

            </div>

        </div>
    )
}