import { useEffect, useRef, useState } from 'react'
import { getNowPlaying } from '@/services/tmdb'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

interface Movie {
  id: number
  title: string
  poster_path: string
  release_date: string
  vote_average: number
  overview: string
}

function MovieCardSkeleton() {
  return (
    <div className="rounded-[2rem] bg-white/[0.03] border border-white/[0.06] p-1.5">
      <div className="rounded-[calc(2rem-6px)] overflow-hidden bg-white/[0.02]">
        <Skeleton className="w-full aspect-[2/3] rounded-none bg-white/[0.06]" />
        <div className="p-4 flex flex-col gap-3">
          <Skeleton className="h-4 w-3/4 bg-white/[0.06]" />
          <Skeleton className="h-3 w-1/3 bg-white/[0.06]" />
          <Skeleton className="h-8 w-full mt-2 bg-white/[0.06]" />
        </div>
      </div>
    </div>
  )
}

function MovieCard({ movie, index }: { movie: Movie; index: number }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.animationDelay = `${index * 60}ms`
          el.classList.add('fade-up')
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [index])

  return (
    <div ref={ref} className="group w-full">
      {/* Outer shell — Double-Bezel */}
      <div className="rounded-[2rem] bg-white/[0.03] border border-white/[0.06] p-1.5 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:border-white/[0.12] group-hover:bg-white/[0.05]">
        {/* Inner core */}
        <div className="rounded-[calc(2rem-6px)] overflow-hidden bg-[#111114] shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)]">

          {/* Poster */}
          <div className="relative overflow-hidden aspect-[2/3]">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105"
            />
            {/* Rating pill over image */}
            <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-md rounded-full px-2.5 py-1 border border-white/10">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="#facc15" stroke="none">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <span className="text-white text-[11px] font-semibold tracking-wide">
                {movie.vote_average.toFixed(1)}
              </span>
            </div>
          </div>

          {/* Info */}
          <div className="p-4 flex flex-col items-center gap-3 text-center">
            <h3 className="text-white font-semibold text-sm leading-snug line-clamp-2 tracking-[-0.01em]">
              {movie.title}
            </h3>

            <p className="text-white/30 text-[11px] font-medium flex items-center justify-center gap-1.5 tracking-wide">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              {movie.release_date}
            </p>

            {/* CTA — Button-in-Button pattern */}
            <Button
              className="w-full rounded-full bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] text-white/80 hover:text-white text-xs font-medium tracking-wide transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.97] justify-center gap-2 group/btn"
            >
              <span>Buy Ticket</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function App() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getNowPlaying()
      .then(res => setMovies(res.data.results))
      .catch(err => console.error('❌ Error TMDB:', err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-[100dvh] bg-[#050505] px-6 py-16">

      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-purple-900/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-red-900/15 blur-[100px]" />
      </div>

      <div className="relative max-w-5xl mx-auto" style={{ zIndex: 1 }}>
        {/* Header */}
        <div className="mb-14 fade-up flex flex-col items-center text-center" style={{ animationDelay: '0ms' }}>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-white/50 text-[10px] uppercase tracking-[0.2em] font-medium">Now Showing</span>
          </div>
          <h1 className="text-white text-5xl md:text-6xl font-bold tracking-[-0.03em] leading-none mb-4">
            Popular movies
          </h1>
          <p className="text-white/30 text-sm max-w-md leading-relaxed">
            Discover this week's audience favorites and book your next movie night.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5 items-start justify-items-center">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <MovieCardSkeleton key={i} />)
            : movies.map((movie, i) => <MovieCard key={movie.id} movie={movie} index={i} />)
          }
        </div>
      </div>
    </div>
  )
}

export default App
