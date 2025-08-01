import Image from "next/image";
import Link from "next/link";

export default function MovieCard({ movie }: { movie: any }) {
  return (
    <Link
      href={`/dashboard/movie-details/${movie.id}`}
      className="bg-gray-100 shadow-md dark:bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition-transform"
    >
      <Image
        width={300}
        height={450}
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        className="w-full h-auto object-cover group-hover:scale-[1.03] transition-transform duration-300"
      />
      <div className="p-3">
        <h3 className="font-semibold text-sm truncate">{movie.title}</h3>
        <p className="text-xs text-gray-400">
          {movie.release_date?.split("-")[0]}
        </p>
        <div className="flex items-center mt-1">
          <span className="text-yellow-400">⭐</span>
          <span className="text-xs ml-1">{movie.vote_average.toFixed(1)}</span>
        </div>
      </div>
    </Link>
  );
}
