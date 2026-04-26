export default function TableOfContents({ headings }) {
  if (!headings?.length) return null;

  return (
    <aside className="card-panel sticky top-24 hidden h-fit p-4 lg:block">
      <h4 className="font-display text-sm font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-200">
        On This Page
      </h4>
      <ul className="mt-3 space-y-2 text-sm">
        {headings.map((heading) => (
          <li key={heading.id} style={{ marginLeft: `${(heading.level - 1) * 10}px` }}>
            <a
              href={`#${heading.id}`}
              className="text-slate-600 transition hover:text-brand-700 dark:text-slate-300 dark:hover:text-brand-300"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
