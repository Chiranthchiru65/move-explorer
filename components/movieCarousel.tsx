"use client";
import * as React from "react";
import Image from "next/image";
import type { Movie } from "@/lib/tmdb";

interface MovieCarouselProps {
  movies: Movie[];
  title?: string;
}

// Genre mapping for movie badges
const genreMap: { [key: number]: { name: string; color: string } } = {
  28: { name: "Action", color: "bg-red-500" },
  12: { name: "Adventure", color: "bg-green-500" },
  16: { name: "Animation", color: "bg-purple-500" },
  35: { name: "Comedy", color: "bg-yellow-500" },
  80: { name: "Crime", color: "bg-gray-700" },
  99: { name: "Documentary", color: "bg-blue-500" },
  18: { name: "Drama", color: "bg-indigo-500" },
  10751: { name: "Family", color: "bg-pink-500" },
  14: { name: "Fantasy", color: "bg-violet-500" },
  36: { name: "History", color: "bg-amber-600" },
  27: { name: "Horror", color: "bg-black" },
  10402: { name: "Music", color: "bg-emerald-500" },
  9648: { name: "Mystery", color: "bg-slate-600" },
  10749: { name: "Romance", color: "bg-rose-500" },
  878: { name: "Sci-Fi", color: "bg-cyan-500" },
  10770: { name: "TV Movie", color: "bg-orange-500" },
  53: { name: "Thriller", color: "bg-red-700" },
  10752: { name: "War", color: "bg-stone-600" },
  37: { name: "Western", color: "bg-yellow-700" },
};

function MovieCarousel({
  movies,
  title = "Featured Movies",
}: MovieCarouselProps) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const isScrollingRef = React.useRef(false);

  const scrollToSlide = (index: number) => {
    const container = containerRef.current;
    if (!container) return;

    isScrollingRef.current = true;
    const child = container.children[index] as HTMLElement;
    container.scrollTo({
      left:
        child.offsetLeft - container.offsetWidth / 2 + child.offsetWidth / 2,
      behavior: "smooth",
    });
    setActiveIndex(index);

    setTimeout(() => {
      isScrollingRef.current = false;
    }, 10);
  };

  const updateActiveIndex = React.useCallback(() => {
    if (!containerRef.current || isScrollingRef.current) return;

    const container = containerRef.current;
    const scrollLeft = container.scrollLeft;
    const containerWidth = container.offsetWidth;

    let closestIndex = 0;
    let closestDistance = Infinity;

    Array.from(container.children).forEach((child, index) => {
      const childElement = child as HTMLElement;
      const childCenter =
        childElement.offsetLeft + childElement.offsetWidth / 2;
      const containerCenter = scrollLeft + containerWidth / 2;
      const distance = Math.abs(childCenter - containerCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    if (closestIndex !== activeIndex) {
      setActiveIndex(closestIndex);
    }
  }, [activeIndex]);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let timeoutId: NodeJS.Timeout;

    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateActiveIndex, 5);
    };

    container.addEventListener("scroll", handleScroll);

    return () => {
      container.removeEventListener("scroll", handleScroll);
      clearTimeout(timeoutId);
    };
  }, [updateActiveIndex]);

  const formatReleaseYear = (dateString: string): string => {
    return new Date(dateString).getFullYear().toString();
  };

  const getMainGenre = (genreIds: number[]) => {
    if (!genreIds.length) return null;
    const mainGenreId = genreIds[0];
    return genreMap[mainGenreId] || { name: "Movie", color: "bg-gray-500" };
  };

  // Take only first 5 movies for carousel
  const featuredMovies = movies.slice(0, 10);

  return (
    <div className="w-full">
      {/* Section Title */}
      {/* <div className="mb-6">
        <h2 className="text-3xl font-bold text-white">{title}</h2>
      </div> */}

      {/* Carousel content */}
      <div
        ref={containerRef}
        className="scrollbar-none flex h-[450px] w-full snap-x snap-mandatory overflow-x-auto scroll-smooth px-[3rem]"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {featuredMovies.map((movie, i) => (
          <div
            key={movie.id}
            className="min-w-[350px] max-w-[90%] shrink-0 snap-center rounded-xl bg-neutral-900 text-white transition-all duration-300  "
            style={{
              transform: i === activeIndex ? "scale(1)" : "scale(0.92)",
              opacity: i === activeIndex ? 1 : 0.6,
            }}
          >
            <div className="flex h-full w-full flex-col overflow-hidden rounded-xl md:flex-row">
              {/* LEFT: Movie Backdrop */}
              <div className="relative w-full md:w-1/2">
                <div className="relative h-full w-full">
                  <Image
                    // src={`https://image.tmdb.org/p/w780${movie.backdrop_path}`}
                    src={`https://image.tmdb.org/t/p/w780${movie.poster_path}`}
                    alt={movie.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>

                {/* Fade Overlay - desktop only */}
                <div className="pointer-events-none absolute right-0 top-0 hidden h-full w-1/3 bg-gradient-to-l from-black to-transparent md:block" />

                {/* Genre Badge */}
                <div className="absolute left-3 top-3 z-10 flex flex-wrap gap-2">
                  {getMainGenre(movie.genre_ids) && (
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getMainGenre(movie.genre_ids)?.color}`}
                    >
                      {getMainGenre(movie.genre_ids)?.name}
                    </span>
                  )}
                </div>

                {/* Rating Badge */}
                <div className="absolute right-3 top-3 z-10">
                  <div className="flex items-center bg-black/70 rounded-full px-2 py-1">
                    <span className="text-yellow-400 mr-1">⭐</span>
                    <span className="text-sm font-semibold">
                      {movie.vote_average.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* RIGHT: Movie Info */}
              <div className="flex h-full w-full flex-col justify-center bg-gradient-to-r from-black via-gray-900 to-gray-800 px-6 py-6 md:w-1/2">
                <div className="w-full">
                  <h3 className="mb-4 text-2xl font-bold leading-tight md:text-3xl lg:text-4xl">
                    {movie.title}
                  </h3>

                  <p className="mb-4 text-sm text-gray-300 line-clamp-3 md:text-base">
                    {movie.overview}
                  </p>

                  {/* Movie Details */}
                  <div className="flex flex-col gap-3">
                    {/* Release Year */}
                    <div className="flex items-center text-sm text-gray-400">
                      <span className="mr-2">📅</span>
                      <span>
                        Released in {formatReleaseYear(movie.release_date)}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-4">
                      <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                        View Details
                      </button>
                      <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                        Add to List
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Carousel Indicators */}
      <div className="mt-6 flex justify-center gap-2">
        {featuredMovies.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToSlide(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === activeIndex
                ? "w-8 bg-orange-500"
                : "w-2 bg-gray-500 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default MovieCarousel;
