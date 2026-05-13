interface Props {
  page: number;
  totalPages: number;
  onChange: (p: number) => void;
  isFetching?: boolean;
}

export function Pagination({ page, totalPages, onChange, isFetching }: Props) {
  return (
    <nav className="mb-pagination" aria-label="Paginacja">
      <button
        className="mb-btn"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1 || isFetching}
      >
        ← Poprzednia
      </button>
      <span>
        Strona <strong>{page}</strong>
        {totalPages ? ` z ${totalPages}` : ""}
      </span>
      <button
        className="mb-btn"
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages || isFetching}
      >
        Następna →
      </button>
    </nav>
  );
}
