import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { useFetchMovies } from "@/hooks/useFetchMovies";
import { useGenres } from "@/hooks/useGenres";
import { useFavorites } from "@/hooks/useFavorites";
import { SearchBar } from "@/components/SearchBar";
import { GenreFilter } from "@/components/GenreFilter";
import { MovieCard } from "@/components/MovieCard";
import { Pagination } from "@/components/Pagination";
import { SkeletonGrid } from "@/components/SkeletonCard";
import { ErrorBanner } from "@/components/ErrorBanner";
import { EmptyState } from "@/components/EmptyState";
import { MovieModal } from "@/components/MovieModal";
import { InfiniteMovieList } from "@/components/InfiniteMovieList";
import { CharacterWarmup } from "@/components/CharacterWarmup";

type Mode = "pagination" | "infinite";

export default function App() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [genreId, setGenreId] = useState<number | null>(null);
  const [openId, setOpenId] = useState<number | null>(null);
  const [mode, setMode] = useState<Mode>("pagination");

  const debounced = useDebounce(search, 300);
  const effectiveQuery = debounced.trim().length >= 2 ? debounced.trim() : "";

  // Reset page when query changes
  useEffect(() => {
    setPage(1);
  }, [effectiveQuery]);

  const moviesQuery = useFetchMovies(effectiveQuery, page);
  const genresQuery = useGenres();
  const { favorites, removeFavorite } = useFavorites();

  const filtered = useMemo(() => {
    const list = moviesQuery.data?.results ?? [];
    if (genreId === null) return list;
    return list.filter((m) => m.genre_ids?.includes(genreId));
  }, [moviesQuery.data, genreId]);

  const isPlaceholder = moviesQuery.isPlaceholderData;

  return (
    <div className="mb-app">
      <header className="mb-header">
        <div className="mb-header-inner">
          <h1 className="mb-logo">
            <span aria-hidden>🎞️</span> Movie Browser
          </h1>
          <p className="mb-tagline">Przeglądaj popularne filmy z TMDB</p>
        </div>
      </header>

      <main className="mb-container">
        <section className="mb-controls">
          <SearchBar value={search} onChange={setSearch} />
          <div className="mb-mode">
            <span>Tryb:</span>
            <button
              className={`mb-toggle${mode === "pagination" ? " is-active" : ""}`}
              onClick={() => setMode("pagination")}
            >
              Paginacja
            </button>
            <button
              className={`mb-toggle${mode === "infinite" ? " is-active" : ""}`}
              onClick={() => setMode("infinite")}
            >
              Infinite scroll
            </button>
          </div>
        </section>

        {genresQuery.data && (
          <GenreFilter
            genres={genresQuery.data.genres}
            value={genreId}
            onChange={setGenreId}
          />
        )}

        {search.length > 0 && search.length < 2 && (
          <p className="mb-hint">Wpisz minimum 2 znaki, aby rozpocząć wyszukiwanie.</p>
        )}

        <section className="mb-section">
          <header className="mb-section-header">
            <h2>{effectiveQuery ? `Wyniki dla „${effectiveQuery}”` : "Popularne filmy"}</h2>
            {moviesQuery.data && mode === "pagination" && (
              <span className="mb-count">
                {moviesQuery.data.total_results.toLocaleString()} wyników
              </span>
            )}
          </header>

          {mode === "infinite" ? (
            <InfiniteMovieList
              query={effectiveQuery}
              genreId={genreId}
              onOpen={setOpenId}
            />
          ) : moviesQuery.isLoading ? (
            <SkeletonGrid />
          ) : moviesQuery.isError ? (
            <ErrorBanner
              message={(moviesQuery.error as Error)?.message || "Nie udało się pobrać filmów."}
              onRetry={() => moviesQuery.refetch()}
            />
          ) : filtered.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              <div
                className="mb-grid"
                style={{ opacity: isPlaceholder ? 0.5 : 1, transition: "opacity .2s" }}
              >
                {filtered.map((m) => (
                  <MovieCard key={m.id} movie={m} onOpen={setOpenId} />
                ))}
              </div>
              <Pagination
                page={page}
                totalPages={moviesQuery.data?.total_pages ?? 1}
                onChange={(p) => {
                  setPage(p);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                isFetching={moviesQuery.isFetching}
              />
            </>
          )}
        </section>

        <section className="mb-section">
          <header className="mb-section-header">
            <h2>Ulubione ({favorites.length})</h2>
          </header>
          {favorites.length === 0 ? (
            <p className="mb-muted">Nie masz jeszcze ulubionych filmów. Kliknij ❤ na karcie filmu.</p>
          ) : (
            <div className="mb-grid">
              {favorites.map((m) => (
                <div key={m.id} className="mb-fav-wrap">
                  <MovieCard movie={m} onOpen={setOpenId} />
                  <button
                    className="mb-btn mb-btn-danger"
                    onClick={() => removeFavorite(m.id)}
                  >
                    Usuń z ulubionych
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <CharacterWarmup />
      </main>

      <footer className="mb-footer">
        <p>Dane: TMDB & Rick and Morty API • Demo Movie Browser</p>
      </footer>

      <MovieModal movieId={openId} onClose={() => setOpenId(null)} />
    </div>
  );
}
