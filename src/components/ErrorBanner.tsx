interface Props {
  message?: string;
  onRetry?: () => void;
}

export function ErrorBanner({ message = "Something went wrong.", onRetry }: Props) {
  return (
    <div className="mb-error" role="alert">
      <div>
        <strong>Błąd:</strong> {message}
      </div>
      {onRetry && (
        <button className="mb-btn" onClick={onRetry}>
          Spróbuj ponownie
        </button>
      )}
    </div>
  );
}
