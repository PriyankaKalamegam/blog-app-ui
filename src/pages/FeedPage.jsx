import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { platformApi } from "../api/platformApi";
import PostCard from "../components/blog/PostCard";
import SkeletonCard from "../components/ui/SkeletonCard";
import EmptyState from "../components/ui/EmptyState";
import { useToast } from "../context/ToastContext";
import { useDebouncedValue } from "../hooks/useDebouncedValue";

export default function FeedPage() {
  const toast = useToast();
  const [posts, setPosts] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedTag, setSelectedTag] = useState("");

  const debouncedSearch = useDebouncedValue(searchText, 350);

  useEffect(() => {
    platformApi
      .getTags()
      .then(setTags)
      .catch((error) => toast.error(error.message));
  }, [toast]);

  useEffect(() => {
    setLoading(true);
    platformApi
      .getPosts({ search: debouncedSearch, tag: selectedTag })
      .then(setPosts)
      .catch((error) => toast.error(error.message))
      .finally(() => setLoading(false));
  }, [debouncedSearch, selectedTag, toast]);

  const resultsLabel = useMemo(() => `${posts.length} article${posts.length === 1 ? "" : "s"}`, [posts.length]);

  return (
    <section className="space-y-5">
      <header className="card-panel p-5">
        <h1 className="font-display text-2xl text-slate-900 dark:text-slate-100">Developer Blog Feed</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Discover technical writeups, migration notes, and production insights.</p>

        <div className="mt-4 grid gap-3 md:grid-cols-[1fr,auto]">
          <label className="relative block">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Search by title or content"
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-brand-400 dark:border-slate-700 dark:bg-slate-900"
            />
          </label>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedTag("")}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                selectedTag === ""
                  ? "bg-brand-600 text-white"
                  : "border border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              }`}
            >
              All
            </button>
            {tags.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => setSelectedTag(tag.name)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  selectedTag === tag.name
                    ? "bg-brand-600 text-white"
                    : "border border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                }`}
              >
                #{tag.name}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">{resultsLabel}</p>
      </header>

      <div className="grid gap-4">
        {loading && Array.from({ length: 3 }).map((_, index) => <SkeletonCard key={index} />)}

        {!loading && posts.length === 0 && (
          <EmptyState
            title="No posts matched your filter"
            description="Try a broader search term or remove the tag filter."
          />
        )}

        {!loading && posts.map((post) => <PostCard key={post.id} post={post} />)}
      </div>
    </section>
  );
}
