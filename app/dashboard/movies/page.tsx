import { searchMovies } from "@/lib/tmdb";
import SearchResults from "@/components/searchResults";
import BrowseMovies from "@/components/BrowseMovies";

interface MoviePageProps {
  searchParams: Promise<{ search?: string }>;
}

export default async function MoviePage(props: MoviePageProps) {
  const searchParams = await props.searchParams;
  const searchQuery = searchParams.search?.trim() || "";

  let initialResults: any[] = [];
  let ssrError = false;

  if (searchQuery) {
    try {
      const response = await searchMovies(searchQuery);
      initialResults = response.results;
    } catch (error) {
      console.error(" SSR: Search failed:", error);
      ssrError = true;
    }
  }

  return (
    <div className="px-6 md:px-12 py-6 h-[calc(100vh-80px)] overflow-hidden">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">
          {searchQuery ? "Search Results" : "Popular Movies"}
        </h1>
        {!searchQuery && (
          <p className="text-default-500">
            Browse through our extensive collection of popular movies
          </p>
        )}
      </div>

      {searchQuery ? (
        <div className="mt-2 h-full overflow-y-auto pb-20 no-scrollbar">
          {ssrError ? (
            <SearchResults query={searchQuery} />
          ) : (
            <SearchResults
              query={searchQuery}
              initialResults={initialResults}
            />
          )}
        </div>
      ) : (
        <BrowseMovies />
      )}
    </div>
  );
}
