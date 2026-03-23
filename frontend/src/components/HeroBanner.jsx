import { useNavigate } from "react-router-dom"

export default function HeroBanner({movie}){
    const navigate = useNavigate()
    
    if (!movie) return null
    return (
        <div className="relative w-full h-[68vh] md:h-[75vh] lg:h-screen">

            {/* Backdrop fullscreen */}
            <div className="absolute inset-0">
                <img src={movie.backdrop_url} alt={movie.title} className="w-full h-full object-cover" />
            </div>
            {/* degradado izquierda hacia derecha */}
            <div className="absolute inset-0 bg-gradient-to-r from-noche/90 via-noche/55 to-transparent" />
            {/* degradado abajo hacia arriba para transición suave a las rows */}
            <div className="absolute inset-0 bg-gradient-to-b from-sala/50 via-transparent to-transparent" />
            {/* degradado abajo hacia arriba para transición suave a las rows */}
            <div className="absolute inset-0 bg-gradient-to-t from-sala via-transparent to-transparent" />

            {/* Contenido */}
            <div className="relative h-full flex items-end md:items-center lg:items-center justify-start px-4 pb-12 md:px-10 md:pb-44 md:pt-24 lg:pt-0 lg:pl-20 lg:pb-24">
                <div className="max-w-[92%] sm:max-w-sm md:max-w-md lg:max-w-xl flex flex-col gap-3 md:gap-5">
                    
                    {/* badge "Popular hoy" */}
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-xs text-reflector uppercase tracking-widest font-medium">
                            Popular hoy
                        </span>
                    </div>

                    {/* logo o título */}
                    {movie.logo_url ? (
                    <img
                        src={movie.logo_url}
                        alt={movie.title}
                        className="w-auto max-h-24 sm:max-h-28 md:max-h-44 lg:max-h-60 object-contain drop-shadow-2xl"
                    />
                    ) : (
                    <h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-crema leading-tight drop-shadow-lg">
                        {movie.title}
                    </h1>
                    )}

                    {/* géneros + director */}
                    <div className="flex flex-col gap-1">
                        <div className="flex flex-wrap gap-2">
                            {movie.genres.map(g => (
                                <span
                                    key={g.id}
                                    className="text-xs sm:text-sm md:text-lg lg:text-2xl font-medium text-reflector border border-reflector/40 px-1.5 md:px-2 py-0.5 rounded-full">
                                    {g.name}
                                </span>
                            ))}
                        </div>
                        {movie.director && (
                            <p className="text-xs sm:text-sm md:text-lg lg:text-2xl text-pergamino">
                                Dir. <span className=" font-medium text-reflector2">{movie.director}</span>
                            </p>
                        )}
                    </div>

                    {/* overview */}
                    <p className="text-xs sm:text-sm md:text-base lg:text-xl text-crema/80 leading-relaxed line-clamp-2 sm:line-clamp-3">
                        {movie.overview}
                    </p>
                
                    {/* watch providers */}
                    {movie.watch_providers?.stream?.length > 0 && (
                    <div className="flex items-center gap-2 md:gap-3">
                        <span className="text-[10px] md:text-xs text-pergamino uppercase tracking-widest">Disponible en</span>
                        <div className="flex gap-2">
                            {movie.watch_providers.stream.slice(0, 5).map(p => (
                                <img
                                    key={p.id}
                                    src={p.logo_url}
                                    alt={p.name}
                                    title={p.name}
                                    className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 rounded-lg object-cover"
                                />
                            ))}
                        </div>
                    </div>
                    )}

                    {/* botón ver detalles de la peli*/}
                    <button 
                        className="self-start mt-1.5 md:mt-2 px-4 py-1.5 md:px-6 md:py-2.5 bg-reflector text-noche text-[11px] md:text-sm font-semibold rounded-full hover:bg-reflector2 transition-colors duration-300 tracking-wide"
                        onClick={() => navigate(`/movies/${movie.id}`)}>
                        Ver detalle →
                    </button>

                </div>
            </div>
        </div>
    )
}