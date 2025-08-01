// app/movie-details/[slug]/page.tsx
import { tmdbApi } from "@/lib/tmdb";
import { notFound } from "next/navigation";
import Image from "next/image";

interface MoviePageProps {
  params: { slug: string };
}

// Types based on your movie details response
interface Genre {
  id: number;
  name: string;
}

interface ProductionCompany {
  id: number;
  name: string;
  logo_path?: string;
  origin_country: string;
}

interface MovieDetails {
  id: number;
  title: string;
  overview: string;
  backdrop_path: string;
  poster_path: string;
  release_date: string;
  runtime: number;
  vote_average: number;
  vote_count: number;
  genres: Genre[];
  tagline: string;
  budget: number;
  revenue: number;
  status: string;
  production_companies: ProductionCompany[];
  homepage?: string;
  imdb_id?: string;
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { slug } = await params; // ✅ Await params for Next.js 15
  const movieId = slug;

  try {
    const movie: MovieDetails = await tmdbApi.getMovieDetails(movieId);

    // Helper functions
    const formatRuntime = (minutes: number) => {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours}h ${mins}m`;
    };

    const formatYear = (dateString: string) => {
      return new Date(dateString).getFullYear();
    };

    const formatBudget = (amount: number) => {
      if (amount >= 1000000000) {
        return `$${(amount / 1000000000).toFixed(1)}B`;
      } else if (amount >= 1000000) {
        return `$${(amount / 1000000).toFixed(0)}M`;
      }
      return `$${amount?.toLocaleString() || "N/A"}`;
    };

    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        {/* Hero Section with Backdrop */}
        <div className="relative h-[60vh] overflow-hidden">
          {/* Backdrop Image */}
          <div className="absolute inset-0">
            <Image
              src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
              alt={movie.title}
              fill
              className="object-cover"
              priority
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/60 to-transparent dark:from-gray-900 dark:via-gray-900/60 dark:to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-transparent to-white/40 dark:from-gray-900/80 dark:via-transparent dark:to-gray-900/40" />
          </div>

          {/* Content Container */}
          <div className="relative h-full flex items-end">
            <div className="container mx-auto px-6 pb-12 flex gap-8 items-end">
              {/* Movie Poster */}
              <div className="flex-shrink-0">
                <div className="w-64 h-96 rounded-lg overflow-hidden shadow-2xl">
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    width={256}
                    height={384}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Movie Info */}
              <div className="flex-1 pb-4">
                <h1 className="text-5xl font-bold mb-2 text-gray-900 dark:text-white">
                  {movie.title}
                </h1>

                {/* Movie Meta */}
                <div className="flex items-center gap-4 text-lg text-gray-600 dark:text-gray-300 mb-4">
                  <span>{formatYear(movie.release_date)}</span>
                  <span>•</span>
                  <span>PG-13</span>
                  <span>•</span>
                  <span>{formatRuntime(movie.runtime)}</span>
                </div>

                {/* Tagline */}
                {movie.tagline && (
                  <p className="text-xl text-gray-600 dark:text-gray-300 italic mb-4">
                    "{movie.tagline}"
                  </p>
                )}

                {/* Overview */}
                <p className="text-lg text-gray-700 dark:text-gray-200 leading-relaxed max-w-2xl mb-6">
                  {movie.overview}
                </p>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors text-lg">
                    Play
                  </button>
                  <button className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-8 py-3 rounded-lg font-semibold transition-colors text-lg">
                    Add to My List
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Genres */}
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Genres
                </h3>
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Production Companies */}
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Production
                </h3>
                <div className="flex flex-wrap gap-4">
                  {movie.production_companies.map((company) => (
                    <div
                      key={company.id}
                      className="text-gray-700 dark:text-gray-300"
                    >
                      {company.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Rating */}
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                  Rating
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400 text-2xl">⭐</span>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {movie.vote_average.toFixed(1)}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    ({movie.vote_count.toLocaleString()} votes)
                  </span>
                </div>
              </div>

              {/* Movie Facts */}
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                  Movie Facts
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Status
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      {movie.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Release Date
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      {new Date(movie.release_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Runtime
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      {formatRuntime(movie.runtime)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Budget
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      {formatBudget(movie.budget)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Revenue
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      {formatBudget(movie.revenue)}
                    </span>
                  </div>
                </div>
              </div>

              {/* External Links */}
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                  Links
                </h3>
                <div className="space-y-2">
                  {movie.homepage && (
                    <a
                      href={movie.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 transition-colors"
                    >
                      Official Website
                    </a>
                  )}
                  {movie.imdb_id && (
                    <a
                      href={`https://www.imdb.com/title/${movie.imdb_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 transition-colors"
                    >
                      IMDb Page
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* More Like This Section - Placeholder */}
        <div className="container mx-auto px-6 pb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            More Like This
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Placeholder for similar movies */}
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-200 dark:bg-gray-800 rounded-lg h-64 flex items-center justify-center"
                >
                  <span className="text-gray-500 dark:text-gray-400">
                    Similar Movie {i + 1}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading movie:", error);
    notFound();
  }
}
