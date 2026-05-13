import { useEffect, useRef } from "react";
import { useInfiniteMovies } from "@/hooks/useInfiniteMovies";
import type { Movie } from "@/types/movie";
import { MovieCard } from "./MovieCard";
import { SkeletonGrid, SkeletonCard } from "./SkeletonCard";
import { ErrorBanner } from "./ErrorBanner";
import { EmptyState } from "./EmptyState";

interface Props {
  query: string;
  genreId: number | null;
  onOpen: (id: number) => void;
}

export function InfiniteMovieList({ query, genreId, onOpen }: Props) {
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteMovies(query);
  const sentinel = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = sentinel.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "300px" },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) return <SkeletonGrid />;
  if (isError)
    return (
      <ErrorBanner
        message={(error as Error)?.message || "Nie udało się pobrać filmów."}
        onRetry={() => refetch()}
      />
    );

  const all: Movie[] = (data?.pages ?? []).flatMap((p) => p.results);
  const filtered = genreId === null ? all : all.filter((m) => m.genre_ids?.includes(genreId));

  if (filtered.length === 0) return <EmptyState />;

  return (
    <>
      <div className="mb-grid">
        {filtered.map((m) => (
          <MovieCard key={m.id} movie={m} onOpen={onOpen} />
        ))}
        {isFetchingNextPage &&
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={`sk-${i}`} />)}
      </div>
      <div ref={sentinel} style={{ height: 1 }} />
      {!hasNextPage && all.length > 0 && (
        <p className="mb-end">— Koniec wyników —</p>
      )}
    </>
  );
}
