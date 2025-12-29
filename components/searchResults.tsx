"use client";

import MovieCard from "./movieCard";
import { useMovieSearch } from "@/hooks/movieSearch";

interface SearchResultsProps {
  query: string;
  initialResults?: any[];
}

export default function SearchResults({
  query,
  initialResults = [],
}: SearchResultsProps) {
  const { data, isLoading, error, refetch } = useMovieSearch({
    query,
    enabled: query.length > 0,
  });

  const movies = data?.results || initialResults;
  const hasResults = movies.length > 0;

  if (isLoading && !initialResults.length) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4" />
          <p className="text-gray-400">
            Searching for {'"'}
            {query} {'"'}...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
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
          <p>
            No results found for {'"'}
            {query}
            {'"'}
          </p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (hasResults) {
    return (
      <div>
        <div className="mb-4 text-sm text-gray-400">
          Found {data?.total_results || movies.length} results for {'"'} {query}{" "}
          {'"'}
          {isLoading && (
            <span className="ml-2 text-orange-400">• Updating...</span>
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {movies.map((movie: any) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-12">
      <div className="text-gray-500">
        <svg
          className="mx-auto h-16 w-16 text-gray-400 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <p className="text-lg mb-2">No movies found</p>
        <p>Try searching for something else</p>
      </div>
    </div>
  );
}
