import { useEffect, useState } from "react";
import { platformApi } from "../api/platformApi";
import { useToast } from "../context/ToastContext";

export default function AdminPage() {
  const toast = useToast();
  const [overview, setOverview] = useState(null);

  useEffect(() => {
    platformApi
      .getAdminOverview()
      .then(setOverview)
      .catch((error) => toast.error(error.message));
  }, [toast]);

  if (!overview) {
    return <p className="text-slate-600 dark:text-slate-300">Loading admin metrics...</p>;
  }

  const items = [
    { label: "Users", value: overview.users },
    { label: "Posts", value: overview.posts },
    { label: "Comments", value: overview.comments },
    { label: "Tags", value: overview.tags }
  ];

  return (
    <section className="space-y-5">
      <header className="card-panel p-5">
        <h1 className="font-display text-2xl text-slate-900 dark:text-slate-100">Admin Panel</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Platform level visibility for moderation and growth tracking.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-4">
        {items.map((item) => (
          <div key={item.label} className="card-panel p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{item.label}</p>
            <p className="mt-1 font-display text-3xl text-accent-500">{item.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
