// lib/tmdb.ts
import axios from "axios";

// Cache configuration based on TMDB recommendations
const MINUTE = 60;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const CACHE_DURATIONS = {
  trending: 30 * MINUTE,
  popular: 2 * HOUR,
  topRated: 1 * DAY,
  upcoming: 6 * HOUR,
};

// Types for TMDB API responses
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

// base configuration
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

// create axios instance with base config
const tmdbApi = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: API_KEY,
  },
  timeout: 10000, // 10 second timeout
});

// enhanced error types for better UX
export class TMDBError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public type: "auth" | "rate_limit" | "not_found" | "server" | "network"
  ) {
    super(message);
    this.name = "TMDBError";
  }
}

// enhanced error handler with specific error types
const handleApiError = (error: any, functionName: string): never => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const message = error.response?.data?.status_message || error.message;

    console.error(`${functionName} failed:`, {
      status,
      message,
      url: error.config?.url,
    });

    switch (status) {
      case 401:
        throw new TMDBError("Invalid API key", 401, "auth");
      case 404:
        throw new TMDBError("Resource not found", 404, "not_found");
      case 429:
        throw new TMDBError(
          "Too many requests. Please try again later.",
          429,
          "rate_limit"
        );
      case 500:
      case 502:
      case 503:
        throw new TMDBError("Server temporarily unavailable", status, "server");
      default:
        throw new TMDBError(
          `Failed to fetch ${functionName}: ${message}`,
          status || 500,
          "network"
        );
    }
  }

  console.error(`${functionName} unexpected error:`, error);
  throw new TMDBError(`Network error: ${error.message}`, 500, "network");
};

// server-side cached functions with next.js fetch
export const getTrending = async (
  timeWindow: "day" | "week" = "day"
): Promise<TMDBResponse> => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/trending/movie/${timeWindow}?api_key=${API_KEY}`,
      {
        next: { revalidate: CACHE_DURATIONS.trending },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `HTTP ${response.status}: ${errorData.status_message || response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    handleApiError(error, "getTrending");
  }
};

export const getPopular = async (page: number = 1): Promise<TMDBResponse> => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`,
      {
        next: { revalidate: CACHE_DURATIONS.popular },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `HTTP ${response.status}: ${errorData.status_message || response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    handleApiError(error, "getPopular");
  }
};

export const getTopRated = async (page: number = 1): Promise<TMDBResponse> => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/top_rated?api_key=${API_KEY}&page=${page}`,
      {
        next: { revalidate: CACHE_DURATIONS.topRated },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `HTTP ${response.status}: ${errorData.status_message || response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    handleApiError(error, "getTopRated");
  }
};

export const getUpcoming = async (page: number = 1): Promise<TMDBResponse> => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/upcoming?api_key=${API_KEY}&page=${page}`,
      {
        next: { revalidate: CACHE_DURATIONS.upcoming },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `HTTP ${response.status}: ${errorData.status_message || response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    handleApiError(error, "getUpcoming");
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
        include_adult: false, // Usually you want to exclude adult content
      },
    });
    return response.data;
  } catch (error) {
    handleApiError(error, "searchMovies");
    throw error;
  }
};
