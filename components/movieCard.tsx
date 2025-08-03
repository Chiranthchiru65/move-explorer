import { memo, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
}

const MovieCard = memo(function MovieCard({ movie }: { movie: Movie }) {
  // Memoize expensive calculations
  const memoizedData = useMemo(
    () => ({
      releaseYear: movie.release_date?.split("-")[0] || "N/A",
      formattedRating: movie.vote_average.toFixed(1),
      imageUrl: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      detailsUrl: `/dashboard/movie-details/${movie.id}`,
    }),
    [movie.release_date, movie.vote_average, movie.poster_path, movie.id]
  );

  return (
    <Link
      href={memoizedData.detailsUrl}
      className="bg-gray-100 shadow-md dark:bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition-transform"
    >
      <Image
        width={300}
        height={450}
        src={memoizedData.imageUrl}
        alt={movie.title}
        className="w-full h-auto object-cover group-hover:scale-[1.03] transition-transform duration-300"
      />
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
