import { useQuery } from "@tanstack/react-query";
import { tmdbClient } from "@/api/tmdbClient";
import { ENDPOINTS } from "@/api/endpoints";
import { QUERY_KEYS } from "@/constants/queryKeys";
import type { MovieDetails } from "@/types/movie";

export function useMovieDetails(id: number | null) {
  return useQuery<MovieDetails>({
    queryKey: id !== null ? QUERY_KEYS.movies.details(id) : ["movies", "details", "none"],
    queryFn: async () => {
      const { data } = await tmdbClient.get<MovieDetails>(
        ENDPOINTS.movieDetails(id as number),
      );
      return data;
    },
    enabled: id !== null,
    staleTime: 1000 * 60 * 5,
  });
}
