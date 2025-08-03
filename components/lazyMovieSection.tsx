"use client";
import { useEffect, useState } from "react";
import { useInView } from "@/hooks/useInView";
import MovieCard from "./movieCard";
import toast from "react-hot-toast";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
}

interface LazyMovieSectionProps {
  title: string;
  apiEndpoint: "popular" | "top-rated" | "upcoming";
}

interface ApiError {
  error: string;
  type:
    | "auth"
    | "rate_limit"
    | "not_found"
    | "server"
    | "network"
    | "validation";
  code: string;
}

// Client-side cache
const movieCache = new Map<
  string,
  { data: Movie[]; timestamp: number; ttl: number }
>();

const CACHE_TTL = {
  popular: 2 * 60 * 60 * 1000, // 2 hours
  "top-rated": 24 * 60 * 60 * 1000, // 24 hours
  upcoming: 6 * 60 * 60 * 1000, // 6 hours
};

function LazyMovieSection({ title, apiEndpoint }: LazyMovieSectionProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const { ref, inView } = useInView({
    threshold: 0.1,
    rootMargin: "200px",
    triggerOnce: true,
  });

  // Check cache first
  const getCachedData = (key: string): Movie[] | null => {
    const cached = movieCache.get(key);
    if (!cached) return null;

    const now = Date.now();
    const isExpired = now - cached.timestamp > cached.ttl;

    if (isExpired) {
      movieCache.delete(key);
      return null;
    }

    return cached.data;
  };

  // Set cache
  const setCachedData = (key: string, data: Movie[]) => {
    movieCache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: CACHE_TTL[apiEndpoint] || CACHE_TTL["popular"],
    });
  };

  useEffect(() => {
    if (inView && movies.length === 0 && !loading) {
      loadMovies();
    }
  }, [inView]);

  const loadMovies = async () => {
    const cacheKey = `${apiEndpoint}-page-1`;

    // Check cache first - INSTANT LOAD!
    const cachedMovies = getCachedData(cacheKey);
    if (cachedMovies) {
      setMovies(cachedMovies);
      setError(null);
      console.log(`✅ Loaded ${title} from cache (instant!)`);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log(`🔄 Loading ${title} from API...`);

      const response = await fetch(`/api/movies/${apiEndpoint}?page=1`);

      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(errorData.error);
      }

      const data = await response.json();
      const movieList = data.results.slice(0, 6);

      setMovies(movieList);
      setCachedData(cacheKey, movieList); // Cache for next time
      setRetryCount(0); // Reset retry count on success

      console.log(` Loaded ${title} from API and cached!`);
    } catch (err: any) {
      console.error(` Error loading ${title}:`, err);
      setError(err.message);

      // Show different toasts based on error type
      if (
        err.message.includes("rate limit") ||
        err.message.includes("Too many requests")
      ) {
        toast.error(
          `Rate limit reached. Please wait a moment before trying again.`
        );
      } else if (err.message.includes("Invalid API key")) {
        toast.error(`Configuration error. Please contact support.`);
      } else if (err.message.includes("Server temporarily unavailable")) {
        toast.error(
          `Service temporarily unavailable. Trying again automatically...`
        );

        if (retryCount < 2) {
          setTimeout(() => {
            setRetryCount((prev) => prev + 1);
            loadMovies();
          }, 3000);
        }
      } else {
        toast.error(`Failed to load ${title}. Please check your connection.`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setRetryCount(0);
    loadMovies();
  };

  return (
    <section ref={ref} className="min-h-[400px] mb-12 px-12">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>

      {loading && (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading {title.toLowerCase()}...</p>
            {retryCount > 0 && (
              <p className="text-sm text-gray-500 mt-2">
                Retry attempt {retryCount}/2
              </p>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center justify-center h-64">
          <div className="text-center text-red-400">
            <div className="mb-4">
              <svg
                className="mx-auto h-12 w-12 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 15.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <p className="mb-4">{error}</p>
            <button
              onClick={handleRetry}
              disabled={loading}
              className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Loading..." : "Try Again"}
            </button>
          </div>
        </div>
      )}

      {movies.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}

      {!loading && !error && movies.length === 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="bg-gray-800 rounded-lg h-60 animate-pulse"
              />
            ))}
        </div>
      )}
    </section>
  );
}

export default LazyMovieSection;
