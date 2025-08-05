"use client";
import React, { useState, useEffect, useCallback } from "react";
import { FixedSizeGrid as Grid } from "react-window";
import { getPopularTVShows } from "@/lib/tmdb"; // Adjust import path as needed
import TVCard from "@/components/tvCard";

interface TVShow {
  id: number;
  name: string;
  poster_path: string | null;
  first_air_date: string;
  vote_average: number;
  overview: string;
}

interface PageProps {}

function TVShowsPage(props: PageProps) {
  const [allTVShows, setAllTVShows] = useState<TVShow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const COLUMN_COUNT = 6; //  cards per row
  const CARD_WIDTH = 200; // width of each card
  const CARD_HEIGHT = 400; // height of each card (including padding)
  const GRID_HEIGHT = 600; // height of the virtualized container

  // Calculate how many rows we need
  const rowCount = Math.ceil(allTVShows.length / COLUMN_COUNT);

  // CELL RENDERER
  // renders individual cells in the grid
  const Cell = useCallback(
    ({ columnIndex, rowIndex, style }: any) => {
      const showIndex = rowIndex * COLUMN_COUNT + columnIndex;
      const tvShow = allTVShows[showIndex];

      // Render the TV card with react-window's positioning
      return (
        <div style={style} className="p-2">
          <TVCard tvShow={tvShow} />
        </div>
      );
    },
    [allTVShows]
  );

  useEffect(() => {
    const fetchAllTVShows = async () => {
      try {
        setLoading(true);
        const pagesToFetch = 15;
        const promises = [];

        for (let page = 1; page <= pagesToFetch; page++) {
          promises.push(getPopularTVShows(page));
        }

        console.log(`Fetching ${pagesToFetch} pages of TV shows...`);
        const results = await Promise.all(promises);

        const showMap = new Map<number, TVShow>();
        results.forEach((result) => {
          if (result?.results) {
            result.results.forEach((show) => {
              showMap.set(show.id, show);
            });
          }
        });

        const uniqueShows = Array.from(showMap.values());
        console.log(`Fetched ${uniqueShows.length} unique TV shows`);
        console.log(
          `This will create ${Math.ceil(uniqueShows.length / COLUMN_COUNT)} rows`
        );
        setAllTVShows(uniqueShows);
        setError(null);
      } catch (err) {
        console.error("Error fetching TV shows:", err);
        setError("Failed to load TV shows. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllTVShows();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 items-center">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Popular TV Shows
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {loading
            ? "Loading TV shows..."
            : `Showing ${allTVShows.length} popular TV shows`}
        </p>
      </div>

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading TV shows...
          </p>
        </div>
      )}

      {!loading && !error && allTVShows.length > 0 && (
        <div className=" rounded-lg overflow-hidden overflow-y-hidden">
          <Grid
            columnCount={COLUMN_COUNT}
            columnWidth={CARD_WIDTH}
            height={GRID_HEIGHT}
            rowCount={rowCount}
            rowHeight={CARD_HEIGHT}
            width={COLUMN_COUNT * CARD_WIDTH}
          >
            {Cell}
          </Grid>
        </div>
      )}

      {!loading && !error && allTVShows.length === 0 && (
        <div className="text-center text-gray-500 py-12">
          <p>No TV shows found.</p>
        </div>
      )}
    </div>
  );
}

export default TVShowsPage;
