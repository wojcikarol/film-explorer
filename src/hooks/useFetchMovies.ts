import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { tmdbClient } from "@/api/tmdbClient";
import { ENDPOINTS } from "@/api/endpoints";
import { QUERY_KEYS } from "@/constants/queryKeys";
import type { MoviesResponse } from "@/types/movie";

export function useFetchMovies(query: string, page: number) {
  const isSearch = query.trim().length >= 2;
  return useQuery<MoviesResponse>({
    queryKey: isSearch
      ? QUERY_KEYS.movies.search(query, page)
      : QUERY_KEYS.movies.popular(page),
    queryFn: async () => {
      if (isSearch) {
        const { data } = await tmdbClient.get<MoviesResponse>(ENDPOINTS.search, {
          params: { query, page },
        });
        return data;
      }
      const { data } = await tmdbClient.get<MoviesResponse>(ENDPOINTS.popular, {
        params: { page },
      });
      return data;
    },
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 3,
  });
}
