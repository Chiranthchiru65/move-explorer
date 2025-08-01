const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_API_KEY = process.env.TMDB_API_KEY;

const tmdbFetch = async (endpoint: string) => {
  const separator = endpoint.includes("?") ? "&" : "?";
  const urlWithApiKey = `${TMDB_BASE_URL}${endpoint}${separator}api_key=${TMDB_API_KEY}`;

  const response = await fetch(urlWithApiKey, {
    headers: {
      "Content-Type": "application/json",
    },
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.status}`);
  }

  return response.json();
};

export const tmdbApi = {
  getTrending: () => tmdbFetch("/trending/movie/week"),
  getPopular: () => tmdbFetch("/movie/popular"),
  getTopRated: () => tmdbFetch("/movie/top_rated"),
  searchMovies: (query: string) =>
    tmdbFetch(`/search/movie?query=${encodeURIComponent(query)}`),
  getMovieDetails: (movieId: number | string) => tmdbFetch(`/movie/${movieId}`),
  getMovieDetailsWithExtras: (movieId: number | string) =>
    tmdbFetch(
      `/movie/${movieId}?append_to_response=credits,videos,images,reviews`
    ),
};

export default function getPopularNew() {
  return tmdbApi.getPopular();
}
