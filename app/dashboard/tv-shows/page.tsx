import React from "react";
import { getPopularTVShows } from "@/lib/tmdb"; // Adjust import path as needed
import TVCard from "@/components/tvCard";

interface PageProps {}

// Server component with caching
async function TVShowsPage(props: PageProps) {
  // Fetch popular TV shows with built-in caching
  const tvShowsData = await getPopularTVShows(1);

  if (!tvShowsData || !tvShowsData.results) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Popular TV Shows</h1>
        <div className="text-center text-gray-500">
          Failed to load TV shows. Please try again later.
        </div>
      </div>
    );
  }

  const tvShows = tvShowsData.results;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Popular TV Shows
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Discover the most popular TV shows trending now
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {tvShows.map((tvShow) => (
          <TVCard key={tvShow.id} tvShow={tvShow} />
        ))}
      </div>

      {tvShowsData.total_pages > 1 && (
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing page 1 of {tvShowsData.total_pages} (
            {tvShowsData.total_results} total shows)
          </p>
        </div>
      )}
    </div>
  );
}

export default TVShowsPage;
