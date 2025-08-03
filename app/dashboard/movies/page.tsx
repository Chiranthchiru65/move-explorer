// app/dashboard/movies/page.tsx
import MovieCard from "@/components/movieCard";
import { title } from "@/components/primitives";
import { searchMovies } from "@/lib/tmdb";

export default async function MoviePage({
  searchParams,
}: {
  searchParams: { search?: string };
}) {
  const searchQuery = searchParams.search?.trim() || "";

  let movies: any[] = [];
  if (searchQuery) {
    try {
      const response = await searchMovies(searchQuery);
      movies = response.results;
      console.log(response.results);
    } catch (error) {
      console.error("Search failed:", error);
      // Could show error state here
    }
  }

  return (
    <div>
      <h1 className={title()}>
        {searchQuery ? "Search Results" : "All Movies"}
        {searchQuery && (
          <div>
            <span>searched for: "{searchQuery}"</span>
          </div>
        )}
      </h1>

      {searchQuery ? (
        movies.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No movies found for "{searchQuery}"</p>
          </div>
        )
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">
            Use the search bar above to find movies
          </p>
        </div>
      )}
    </div>
  );
}
