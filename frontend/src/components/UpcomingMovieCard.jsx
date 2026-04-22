import { useState } from "react"
import { useNavigate } from "react-router-dom"

const labelStyles = {
    "Muy buena": "bg-reflector2 text-noche",
    "Buena":     "bg-reflector/90 text-noche",
    "Regular":   "bg-sombra/90 text-crema",
    "Floja":     "bg-bordo2/90 text-crema",
}

export default function UpcomingMovieCard({ movie, isLast, isFirst }) {
    const [expanded, setExpanded] = useState(false)
    const navigate = useNavigate()

    const labelClass = movie.predicted_rating_label
        ? (labelStyles[movie.predicted_rating_label] ?? "bg-sombra/60 text-pergamino")
        : null

    return (
        <div
            className={`relative z-0 hover:z-40 cursor-pointer group
            ${isLast ? "origin-right" : isFirst ? "origin-left" : "origin-center"}`}
            onMouseLeave={() => setExpanded(false)}
            onClick={() => navigate(`/movies/${movie.id}`)}>
            <div
                className="aspect-[2/3] rounded-md overflow-hidden bg-terciopelo
                          transition-transform duration-400 group-hover:scale-[1.55]
                          group-hover:-translate-y-2 group-hover:shadow-[0_20px_60px_rgba(0,0,0,0.9)]
                          relative">

                {labelClass && (
                    <div className={`absolute top-0 left-0 right-0 z-20 py-1 text-center
                                    text-[10px] font-sans font-medium tracking-widest uppercase
                                    ${labelClass}`}>
                        {movie.predicted_rating_label}
                    </div>
                )}

                <img
                    src={movie.poster_url}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                />
                <div className={`absolute inset-0 transition-all duration-300
                                ${expanded ?
                                  "bg-gradient-to-t from-black/95 via-black/95 to-black/70"
                                  : "bg-gradient-to-t from-black/80 via-black/95 to-transparent opacity-0 group-hover:opacity-100"}`}/>

                <div className="absolute bottom-0 left-0 right-0 p-3 z-10
                              opacity-0 translate-y-2
                              transition-all duration-300
                              group-hover:opacity-100 group-hover:translate-y-0">

                    <h3 className="font-display text-crema text-base leading-tight mb-1">
                        {movie.title}
                    </h3>

                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-pergamino text-xs">{movie.year}</span>
                    </div>

                    <p className={`text-pergamino text-xs transition-all duration-300
                      ${expanded ? "line-clamp-none" : "line-clamp-3"}`}>
                        {movie.overview}
                    </p>

                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            setExpanded(!expanded)
                        }}
                        className="mt-2 text-reflector text-xs hover:text-reflector2 transition-colors">
                        {expanded ? "menos ↑" : "más ↓"}
                    </button>
                </div>
            </div>
        </div>
    )
}
