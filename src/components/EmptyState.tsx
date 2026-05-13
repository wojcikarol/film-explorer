export function EmptyState({ message = "Nie znaleziono filmów" }: { message?: string }) {
  return (
    <div className="mb-empty">
      <div className="mb-empty-icon" aria-hidden>🎬</div>
      <p>{message}</p>
    </div>
  );
}
