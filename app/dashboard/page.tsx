import LazyMovieSection from "@/components/lazyMovieSection";
import MovieCarousel from "@/components/movieCarousel";
import { getTrending, getPopular } from "@/lib/tmdb";

export default async function HomePage() {
  // Server-side fetch for carousel
  const trending = await getTrending();
  const popular = await getPopular();

  console.log("Trending:", trending.results);
  console.log("Popular:", popular);

  return (
    <div className="space-y-12 pb-12">
      {/*  carousel loads immediately */}
      <section className="mb-12">
        <MovieCarousel movies={trending.results} title="Trending This Week" />
      </section>

      {/* <LazyMovieSection title="Popular Movies" apiEndpoint="popular" /> */}
      {/* <LazyMovieSection title="Top Rated Movies" apiEndpoint="top-rated" /> */}
    </div>
  );
}
