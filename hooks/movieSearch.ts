"use client";

import { useQuery } from "@tanstack/react-query";
import { searchMovies, TMDBResponse } from "@/lib/tmdb";

interface UseMovieSearchProps {
  query: string;
  page?: number;
  enabled?: boolean;
}

export const useMovieSearch = ({
  query,
  page = 1,
  enabled = true,
}: UseMovieSearchProps) => {
  return useQuery({
    queryKey: ["search", query.trim(), page],
    queryFn: () => searchMovies(query.trim(), page),
    enabled: enabled && query.trim().length > 0,
    staleTime: 5 * 60 * 1000, // 5 min
    gcTime: 10 * 60 * 1000, // 10 min
    retry: (failureCount, error: any) => {
      if (error?.statusCode >= 400 && error?.statusCode < 500) {
        return false;
      }
      return failureCount < 2;
    },
  });
};
