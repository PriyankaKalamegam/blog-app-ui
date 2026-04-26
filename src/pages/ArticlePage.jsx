import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Bookmark, Heart } from "lucide-react";
import { platformApi } from "../api/platformApi";
import MarkdownRenderer from "../components/blog/MarkdownRenderer";
import ReadingProgressBar from "../components/blog/ReadingProgressBar";
import TableOfContents from "../components/blog/TableOfContents";
import SkeletonCard from "../components/ui/SkeletonCard";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import { extractHeadings } from "../utils/markdown";
import { formatDate } from "../utils/format";

export default function ArticlePage() {
  const { postId } = useParams();
  const toast = useToast();
  const { isAuthenticated, user } = useAuth();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState({ author: "", text: "" });
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    setLoading(true);
    platformApi
      .getPost(postId)
      .then(setPost)
      .catch((error) => toast.error(error.message))
      .finally(() => setLoading(false));
  }, [postId, toast]);

  const headings = useMemo(() => extractHeadings(post?.content || ""), [post?.content]);

  const onLike = async () => {
    try {
      const result = await platformApi.toggleLike(postId);
      setPost((prev) => ({
        ...prev,
        likeCount: result.likeCount,
        likedByCurrentUser: result.likedByCurrentUser
      }));
    } catch (error) {
      toast.error(error.message);
    }
  };

  const onBookmark = async () => {
    try {
      const result = await platformApi.toggleBookmark(postId);
      setPost((prev) => ({ ...prev, bookmarkedByCurrentUser: result.enabled }));
      toast.success(result.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const onSubmitComment = async (event) => {
    event.preventDefault();
    if (!comment.text.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    setSubmittingComment(true);
    try {
      const payload = {
        author: isAuthenticated ? undefined : comment.author,
        text: comment.text.trim()
      };
      const newComment = await platformApi.addComment(postId, payload);
      setPost((prev) => ({ ...prev, comments: [...prev.comments, newComment] }));
      setComment({ author: "", text: "" });
      toast.success("Comment posted");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <section className="space-y-4">
        <SkeletonCard />
        <SkeletonCard />
      </section>
    );
  }

  if (!post) {
    return <p className="text-slate-600 dark:text-slate-300">Post unavailable.</p>;
  }

  return (
    <section className="grid gap-5 lg:grid-cols-[1fr,280px]">
      <ReadingProgressBar />

      <article className="card-panel p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4 dark:border-slate-800">
          <div>
            <h1 className="font-display text-3xl text-slate-900 dark:text-slate-100">{post.title}</h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              {post.author} • {formatDate(post.publishedAt || post.createdAt)}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onLike}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold transition hover:border-brand-300 dark:border-slate-700 dark:bg-slate-900"
            >
              <Heart size={16} className={post.likedByCurrentUser ? "fill-current text-rose-500" : ""} />
              {post.likeCount}
            </button>
            <button
              type="button"
              onClick={onBookmark}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-brand-500"
            >
              <Bookmark size={16} className={post.bookmarkedByCurrentUser ? "fill-current" : ""} />
              {post.bookmarkedByCurrentUser ? "Saved" : "Save"}
            </button>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {post.tags?.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-brand-200 bg-brand-50 px-2 py-1 text-xs font-semibold text-brand-700 dark:border-brand-800 dark:bg-brand-950/50 dark:text-brand-300"
            >
              #{tag}
            </span>
          ))}
        </div>

        <MarkdownRenderer content={post.content} />

        <section className="mt-10 border-t border-slate-200 pt-6 dark:border-slate-800">
          <h2 className="font-display text-xl text-slate-900 dark:text-slate-100">Comments ({post.comments.length})</h2>

          <div className="mt-4 space-y-3">
            {post.comments.map((item) => (
              <div key={item.id} className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
                <div className="mb-1 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-semibold text-slate-700 dark:text-slate-100">{item.author}</span>
                  <span>{formatDate(item.createdAt)}</span>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-200">{item.text}</p>
              </div>
            ))}
          </div>

          <form onSubmit={onSubmitComment} className="mt-5 grid gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
            {!isAuthenticated && (
              <input
                value={comment.author}
                onChange={(event) => setComment((prev) => ({ ...prev, author: event.target.value }))}
                placeholder="Your name"
                maxLength={120}
                required
                className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none transition focus:border-brand-400 dark:border-slate-700 dark:bg-slate-800"
              />
            )}

            {isAuthenticated && (
              <p className="text-xs text-slate-500 dark:text-slate-400">Commenting as @{user.username}</p>
            )}

            <textarea
              value={comment.text}
              onChange={(event) => setComment((prev) => ({ ...prev, text: event.target.value }))}
              placeholder="Share your thoughts"
              maxLength={1200}
              rows={4}
              required
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none transition focus:border-brand-400 dark:border-slate-700 dark:bg-slate-800"
            />

            <button
              type="submit"
              disabled={submittingComment}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-wait disabled:opacity-70 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
            >
              {submittingComment ? "Posting..." : "Post Comment"}
            </button>
          </form>
        </section>
      </article>

      <TableOfContents headings={headings} />
    </section>
  );
}
