"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { FixedSizeGrid as Grid } from "react-window";
import { getPopular } from "@/lib/tmdb";
import MovieCard from "@/components/movieCard";

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  overview: string;
}

export default function BrowseMovies() {
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [gridHeight, setGridHeight] = useState(600);
  const containerRef = useRef<HTMLDivElement>(null);

  // Responsive constants
  const MIN_CARD_WIDTH = 200;
  const CARD_HEIGHT = 380; // Slightly shorter than TV cards usually
  
  // Calculate dynamic column count based on container width
  const columnCount = Math.max(1, Math.floor(containerWidth / MIN_CARD_WIDTH));
  const columnWidth = containerWidth / columnCount;
  const rowCount = Math.ceil(allMovies.length / columnCount);

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
    
    // Initial calculation
    updateDimensions();

    return () => observer.disconnect();
  }, []);

  const Cell = useCallback(
    ({ columnIndex, rowIndex, style }: any) => {
      const movieIndex = rowIndex * columnCount + columnIndex;
      const movie = allMovies[movieIndex];

      if (!movie) return null;

      return (
        <div style={style} className="p-2">
          <MovieCard movie={movie} />
        </div>
      );
    },
    [allMovies, columnCount]
  );

  useEffect(() => {
    const fetchAllMovies = async () => {
      try {
        setLoading(true);
        const pagesToFetch = 10;
        const promises = [];

        for (let page = 1; page <= pagesToFetch; page++) {
          promises.push(getPopular(page));
        }

        const results = await Promise.all(promises);
        const uniqueMovies: Movie[] = [];
        const seenIds = new Set();

        results.forEach((result) => {
          if (result?.results) {
            result.results.forEach((movie: any) => {
              if (!seenIds.has(movie.id)) {
                seenIds.add(movie.id);
                uniqueMovies.push(movie);
              }
            });
          }
        });

        setAllMovies(uniqueMovies);
        setError(null);
      } catch (err) {
        console.error("Error fetching movies:", err);
        setError("Failed to load movies. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllMovies();
  }, []);

  if (error) {
    return (
      <div className="text-center py-12 text-red-400">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full min-h-[500px]">
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4"></div>
          <p className="text-gray-400">Loading movies...</p>
        </div>
      ) : (
        allMovies.length > 0 && containerWidth > 0 && (
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
  );
}
