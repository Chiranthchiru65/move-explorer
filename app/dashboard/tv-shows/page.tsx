"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { FixedSizeGrid as Grid } from "react-window";
import { getPopularTVShows } from "@/lib/tmdb";
import TVCard from "@/components/tvCard";

interface TVShow {
  id: number;
  name: string;
  poster_path: string | null;
  first_air_date: string;
  vote_average: number;
  overview: string;
}

function TVShowsPage() {
  const [allTVShows, setAllTVShows] = useState<TVShow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Responsive constants
  const MIN_CARD_WIDTH = 220; // Increased slightly for better spacing
  const CARD_HEIGHT = 480; 
  const [gridHeight, setGridHeight] = useState(600);

  // Calculate dynamic column count based on container width
  const columnCount = Math.max(1, Math.floor(containerWidth / MIN_CARD_WIDTH));
  const columnWidth = containerWidth / columnCount;
  const rowCount = Math.ceil(allTVShows.length / columnCount);

  // Resize observer to handle responsiveness
  useEffect(() => {
    if (!containerRef.current) return;

    const updateDimensions = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
        // Calculate remaining height for the grid
        const topOffset = containerRef.current.getBoundingClientRect().top;
        const remainingHeight = window.innerHeight - topOffset - 40; // 40px bottom padding
        setGridHeight(Math.max(400, remainingHeight));
      }
    };

    const observer = new ResizeObserver(updateDimensions);
    observer.observe(containerRef.current);
    
    updateDimensions();

    return () => observer.disconnect();
  }, []);

  const Cell = useCallback(
    ({ columnIndex, rowIndex, style }: any) => {
      const showIndex = rowIndex * columnCount + columnIndex;
      const tvShow = allTVShows[showIndex];

      if (!tvShow) return null;

      return (
        <div style={style} className="p-2">
          <TVCard tvShow={tvShow} />
        </div>
      );
    },
    [allTVShows, columnCount]
  );

  useEffect(() => {
    const fetchAllTVShows = async () => {
      try {
        setLoading(true);
        const pagesToFetch = 10; // Reduced for performance, can be increased
        const promises = [];

        for (let page = 1; page <= pagesToFetch; page++) {
          promises.push(getPopularTVShows(page));
        }

        const results = await Promise.all(promises);
        const uniqueShows: TVShow[] = [];
        const seenIds = new Set();

        results.forEach((result) => {
          if (result?.results) {
            result.results.forEach((show: TVShow) => {
              if (!seenIds.has(show.id)) {
                seenIds.add(show.id);
                uniqueShows.push(show);
              }
            });
          }
        });

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
    <div className="px-6 md:px-12 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Popular TV Shows</h1>
        <p className="text-default-500">
          {loading
            ? "Loading TV shows..."
            : `Showing ${allTVShows.length} popular TV shows with virtualization`}
        </p>
      </div>

      {error && (
        <div className="text-center py-12 text-danger">
          <p>{error}</p>
        </div>
      )}

      <div ref={containerRef} className="w-full min-h-[500px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-default-500">Fetching latest shows...</p>
          </div>
        ) : (
          allTVShows.length > 0 && containerWidth > 0 && (
            <div className="rounded-xl overflow-hidden">
              <Grid
                columnCount={columnCount}
                columnWidth={columnWidth}
                height={gridHeight}
                rowCount={rowCount}
                rowHeight={CARD_HEIGHT}
                width={containerWidth}
                className="no-scrollbar"
                style={{ overflowX: 'hidden' }}
              >
                {Cell}
              </Grid>
            </div>
          )
        )}
      </div>

      {!loading && !error && allTVShows.length === 0 && (
        <div className="text-center text-default-500 py-12">
          <p>No TV shows found.</p>
        </div>
      )}
    </div>
  );
}

export default TVShowsPage;

