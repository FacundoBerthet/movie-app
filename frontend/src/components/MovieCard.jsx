
export default function MovieCard({ movie }) {

  return (
    <div className="relative z-0 hover:z-10 cursor-pointer">
        <div className="aspect-[2/3] rounded-md overflow-hidden">
            <img 
                src={movie.poster_url} 
                alt={movie.title}
                className="w-full h-full object-cover" 
            />
        </div>
    </div>
  )
}