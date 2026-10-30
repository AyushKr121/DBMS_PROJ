import Alert from './Alert';
import Button from './Button';

export function Loader({ label = 'Loading…' }) {
  return (
    <div className="loader" role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      <span className="muted">{label}</span>
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <Alert
      tone="danger"
      title="Could not load this page"
      action={onRetry && <Button variant="secondary" size="sm" icon="refresh" onClick={onRetry}>Try again</Button>}
    >
      {message}
    </Alert>
  );
}

/**
 * After the hooks of a page:   const g = gate(s); if (g) return g;
 * Shows a spinner while the first load runs, or the error with a retry button.
 */
export function gate(s) {
  if (s.loading) return <Loader />;
  if (s.error) return <ErrorState message={s.error} onRetry={s.reload} />;
  return null;
}
