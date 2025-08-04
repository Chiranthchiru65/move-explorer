import { title } from "@/components/primitives";
import { searchMovies } from "@/lib/tmdb";
import SearchResults from "@/components/searchResults";
export default async function MoviePage({
  searchParams,
}: {
  searchParams: { search?: string };
}) {
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
    <div className="px-12 ">
      <h1 className="text-2xl">
        {searchQuery ? "Search Results" : "Browse Movies"}
      </h1>
      {searchQuery ? (
        <div className="mt-2 ">
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
        <div className="text-center ">
          <div className="text-gray-500">
            <svg
              className="mx-auto h-16 w-16 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <p className="text-lg mb-2">Discover Movies</p>
            <p>Use the search bar above to find your favorite movies</p>
          </div>
        </div>
      )}
    </div>
  );
}
