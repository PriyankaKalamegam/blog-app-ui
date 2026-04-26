export default function EmptyState({ title, description }) {
  return (
    <div className="card-panel px-6 py-10 text-center">
      <p className="font-display text-lg text-slate-800 dark:text-slate-100">{title}</p>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{description}</p>
    </div>
  );
}
