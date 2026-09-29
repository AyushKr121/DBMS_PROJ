export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="alert alert-danger" role="alert">
      <p className="mb-2">{message || "Something went wrong."}</p>

      {onRetry && (
        <button className="btn btn-outline-danger btn-sm" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
}