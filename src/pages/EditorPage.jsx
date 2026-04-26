import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MarkdownRenderer from "../components/blog/MarkdownRenderer";
import { platformApi } from "../api/platformApi";
import { useToast } from "../context/ToastContext";

const DRAFT_KEY = "devlog.editor.draft";

const initialForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  tags: "java,spring-boot",
  status: "DRAFT"
};

export default function EditorPage() {
  const { postId } = useParams();
  const toast = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState(() => {
    if (!postId) {
      const saved = localStorage.getItem(DRAFT_KEY);
      return saved ? JSON.parse(saved) : initialForm;
    }
    return initialForm;
  });
  const [loading, setLoading] = useState(Boolean(postId));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!postId) return;
    setLoading(true);
    platformApi
      .getPost(postId)
      .then((post) => {
        setForm({
          title: post.title || "",
          slug: post.slug || "",
          excerpt: post.excerpt || "",
          content: post.content || "",
          tags: (post.tags || []).join(","),
          status: post.status || "DRAFT"
        });
      })
      .catch((error) => toast.error(error.message))
      .finally(() => setLoading(false));
  }, [postId, toast]);

  useEffect(() => {
    if (!postId) {
      const timer = setTimeout(() => {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [form, postId]);

  const tagsArray = useMemo(
    () =>
      form.tags
        .split(",")
        .map((tag) => tag.trim().toLowerCase())
        .filter(Boolean),
    [form.tags]
  );

  const onSave = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      toast.error("Title and content are required");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim() || undefined,
        excerpt: form.excerpt.trim() || undefined,
        content: form.content,
        tags: tagsArray,
        status: form.status
      };

      if (postId) {
        await platformApi.updatePost(postId, payload);
        toast.success("Post updated");
      } else {
        const created = await platformApi.createPost(payload);
        localStorage.removeItem(DRAFT_KEY);
        toast.success("Post created");
        navigate(`/posts/${created.id}`);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-slate-600 dark:text-slate-300">Loading editor...</p>;
  }

  return (
    <section className="grid gap-5 lg:grid-cols-2">
      <div className="card-panel p-5">
        <h1 className="font-display text-2xl text-slate-900 dark:text-slate-100">
          {postId ? "Edit Article" : "Markdown Editor"}
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Autosave is enabled for new drafts.</p>

        <div className="mt-4 grid gap-3">
          <input
            value={form.title}
            onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
            placeholder="Post title"
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-brand-400 dark:border-slate-700 dark:bg-slate-900"
          />

          <input
            value={form.slug}
            onChange={(event) => setForm((prev) => ({ ...prev, slug: event.target.value }))}
            placeholder="Custom slug (optional)"
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-brand-400 dark:border-slate-700 dark:bg-slate-900"
          />

          <input
            value={form.excerpt}
            onChange={(event) => setForm((prev) => ({ ...prev, excerpt: event.target.value }))}
            placeholder="Short excerpt"
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-brand-400 dark:border-slate-700 dark:bg-slate-900"
          />

          <input
            value={form.tags}
            onChange={(event) => setForm((prev) => ({ ...prev, tags: event.target.value }))}
            placeholder="tags separated by commas"
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-brand-400 dark:border-slate-700 dark:bg-slate-900"
          />

          <select
            value={form.status}
            onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-brand-400 dark:border-slate-700 dark:bg-slate-900"
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Publish</option>
          </select>

          <textarea
            value={form.content}
            onChange={(event) => setForm((prev) => ({ ...prev, content: event.target.value }))}
            placeholder="Write markdown content"
            rows={16}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 font-mono text-sm outline-none transition focus:border-brand-400 dark:border-slate-700 dark:bg-slate-900"
          />
        </div>

        <button
          type="button"
          disabled={saving}
          onClick={onSave}
          className="mt-4 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-500 disabled:cursor-wait disabled:opacity-70"
        >
          {saving ? "Saving..." : postId ? "Update Post" : "Create Post"}
        </button>
      </div>

      <div className="card-panel p-5">
        <h2 className="font-display text-xl text-slate-900 dark:text-slate-100">Live Preview</h2>
        <div className="mt-4 max-h-[70vh] overflow-auto pr-1">
          <MarkdownRenderer content={form.content || "_Start typing to preview markdown_"} />
        </div>
      </div>
    </section>
  );
}
