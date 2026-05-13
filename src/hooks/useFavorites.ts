import { useCallback, useEffect, useState } from "react";
import type { Movie } from "@/types/movie";

const STORAGE_KEY = "movie-browser-favorites";

type Listener = (items: Movie[]) => void;
const listeners = new Set<Listener>();
let cache: Movie[] | null = null;

function readStorage(): Movie[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Movie[]) : [];
  } catch {
    return [];
  }
}

function writeStorage(items: Movie[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function getCache(): Movie[] {
  if (cache === null) cache = readStorage();
  return cache;
}

function setCache(items: Movie[]) {
  cache = items;
  listeners.forEach((l) => l(items));
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<Movie[]>(() =>
    typeof window === "undefined" ? [] : getCache(),
  );

  useEffect(() => {
    setFavorites(getCache());
    const l: Listener = (items) => setFavorites(items);
    listeners.add(l);
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        cache = readStorage();
        setCache(cache);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(l);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const isFavorite = useCallback(
    (id: number) => favorites.some((m) => m.id === id),
    [favorites],
  );

  // Optimistic toggle: update cache immediately, persist, rollback on error
  const toggleFavorite = useCallback((movie: Movie) => {
    const prev = getCache();
    const exists = prev.some((m) => m.id === movie.id);
    const next = exists ? prev.filter((m) => m.id !== movie.id) : [...prev, movie];
    setCache(next); // optimistic
    try {
      writeStorage(next);
    } catch {
      setCache(prev); // rollback
    }
  }, []);

  const removeFavorite = useCallback((id: number) => {
    const prev = getCache();
    const next = prev.filter((m) => m.id !== id);
    setCache(next);
    try {
      writeStorage(next);
    } catch {
      setCache(prev);
    }
  }, []);

  return { favorites, isFavorite, toggleFavorite, removeFavorite };
}
