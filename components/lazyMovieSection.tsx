"use client";
import { useEffect, useState } from "react";
import { useInView } from "@/hooks/useInView";
// import Image from "next/image";
import MovieCard from "./movieCard";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
}

interface LazyMovieSectionProps {
  title: string;
  apiEndpoint: "popular" | "top-rated" | "trending";
}

function LazyMovieSection({ title, apiEndpoint }: LazyMovieSectionProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // when inView sets to true - fires the useref and hits the api
  const { ref, inView } = useInView({
    threshold: 0.1,
    rootMargin: "200px",
    triggerOnce: true,
  });

  // effect to load data when section becomes visible
  useEffect(() => {
    if (inView && movies.length === 0 && !loading) {
      loadMovies();
    }
  }, [inView]);

  const loadMovies = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log(`🔄 Loading ${title}...`);

      //  make API call based on endpoint string
      const response = await fetch(`/api/movies/${apiEndpoint}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch ${title}`);
      }

      const data = await response.json();
      setMovies(data.results.slice(0, 6));

      console.log(` Loaded ${title}!`);
    } catch (err) {
      console.error(` Error loading ${title}:`, err);
      setError(`Failed to load ${title}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section ref={ref} className="min-h-[400px] mb-12 px-12">
      <h2 className="text-2xl font-bold mb-6 ">{title}</h2>

      {loading && (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading {title.toLowerCase()}...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center justify-center h-64">
          <div className="text-center text-red-400">
            <p>{error}</p>
            <button
              onClick={loadMovies}
              className="mt-4 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
            >
              Try Again
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
