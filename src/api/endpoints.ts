export const ENDPOINTS = {
  popular: "/movie/popular",
  search: "/search/movie",
  movieDetails: (id: number) => `/movie/${id}`,
  genres: "/genre/movie/list",
  characters: "/character",
} as const;
