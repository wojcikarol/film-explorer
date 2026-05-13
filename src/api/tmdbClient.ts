import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_TMDB_BASE_URL || "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY || "";

export const tmdbClient = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: "en-US",
  },
});

export const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";
export const posterUrl = (path: string | null, size: "w200" | "w300" | "w500" = "w300") =>
  path ? `${TMDB_IMAGE_BASE}/${size}${path}` : null;
export const backdropUrl = (path: string | null, size: "w780" | "w1280" = "w1280") =>
  path ? `${TMDB_IMAGE_BASE}/${size}${path}` : null;

export const ramClient = axios.create({
  baseURL: "https://rickandmortyapi.com/api",
});