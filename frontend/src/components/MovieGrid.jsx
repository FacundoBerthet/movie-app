import MovieCard from './MovieCard'

export default function MovieGrid({ movies }){
    
    return (
        <div 
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {movies.map(movie => (
                <MovieCard key={movie.id} movie={movie} />
            ))}   
        </div>
    )
}