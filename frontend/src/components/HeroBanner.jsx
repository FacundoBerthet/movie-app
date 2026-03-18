import { useNavigate } from "react-router-dom"

export default function HeroBanner({movie}){
    const navigate = useNavigate()
    
    if (!movie) return null
    return (
        <div className="relative w-full h-screen">

            {/* Backdrop fullscreen */}
            <div className="absolute inset-0">
                <img src={movie.backdrop_url} alt={movie.title} className="w-full h-full object-cover" />
            </div>
            {/* degradado izquierda hacia derecha */}
            <div className="absolute inset-0 bg-gradient-to-l from-noche/90 via-noche/40 to-transparent" />
            {/* degradado abajo hacia arriba para transición suave a las rows */}
            <div className="absolute inset-0 bg-gradient-to-b from-sala/50 via-transparent to-transparent" />
            {/* degradado abajo hacia arriba para transición suave a las rows */}
            <div className="absolute inset-0 bg-gradient-to-t from-sala via-transparent to-transparent" />

            {/* Contenido */}
            <div className="relative h-full flex items-center justify-end pr-12 pb-12">
                <div className="max-w-md flex flex-col gap-5">
                    
                    {/* badge "Popular hoy" */}
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-xs text-reflector uppercase tracking-widest font-medium">
                            Popular hoy
                        </span>
                    </div>

                    {/* logo o título */}
                    {movie.logo_url ? (
                    <img
                        src={movie.logo_url}
                        alt={movie.title}
                        className="w-100 object-contain drop-shadow-2xl"
                    />
                    ) : (
                    <h1 className="font-display text-5xl font-bold text-crema leading-tight drop-shadow-lg">
                        {movie.title}
                    </h1>
                    )}

                    {/* géneros + director */}
                    <div className="flex flex-col gap-1">
                        <div className="flex flex-wrap gap-2">
                            {movie.genres.map(g => (
                                <span
                                    key={g.id}
                                    className="text-2xl font-medium text-reflector border border-reflector/40 px-2 py-0.5 rounded-full">
                                    {g.name}
                                </span>
                            ))}
                        </div>
                        {movie.director && (
                            <p className="text-2xl text-pergamino">
                                Dir. <span className=" font-medium text-reflector2">{movie.director}</span>
                            </p>
                        )}
                    </div>

                    {/* overview */}
                    <p className="text-xl text-crema/80 leading-relaxed line-clamp-3">
                        {movie.overview}
                    </p>
                
                    {/* watch providers */}
                    {movie.watch_providers?.stream?.length > 0 && (
                    <div className="flex items-center gap-3">
                        <span className="text-xs text-pergamino uppercase tracking-widest">Disponible en</span>
                        <div className="flex gap-2">
                            {movie.watch_providers.stream.map(p => (
                                <img
                                    key={p.provider_id}
                                    src={`https://image.tmdb.org/t/p/w92${p.logo_url}`}
                                    alt={p.name}
                                    title={p.name}
                                    className="w-8 h-8 rounded-lg object-cover"
                                />
                            ))}
                        </div>
                    </div>
                    )}

                    {/* botón ver detalles de la peli*/}
                    <button 
                        className="self-start mt-2 px-6 py-2.5 bg-reflector text-noche text-sm font-semibold rounded-full hover:bg-reflector2 transition-colors duration-300 tracking-wide"
                        onClick={() => navigate('/movies/${movie.id}')}>
                        Ver detalle →
                    </button>

                </div>
            </div>
        </div>
    )
}