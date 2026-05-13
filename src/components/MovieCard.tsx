import { Heart } from "lucide-react";
import type { Movie } from "@/types/movie";
import { posterUrl } from "@/api/tmdbClient";
import { useFavorites } from "@/hooks/useFavorites";

interface Props {
  movie: Movie;
  onOpen: (id: number) => void;
}

export function MovieCard({ movie, onOpen }: Props) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const fav = isFavorite(movie.id);
  const poster = posterUrl(movie.poster_path);
  const year = movie.release_date ? movie.release_date.slice(0, 4) : "—";

  return (
    <article
      className="mb-card"
      onClick={() => onOpen(movie.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(movie.id);
        }
      }}
    >
      <div className="mb-card-poster">
        {poster ? (
          <img src={poster} alt={`${movie.title} poster`} loading="lazy" />
        ) : (
          <div className="mb-poster-fallback" aria-hidden>
            <span className="mb-poster-fallback-icon">🎞️</span>
            <span className="mb-poster-fallback-title">{movie.title}</span>
          </div>
        )}
        <button
          type="button"
          className={`mb-fav${fav ? " is-fav" : ""}`}
          aria-label={fav ? `Usuń ${movie.title} z ulubionych` : `Dodaj ${movie.title} do ulubionych`}
          aria-pressed={fav}
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(movie);
          }}
        >
          <Heart size={18} fill={fav ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="mb-card-body">
        <h3 className="mb-card-title">{movie.title}</h3>
        <div className="mb-card-meta">
          <span>{year}</span>
          <span>★ {movie.vote_average.toFixed(1)}</span>
        </div>
        <button
          type="button"
          className="mb-btn mb-btn-ghost"
          onClick={(e) => {
            e.stopPropagation();
            onOpen(movie.id);
          }}
        >
          Szczegóły
        </button>
      </div>
    </article>
  );
}
