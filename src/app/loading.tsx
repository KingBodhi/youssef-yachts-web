export default function Loading() {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="flex min-h-[70vh] items-center justify-center"
    >
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/15 border-t-primary" />
      <span className="sr-only">Loading</span>
    </div>
  );
}
