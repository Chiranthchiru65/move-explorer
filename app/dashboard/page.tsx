import React from "react";
import { tmdbApi } from "@/lib/tmdb";
import Image from "next/image";

export default async function Dashboard() {
  // const [trending] = await Promise.all([
  //   tmdbApi.getTrending(),
  //   // tmdbApi.getPopular(),
  //   // tmdbApi.getTopRated(),
  // ]);
  // console.log(trending);

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-bold mb-4">Trending This Week</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {/* {trending.results.slice(0, 6).map((movie: any) => (
            <MovieCard key={movie.id} movie={movie} />
          ))} */}
        </div>
      </section>
      {/* 
      <section>
        <h2 className="text-2xl font-bold mb-4">Popular Movies</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {popular.results.slice(0, 6).map((movie: any) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section> */}

      {/* <section>
        <h2 className="text-2xl font-bold mb-4">Top Rated</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {topRated.results.slice(0, 6).map((movie: any) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section> */}
    </div>
  );
}

function MovieCard({ movie }: { movie: any }) {
  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/p/w400${movie.poster_path}`
    : "/placeholder-movie.jpg";

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition-transform">
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
    </div>
  );
}
