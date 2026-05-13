import type { Genre } from "@/types/movie";

interface Props {
  genres: Genre[];
  value: number | null;
  onChange: (id: number | null) => void;
}

export function GenreFilter({ genres, value, onChange }: Props) {
  return (
    <div className="mb-genre-filter">
      <button
        className={`mb-chip${value === null ? " is-active" : ""}`}
        onClick={() => onChange(null)}
      >
        Wszystkie gatunki
      </button>
      {genres.map((g) => (
        <button
          key={g.id}
          className={`mb-chip${value === g.id ? " is-active" : ""}`}
          onClick={() => onChange(g.id)}
        >
          {g.name}
        </button>
      ))}
    </div>
  );
}
