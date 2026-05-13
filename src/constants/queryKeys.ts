export const QUERY_KEYS = {
  movies: {
    all: ["movies"] as const,
    popular: (page: number) => ["movies", "popular", page] as const,
    search: (query: string, page: number) =>
      ["movies", "search", query, page] as const,
    infinitePopular: () => ["movies", "infinite", "popular"] as const,
    infiniteSearch: (query: string) =>
      ["movies", "infinite", "search", query] as const,
    details: (id: number) => ["movies", "details", id] as const,
  },
  genres: {
    list: () => ["genres", "list"] as const,
  },
  characters: {
    page: (page: number, name = "") =>
      ["characters", "page", page, name] as const,
  },
} as const;