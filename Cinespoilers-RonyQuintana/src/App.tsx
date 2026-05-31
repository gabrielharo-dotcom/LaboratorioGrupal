import { useEffect, useState } from "react";
import axiosInstance from "@/api/axiosConfig";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// ── Types ─────────────────────────────────────────────────────────────────────

type Movie = {
  id: number;
  title: string;
  poster: string;
  rating: number;
  releaseDate: string;
  description: string;
};

interface TMDBMovie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
  overview: string;
  backdrop_path: string;
  original_language: string;
  original_title: string;
  popularity: number;
  vote_count: number;
  adult: boolean;
  video: boolean;
  genre_ids: number[];
}

interface TMDBResponse {
  page: number;
  results: TMDBMovie[];
  total_pages: number;
  total_results: number;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const POSTER_BASE = "https://image.tmdb.org/t/p/w500";

function formatDate(raw: string): string {
  if (!raw) return "—";
  return new Date(raw + "T12:00:00").toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function mapMovie(m: TMDBMovie): Movie {
  return {
    id: m.id,
    title: m.title,
    poster: `${POSTER_BASE}${m.poster_path}`,
    rating: Math.round(m.vote_average * 10) / 10,
    releaseDate: formatDate(m.release_date),
    description: m.overview,
  };
}

function ratingBadgeClass(r: number) {
  if (r >= 7.5) return "bg-emerald-500";
  if (r >= 6)   return "bg-amber-500";
  return "bg-rose-500";
}

// ── Skeleton card ─────────────────────────────────────────────────────────────

function MovieCardSkeleton() {
  return (
    <Card className="bg-[#111827] border-[#1e293b] rounded-xl overflow-hidden p-0">
      <Skeleton className="h-70 w-full rounded-none bg-[#1e293b]" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-2/3 bg-[#1e293b]" />
        <Skeleton className="h-3 w-1/3 bg-[#1e293b]" />
        <Skeleton className="h-3 w-full bg-[#1e293b]" />
        <Skeleton className="h-3 w-4/5 bg-[#1e293b]" />
        <Skeleton className="h-9 w-full rounded-lg bg-[#1e293b]" />
      </div>
    </Card>
  );
}

// ── Movie card ────────────────────────────────────────────────────────────────

function MovieCard({ movie }: { movie: Movie }) {
  return (
    <Card
      className="group bg-[#111827] border-[#1e293b] rounded-xl overflow-hidden p-0
                 transition-all duration-300 cursor-pointer
                 hover:scale-[1.05] hover:shadow-2xl hover:shadow-blue-950/60
                 hover:border-blue-500/40"
    >
      {/* Poster */}
      <div className="relative overflow-hidden">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-70 object-cover transition-transform duration-500
                     group-hover:scale-[1.07]"
        />
        {/* rating badge — top-left over the image */}
        <Badge
          className={`absolute top-3 left-3 ${ratingBadgeClass(movie.rating)}
                      text-white border-0 font-bold text-sm px-2.5 py-1 shadow-lg`}
        >
          ★ {movie.rating.toFixed(1)}
        </Badge>
      </div>

      {/* Info */}
      <CardContent className="px-4 pt-4 pb-2 space-y-1.5">
        <h3 className="text-white font-semibold text-[15px] leading-snug line-clamp-1
                       group-hover:text-blue-400 transition-colors duration-200">
          {movie.title}
        </h3>
        <p className="text-blue-400/80 text-xs font-medium">{movie.releaseDate}</p>
        <p className="text-gray-400 text-xs leading-relaxed line-clamp-3 mt-1">
          {movie.description || "No description available."}
        </p>
      </CardContent>

      {/* CTA */}
      <CardFooter className="px-4 pb-4 pt-2">
        <Button
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold
                     text-sm cursor-pointer transition-colors duration-200"
        >
          Buy ticket
        </Button>
      </CardFooter>
    </Card>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────

function App() {
  const [movies, setMovies]       = useState<Movie[]>([]);
  const [loading, setLoading]     = useState(true);
  const [page, setPage]           = useState(1);
  const [totalPages, setTotal]    = useState(1);

  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get<TMDBResponse>("/movie/popular", {
        params: { language: "en-US", page },
      })
      .then(({ data }) => {
        console.log("=== TMDB Movie Popular ===");
        console.log("Pagina:", data.page);
        console.log("Total resultados:", data.total_results);
        console.log("Total paginas:", data.total_pages);
        console.log("Movies:", data.results);
        setMovies(data.results.map(mapMovie));
        setTotal(data.total_pages);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [page]);

  function goTo(p: number) {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Build 5-page window centered on current page
  const pageNums: number[] = [];
  const start = Math.max(1, Math.min(page - 2, totalPages - 4));
  for (let p = start; p <= Math.min(start + 4, totalPages); p++) pageNums.push(p);

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white">

      {/* ── Header ── */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-10">
        <p className="text-blue-400 text-xs font-bold tracking-[0.25em] uppercase mb-3">
          CineSpoilers
        </p>
        <h1 className="text-5xl font-black text-white leading-tight mb-3">
          Popular movies
        </h1>
        <p className="text-gray-400 text-lg">
          Discover the most popular movies playing right now.
        </p>
      </div>

      {/* ── Grid ── */}
      <main className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {loading
            ? Array.from({ length: 20 }).map((_, i) => <MovieCardSkeleton key={i} />)
            : movies.map((m) => <MovieCard key={m.id} movie={m} />)}
        </div>

        {/* ── Pagination ── */}
        {!loading && (
          <div className="flex items-center justify-center gap-2 mt-14">
            <Button
              variant="outline"
              onClick={() => goTo(page - 1)}
              disabled={page === 1}
              className="border-[#1e293b] text-gray-400 hover:bg-[#1e293b] hover:text-white
                         disabled:opacity-30 cursor-pointer"
            >
              ← Previous
            </Button>

            {pageNums.map((p) => (
              <button
                key={p}
                onClick={() => goTo(p)}
                className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all cursor-pointer
                  ${p === page
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50"
                    : "text-gray-400 hover:bg-[#1e293b] hover:text-white"
                  }`}
              >
                {p}
              </button>
            ))}

            <Button
              variant="outline"
              onClick={() => goTo(page + 1)}
              disabled={page === totalPages}
              className="border-[#1e293b] text-gray-400 hover:bg-[#1e293b] hover:text-white
                         disabled:opacity-30 cursor-pointer"
            >
              Next →
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
