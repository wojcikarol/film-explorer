import { useState } from "react";
import { useCharacters } from "@/hooks/useCharacters";
import { ErrorBanner } from "./ErrorBanner";
import { EmptyState } from "./EmptyState";

export function CharacterWarmup() {
  const [open, setOpen] = useState(true);
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error, refetch, isFetching } = useCharacters(page);

  return (
    <section className="mb-section">
      <header className="mb-section-header">
        <h2>Warm-up: Rick & Morty</h2>
        <button className="mb-btn mb-btn-ghost" onClick={() => setOpen((o) => !o)}>
          {open ? "Zwiń" : "Rozwiń"}
        </button>
      </header>
      {open && (
        <>
          {isLoading && <p>Ładowanie postaci…</p>}
          {isError && (
            <ErrorBanner
              message={(error as Error)?.message || "Błąd pobierania postaci."}
              onRetry={() => refetch()}
            />
          )}
          {data && data.results.length === 0 && <EmptyState message="Brak postaci" />}
          {data && data.results.length > 0 && (
            <>
              <div className="mb-character-grid">
                {data.results.slice(0, 20).map((c) => (
                  <div key={c.id} className="mb-character-card">
                    <img src={c.image} alt={c.name} loading="lazy" />
                    <div>
                      <strong>{c.name}</strong>
                      <span className={`mb-status mb-status-${c.status.toLowerCase()}`}>
                        {c.status}
                      </span>
                      <small>{c.species}</small>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mb-pagination">
                <button
                  className="mb-btn"
                  disabled={page <= 1 || isFetching}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  ← Poprzednia
                </button>
                <span>Strona {page} z {data.info.pages}</span>
                <button
                  className="mb-btn"
                  disabled={!data.info.next || isFetching}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Następna →
                </button>
              </div>
            </>
          )}
        </>
      )}
    </section>
  );
}
