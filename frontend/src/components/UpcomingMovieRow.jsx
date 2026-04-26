import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import UpcomingMovieCard from "./UpcomingMovieCard"
import useColumns from "../hooks/useColumns"

export default function UpcomingMovieRow({ movies }) {
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
        if (index + perPage < movies.length) setIndex(index + perPage)
    }

    const previousMovies = () => {
        if (index > 0) setIndex(index - perPage)
    }

    const totalPages = Math.ceil(movies.length / perPage)
    const actualPage = Math.floor(index / perPage)

    return (
        <div className="bg-gradient-to-t from-cortina/30 via-cortina/20 to-transparent pt-10 pb-4 mb-8">
            <div className="max-w-6xl mx-auto mb-12 group/row relative">

                <div className="flex justify-between gap-1 sm:gap-3 mb-4 pl-6 mr-8">
                    <div>
                        <h2
                            onClick={() => navigate("/discover?type=upcoming")}
                            className="font-sans text-crema text-3xl cursor-pointer hover:text-reflector transition-colors">
                            Próximos estrenos
                        </h2>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <p className="text-pergamino/80 text-sm font-sans tracking-widest uppercase">
                                predicción por ia
                            </p>
                            <Link to="/about#prediccion-ia"
                                className="text-pergamino/50 hover:text-reflector transition-colors leading-none"
                                title="¿Cómo funciona la predicción?">
                                ⓘ
                            </Link>
                        </div>
                    </div>
                    <div className="hidden sm:flex items-center gap-1">
                        {Array.from({ length: totalPages }).map((_, i) => (
                            <div
                                key={i}
                                className={`h-[2px] w-4 sm:w-8 transition-all duration-300
                                    ${i === actualPage ? "bg-reflector" : "bg-pergamino/30"}`}
                            />
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={previousMovies}
                        className={`text-reflector ml-2 text-5xl sm:text-6xl w-4 flex-shrink-0 text-center transition-opacity duration-300 hover:text-reflector2
                        ${actualPage === 0 ? "opacity-0 pointer-events-none" : "opacity-100"}`}>‹
                    </button>

                    <div className={`grid ${gridCols[perPage]} gap-3 flex-1`}>
                        {visibles.map((movie, i) => (
                            <UpcomingMovieCard key={movie.id} movie={movie}
                                isFirst={i === 0} isLast={i === visibles.length - 1} />
                        ))}
                    </div>

                    <button
                        onClick={nextMovies}
                        className={`text-reflector mr-2 text-5xl sm:text-6xl w-4 flex-shrink-0 text-center transition-opacity duration-300 hover:text-reflector2
                        ${actualPage === totalPages - 1 ? "opacity-0 pointer-events-none" : "opacity-100"}`}>›
                    </button>
                </div>

            </div>
        </div>
    )
}
