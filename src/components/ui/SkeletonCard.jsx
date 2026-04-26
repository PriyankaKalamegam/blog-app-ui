export default function SkeletonCard() {
  return (
    <div className="card-panel animate-pulse p-4">
      <div className="mb-2 h-5 w-3/5 rounded bg-slate-200 dark:bg-slate-700" />
      <div className="mb-3 h-4 w-2/5 rounded bg-slate-200 dark:bg-slate-700" />
      <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-700" />
    </div>
  );
}
