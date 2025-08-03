import LazyMovieSection from "@/components/lazyMovieSection";
import MovieCarousel from "@/components/movieCarousel";
import { getTrending } from "@/lib/tmdb";

export default async function HomePage() {
  try {
    // Server-side fetch for carousel only
    console.log("🔄 SSR: Fetching trending movies for carousel...");
    const trending = await getTrending();
    console.log("✅ SSR: Trending movies loaded successfully");

    return (
      <div className="space-y-12 pb-12">
        {/* Hero carousel loads immediately */}
        <section className="mb-12 mt-6">
          <MovieCarousel movies={trending.results} title="Trending This Week" />
        </section>

        {/* Lazy-loaded sections with client-side caching */}
        <LazyMovieSection title="Popular Movies" apiEndpoint="popular" />
        <LazyMovieSection title="Top Rated Movies" apiEndpoint="top-rated" />
        <LazyMovieSection title="Upcoming Movies" apiEndpoint="upcoming" />
      </div>
    );
  } catch (error) {
    console.error("❌ SSR: Failed to load trending movies:", error);

    // Fallback UI for server-side errors
    return (
      <div className="space-y-12 pb-12">
        <section className="mb-12 flex items-center justify-center h-64">
          <div className="text-center text-red-400">
            <h2 className="text-2xl font-bold mb-4">Unable to load content</h2>
            <p>Please refresh the page or try again later.</p>
          </div>
        </section>
      </div>
    );
  }
}
