import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ramClient } from "@/api/tmdbClient";
import { QUERY_KEYS } from "@/constants/queryKeys";
import type { RamResponse } from "@/types/character";

export function useCharacters(page = 1, name = "") {
  return useQuery<RamResponse>({
    queryKey: QUERY_KEYS.characters.page(page, name),
    queryFn: async () => {
      const { data } = await ramClient.get<RamResponse>("/character", {
        params: { page, name: name || undefined },
      });
      return data;
    },
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}
