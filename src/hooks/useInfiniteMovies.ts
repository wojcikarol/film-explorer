import { useInfiniteQuery } from "@tanstack/react-query";
import { tmdbClient } from "@/api/tmdbClient";
import { ENDPOINTS } from "@/api/endpoints";
import { QUERY_KEYS } from "@/constants/queryKeys";
import type { MoviesResponse } from "@/types/movie";

export function useInfiniteMovies(query: string) {
  const isSearch = query.trim().length >= 2;
  return useInfiniteQuery<MoviesResponse>({
    queryKey: isSearch
      ? QUERY_KEYS.movies.infiniteSearch(query)
      : QUERY_KEYS.movies.infinitePopular(),
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const page = pageParam as number;
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
    getNextPageParam: (last) =>
      last.page < last.total_pages ? last.page + 1 : undefined,
    staleTime: 1000 * 60 * 3,
  });
}
