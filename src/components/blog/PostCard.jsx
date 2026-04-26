import { Link } from "react-router-dom";
import { MessageSquare, Bookmark, Eye, Heart } from "lucide-react";
import { formatDate } from "../../utils/format";

export default function PostCard({ post }) {
  return (
    <article className="card-panel group p-5 transition hover:-translate-y-0.5">
      <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        <span>{post.status}</span>
        <span>•</span>
        <span>{formatDate(post.publishedAt || post.createdAt)}</span>
      </div>

      <Link to={`/posts/${post.id}`} className="block">
        <h3 className="font-display text-xl leading-tight text-slate-900 transition group-hover:text-brand-700 dark:text-slate-100 dark:group-hover:text-brand-300">
          {post.title}
        </h3>
      </Link>

      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{post.excerpt || "No excerpt"}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {post.tags?.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-brand-200 bg-brand-50 px-2 py-1 text-xs font-semibold text-brand-700 dark:border-brand-800 dark:bg-brand-950/50 dark:text-brand-300"
          >
            #{tag}
          </span>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span className="font-semibold">{post.author}</span>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1"><Heart size={14} /> {post.likeCount || 0}</span>
          <span className="inline-flex items-center gap-1"><MessageSquare size={14} /> {post.commentCount || 0}</span>
          <span className="inline-flex items-center gap-1"><Eye size={14} /> {post.viewCount || 0}</span>
          <span className="inline-flex items-center gap-1"><Bookmark size={14} /> {post.bookmarkedByCurrentUser ? "saved" : "save"}</span>
        </div>
      </div>
    </article>
  );
}
