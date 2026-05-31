import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { tmdb } from '@/services/tmdb'

interface Movie {
  id: number
  title: string
  poster_path: string | null
  vote_average: number
  release_date: string
}

function App() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    tmdb.movies.popular()
      .then(({ data }) => {
        console.log(data.results)
        setMovies(data.results)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <main className={cn('min-h-screen p-8')}>
      <h1 className="text-3xl font-bold tracking-tight text-violet-400 mb-8 text-center">
        CineSpoilers
      </h1>

      {loading ? (
        <p className="text-center text-gray-400">Cargando...</p>
      ) : (
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {movies.map((movie) => (
            <li key={movie.id} className="flex flex-col rounded-xl overflow-hidden border border-gray-200 shadow-sm">
              {movie.poster_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full object-cover"
                />
              )}
              <div className="flex flex-col gap-2 p-3 flex-1">
                <p className="text-sm font-semibold leading-tight">{movie.title}</p>
                <p className="text-xs text-gray-400">📅 {movie.release_date}</p>
                <p className="text-xs text-yellow-500 font-medium">⭐ {movie.vote_average.toFixed(1)}</p>
                <Button
                  className="mt-auto border-2 border-violet-400 text-violet-400 hover:bg-violet-400 hover:text-white"
                  variant="outline"
                  size="sm"
                >
                  Comprar ticket
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}

export default App
