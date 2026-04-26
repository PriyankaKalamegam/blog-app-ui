import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { platformApi } from "../api/platformApi";
import { compactNumber, formatDate } from "../utils/format";
import { useToast } from "../context/ToastContext";

export default function DashboardPage() {
  const toast = useToast();
  const [dashboard, setDashboard] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    platformApi
      .getDashboard()
      .then(setDashboard)
      .catch((error) => toast.error(error.message));

    platformApi
      .getBookmarks()
      .then(setBookmarks)
      .catch(() => {
        // optional section
      });
  }, [toast]);

  if (!dashboard) {
    return <p className="text-slate-600 dark:text-slate-300">Loading dashboard...</p>;
  }

  const stats = [
    { label: "Total Posts", value: compactNumber(dashboard.totalPosts) },
    { label: "Views", value: compactNumber(dashboard.totalViews) },
    { label: "Likes", value: compactNumber(dashboard.totalLikes) },
    { label: "Drafts", value: compactNumber(dashboard.drafts) }
  ];

  return (
    <section className="space-y-5">
      <header className="card-panel p-5">
        <h1 className="font-display text-2xl text-slate-900 dark:text-slate-100">Writer Dashboard</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Track content velocity and engagement in one place.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((item) => (
          <div key={item.label} className="card-panel p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{item.label}</p>
            <p className="mt-1 font-display text-3xl text-brand-700 dark:text-brand-300">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="card-panel p-5">
          <h2 className="font-display text-lg text-slate-900 dark:text-slate-100">Activity Timeline</h2>
          <ul className="mt-3 space-y-3">
            {dashboard.recentActivity.map((activity, index) => (
              <li key={`${activity.title}-${index}`} className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{activity.title}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{formatDate(activity.createdAt)}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="card-panel p-5">
          <h2 className="font-display text-lg text-slate-900 dark:text-slate-100">Bookmarked Reads</h2>
          <div className="mt-3 space-y-3">
            {bookmarks.length === 0 && (
              <p className="text-sm text-slate-500 dark:text-slate-400">No bookmarks yet.</p>
            )}
            {bookmarks.map((post) => (
              <Link key={post.id} to={`/posts/${post.id}`} className="block rounded-lg border border-slate-200 bg-white p-3 transition hover:border-brand-300 dark:border-slate-700 dark:bg-slate-900">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{post.title}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{post.author}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
