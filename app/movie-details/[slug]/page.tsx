// app/movie-details/[slug]/page.tsx

import { tmdbApi } from "@/lib/tmdb"; // adjust path if different
import { notFound } from "next/navigation";

interface MoviePageProps {
  params: { slug: string }; // slug is movieId
}

export default async function MoviePage({ params }: MoviePageProps) {
  const movieId = params.slug;

  try {
    const movie = await tmdbApi.getMovieDetails(movieId);

    return (
      <div className="text-white p-6">
        <h1 className="text-2xl font-bold mb-2">Movie ID: {movie.id}</h1>
        <h2 className="text-xl">Title: {movie.title}</h2>
      </div>
    );
  } catch (error) {
    console.error("Error loading movie:", error);
    notFound(); // show 404 page if fetch fails
  }
}
