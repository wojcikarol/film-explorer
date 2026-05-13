import { useQuery } from "@tanstack/react-query";
import { tmdbClient } from "@/api/tmdbClient";
import { ENDPOINTS } from "@/api/endpoints";
import { QUERY_KEYS } from "@/constants/queryKeys";
import type { GenresResponse } from "@/types/movie";

export function useGenres() {
  return useQuery<GenresResponse>({
    queryKey: QUERY_KEYS.genres.list(),
    queryFn: async () => {
      const { data } = await tmdbClient.get<GenresResponse>(ENDPOINTS.genres);
      return data;
    },
    staleTime: 1000 * 60 * 60,
  });
}
