const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN!;

const tmdbFetch = async (endpoint: string) => {
  const response = await fetch(`${TMDB_BASE_URL}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
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
};
