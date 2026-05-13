export function SkeletonCard() {
  return (
    <div className="mb-card mb-skeleton-card">
      <div className="mb-skeleton mb-skeleton-poster" />
      <div className="mb-skeleton mb-skeleton-line" style={{ width: "80%" }} />
      <div className="mb-skeleton mb-skeleton-line" style={{ width: "50%" }} />
    </div>
  );
}

export function SkeletonGrid({ count = 12 }: { count?: number }) {
  return (
    <div className="mb-grid">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}