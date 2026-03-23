import { useState } from "react"
import { useNavigate } from "react-router-dom"
import MovieCard from "./MovieCard"
import useColumns from "../hooks/useColumns"

export default function MovieRow({ title, movies, type }) {
    const navigate = useNavigate()
    const perPage = useColumns()
    const [index, setIndex] = useState(0)
    const visibles = movies.slice(index, index + perPage)

    const gridCols = {
        2: "grid-cols-2",
        3: "grid-cols-3",
        4: "grid-cols-4",
        5: "grid-cols-5",
    }

    const nextMovies = () => {
    if (index + perPage < movies.length) setIndex(index + perPage)}

    const previousMovies = () => {
    if (index > 0) setIndex(index - perPage)}

    const totalPages = Math.ceil(movies.length / perPage)
    const actualPage = Math.floor(index / perPage)

    return (
        <div className="mb-12 group/row relative">

            {/* título + indicadores */}
            <div className="flex justify-between gap-1 sm:gap-3 mb-3 pl-6 mr-8">
                <h2 
                    onClick={() => type && navigate(`/discover?type=${type}`)}
                    className={`font-sans text-reflector text-xl 
                        ${type ? 'cursor-pointer hover:text-reflector2 transition-colors' : ''}`}>
                        {title}
                </h2>
                <div className="hidden sm:flex items-center gap-1">
                {Array.from({ length: totalPages }).map((_, i) => (
                    <div
                    key={i}
                    className={`h-[2px] sm:h-[2px] w-4 sm:w-8 transition-all duration-300
                        ${i === actualPage ? "bg-reflector" : "bg-pergamino/30"}`}
                    />
                ))}
                </div>
            </div>

            
             {/* carrusel */}
            <div className="flex items-center gap-3">

                {/* flecha izquierda */}       
                <button
                    onClick={previousMovies}
                    className={`text-reflector ml-2 text-5xl sm:text-6xl w-4 flex-shrink-0 text-center transition-opacity duration-300 hover:text-reflector2
                    ${actualPage === 0 ? "opacity-0 pointer-events-none" : "opacity-100"}`}>‹
                </button>

                {/* cards */}
                <div className={`grid ${gridCols[perPage]} gap-3 flex-1`}>
                    {visibles.map((movie, i) => (
                    <MovieCard key={movie.id} movie={movie}
                    isFirst={i === 0} isLast={i === visibles.length - 1} />
                    ))}
                </div>

                {/* flecha derecha */}
                <button
                    onClick={nextMovies}
                    className={`text-reflector mr-2 text-5xl sm:text-6xl w-4 flex-shrink-0 text-center transition-opacity duration-300 hover:text-reflector2
                    ${actualPage === totalPages - 1 ? "opacity-0 pointer-events-none" : "opacity-100"}`}>›
                </button>

            </div>
        </div>
    )
}