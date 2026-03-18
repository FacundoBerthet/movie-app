import { useParams } from 'react-router-dom'
import { movieDetailMock } from '../mocks/movieDetail'

export default function MovieDetailPage() {
    const { id } = useParams()

    // por ahora uso el mock
    const movie = movieDetailMock

    return (
        <div className="bg-sala min-h-screen text-crema">
            <h1>{movie.title}</h1>
            <p>ID de la URL: {id}</p>
        </div>
    )
}