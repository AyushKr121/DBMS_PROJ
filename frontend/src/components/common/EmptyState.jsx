export default function EmptyState({
  title = "No data found",
  message = "There is nothing to display yet.",
}) {
  return (
    <div className="text-center py-5">
      <h5>{title}</h5>
      <p className="text-muted mb-0">{message}</p>
    </div>
  );
}