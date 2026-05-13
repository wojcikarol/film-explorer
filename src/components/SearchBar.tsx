interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = "Szukaj filmów..." }: Props) {
  return (
    <div className="mb-search">
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Wyszukiwarka filmów"
      />
      {value && (
        <button onClick={() => onChange("")} aria-label="Wyczyść wyszukiwanie">
          ×
        </button>
      )}
    </div>
  );
}
