import { useEffect } from "react";
import { backdropUrl, posterUrl } from "@/api/tmdbClient";
import { useMovieDetails } from "@/hooks/useMovieDetails";
import { ErrorBanner } from "./ErrorBanner";

interface Props {
  movieId: number | null;
  onClose: () => void;
}

function fmtMoney(n: number) {
  if (!n) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

export function MovieModal({ movieId, onClose }: Props) {
  const { data, isLoading, isError, error, refetch } = useMovieDetails(movieId);

  useEffect(() => {
    if (movieId === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [movieId, onClose]);

  if (movieId === null) return null;

  return (
    <div
      className="mb-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Szczegóły filmu"
    >
      <div className="mb-modal" onClick={(e) => e.stopPropagation()}>
        <button className="mb-modal-close" onClick={onClose} aria-label="Zamknij">
          ×
        </button>
        {isLoading && (
          <div className="mb-modal-loading">
            <div className="mb-skeleton" style={{ height: 240 }} />
            <div className="mb-skeleton mb-skeleton-line" style={{ width: "60%" }} />
            <div className="mb-skeleton mb-skeleton-line" style={{ width: "90%" }} />
            <div className="mb-skeleton mb-skeleton-line" style={{ width: "85%" }} />
          </div>
        )}
        {isError && (
          <ErrorBanner
            message={(error as Error)?.message || "Nie udało się załadować szczegółów."}
            onRetry={() => refetch()}
          />
        )}
        {data && (
          <>
            {data.backdrop_path && (
              <div className="mb-modal-backdrop-img" style={{ backgroundImage: `url(${backdropUrl(data.backdrop_path)})` }} />
            )}
            <div className="mb-modal-body">
              <div className="mb-modal-poster">
                {data.poster_path ? (
                  <img src={posterUrl(data.poster_path, "w300") || undefined} alt={data.title} />
                ) : (
                  <div className="mb-poster-fallback">🎞️</div>
                )}
              </div>
              <div className="mb-modal-content">
                <h2>{data.title}</h2>
                {data.tagline && <p className="mb-tagline">{data.tagline}</p>}
                <div className="mb-modal-meta">
                  <span>{data.release_date || "—"}</span>
                  <span>★ {data.vote_average?.toFixed(1)}</span>
                  {data.runtime ? <span>{data.runtime} min</span> : null}
                  <span>{data.status}</span>
                </div>
                <div className="mb-genre-list">
                  {data.genres.map((g) => (
                    <span key={g.id} className="mb-chip is-static">{g.name}</span>
                  ))}
                </div>
                <p className="mb-overview">{data.overview || "Brak opisu."}</p>
                <dl className="mb-modal-stats">
                  <div><dt>Budżet</dt><dd>{fmtMoney(data.budget)}</dd></div>
                  <div><dt>Przychód</dt><dd>{fmtMoney(data.revenue)}</dd></div>
                </dl>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}