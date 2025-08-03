"use client";
import { memo, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import fallBackImg from "../assets/fallback.png";

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
}

const MovieCard = memo(function MovieCard({ movie }: { movie: Movie }) {
  const [imageError, setImageError] = useState(false);

  const memoizedData = useMemo(
    () => ({
      releaseYear: movie.release_date?.split("-")[0] || "N/A",
      formattedRating: movie.vote_average.toFixed(1),
      imageUrl: movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : null,
      detailsUrl: `/dashboard/movie-details/${movie.id}`,
    }),
    [movie.release_date, movie.vote_average, movie.poster_path, movie.id]
  );

  const imageSrc =
    imageError || !memoizedData.imageUrl ? fallBackImg : memoizedData.imageUrl;

  return (
    <Link
      href={memoizedData.detailsUrl}
      className="bg-gray-100 shadow-md dark:bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition-transform"
    >
      <div className="relative w-full h-[300px] md:h-[350px]">
        <Image
          width={300}
          height={450}
          src={imageSrc}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
          onError={() => setImageError(true)}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
        />

        {(imageError || !memoizedData.imageUrl) && (
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <svg
                className="w-12 h-12 mx-auto mb-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-xs">No Image</p>
            </div>
          </div>
        )}
      </div>

      <div className="p-3">
        <h3 className="font-semibold text-sm truncate">{movie.title}</h3>
        <p className="text-xs text-gray-400">{memoizedData.releaseYear}</p>
        <div className="flex items-center mt-1">
          <span className="text-yellow-400">⭐</span>
          <span className="text-xs ml-1">{memoizedData.formattedRating}</span>
        </div>
      </div>
    </Link>
  );
});

export default MovieCard;
