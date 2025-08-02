import axios from "axios";

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  original_title: string;
  popularity: number;
  video: boolean;
}

export interface TMDBResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

const tmdbApi = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: API_KEY,
  },
  timeout: 10000, // 10 second timeout
});

const handleApiError = (error: any, functionName: string) => {
  if (axios.isAxiosError(error)) {
    console.error(`${functionName} failed:`, {
      status: error.response?.status,
      message: error.response?.data?.status_message || error.message,
      url: error.config?.url,
    });

    if (error.response?.status === 401) {
      throw new Error(
        "Invalid API key. Please check your TMDB API configuration."
      );
    }
    if (error.response?.status === 404) {
      throw new Error("Requested resource not found.");
    }
    if (error.response?.status === 429) {
      throw new Error("Rate limit exceeded. Please try again later.");
    }
  }

  console.error(`${functionName} unexpected error:`, error);
  throw new Error(
    `Failed to fetch ${functionName.replace("get", "").toLowerCase()} movies. Please try again.`
  );
};

// API functions

export const getTrending = async (
  timeWindow: "day" | "week" = "day"
): Promise<TMDBResponse> => {
  try {
    const response = await tmdbApi.get(`/trending/movie/${timeWindow}`);
    return response.data;
  } catch (error) {
    handleApiError(error, "getTrending");
    throw error;
  }
};

export const getPopular = async (page: number = 1): Promise<TMDBResponse> => {
  try {
    const response = await tmdbApi.get("/movie/popular", {
      params: { page },
    });
    return response.data;
  } catch (error) {
    handleApiError(error, "getPopular");
    throw error;
  }
};

export const getTopRated = async (page: number = 1): Promise<TMDBResponse> => {
  try {
    const response = await tmdbApi.get("/movie/top_rated", {
      params: { page },
    });
    return response.data;
  } catch (error) {
    handleApiError(error, "getTopRated");
    throw error;
  }
};

export const getUpcoming = async (page: number = 1): Promise<TMDBResponse> => {
  try {
    const response = await tmdbApi.get("/movie/upcoming", {
      params: { page },
    });
    return response.data;
  } catch (error) {
    handleApiError(error, "getUpcoming");
    throw error;
  }
};

// Optional: Get movie details (for when user clicks on a movie)
export const getMovieDetails = async (movieId: number) => {
  try {
    const response = await tmdbApi.get(`/movie/${movieId}`);
    return response.data;
  } catch (error) {
    handleApiError(error, "getMovieDetails");
    throw error;
  }
};

// Optional: Search movies (for your future Tanstack Query implementation)
export const searchMovies = async (
  query: string,
  page: number = 1
): Promise<TMDBResponse> => {
  try {
    const response = await tmdbApi.get("/search/movie", {
      params: {
        query,
        page,
        include_adult: false, // usually you want to exclude adult content
      },
    });
    return response.data;
  } catch (error) {
    handleApiError(error, "searchMovies");
    throw error;
  }
};
