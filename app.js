const { useEffect, useMemo, useState } = React;

const API_BASE = window.APP_CONFIG?.apiBaseUrl || "http://localhost:8081/api";

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options
  });

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const body = await response.json();
      message = body.message || message;
    } catch (err) {
      // Ignore parsing error and keep fallback message.
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }
  return response.json();
}

function formatDate(dateTime) {
  if (!dateTime) return "";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(dateTime));
}

function App() {
  const [posts, setPosts] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState("all");
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingPostDetail, setLoadingPostDetail] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [error, setError] = useState("");
  const [commentAuthor, setCommentAuthor] = useState("");
  const [commentText, setCommentText] = useState("");

  const filteredPosts = useMemo(() => {
    if (selectedTag === "all") return posts;
    return posts.filter((post) => post.tags.includes(selectedTag));
  }, [posts, selectedTag]);

  useEffect(() => {
    loadTags();
    loadPosts();
  }, []);

  useEffect(() => {
    if (!filteredPosts.length) {
      setSelectedPostId(null);
      setSelectedPost(null);
      return;
    }

    const stillVisible = filteredPosts.some((post) => post.id === selectedPostId);
    if (!stillVisible) {
      setSelectedPostId(filteredPosts[0].id);
    }
  }, [filteredPosts, selectedPostId]);

  useEffect(() => {
    if (selectedPostId === null) return;
    loadPostDetail(selectedPostId);
  }, [selectedPostId]);

  async function loadTags() {
    try {
      const data = await apiRequest("/tags");
      setTags(data);
    } catch (err) {
      setError(err.message);
    }
  }

  async function loadPosts() {
    setLoadingPosts(true);
    setError("");
    try {
      const data = await apiRequest("/posts");
      setPosts(data);
      if (data.length) {
        setSelectedPostId(data[0].id);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingPosts(false);
    }
  }

  async function loadPostDetail(postId) {
    setLoadingPostDetail(true);
    setError("");
    try {
      const data = await apiRequest(`/posts/${postId}`);
      setSelectedPost(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingPostDetail(false);
    }
  }

  async function handleLike(postId) {
    try {
      const likeData = await apiRequest(`/posts/${postId}/like`, { method: "POST" });
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId ? { ...post, likeCount: likeData.likeCount } : post
        )
      );
      setSelectedPost((prev) =>
        prev && prev.id === postId ? { ...prev, likeCount: likeData.likeCount } : prev
      );
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleCommentSubmit(event) {
    event.preventDefault();
    if (!selectedPostId) return;

    setSubmittingComment(true);
    setError("");
    try {
      const newComment = await apiRequest(`/posts/${selectedPostId}/comments`, {
        method: "POST",
        body: JSON.stringify({
          author: commentAuthor.trim(),
          text: commentText.trim()
        })
      });

      setSelectedPost((prev) =>
        prev
          ? {
              ...prev,
              comments: [...prev.comments, newComment]
            }
          : prev
      );

      setPosts((prev) =>
        prev.map((post) =>
          post.id === selectedPostId
            ? { ...post, commentCount: post.commentCount + 1 }
            : post
        )
      );

      setCommentAuthor("");
      setCommentText("");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmittingComment(false);
    }
  }

  return (
    <main className="app-shell">
      <header className="hero">
        <p className="eyebrow">Phase 3 · React Frontend</p>
        <h1>Blog Studio</h1>
        <p className="subtitle">
          Explore posts, filter by tag, like what you read, and join the thread with comments.
        </p>
      </header>

      <section className="layout">
        <aside className="panel post-list-panel">
          <div className="panel-top">
            <h2>Posts</h2>
            <button className="ghost-btn" onClick={loadPosts}>Refresh</button>
          </div>

          <div className="tag-strip">
            <button
              className={`tag-chip ${selectedTag === "all" ? "selected" : ""}`}
              onClick={() => setSelectedTag("all")}
            >
              All
            </button>
            {tags.map((tag) => (
              <button
                key={tag.id}
                className={`tag-chip ${selectedTag === tag.name ? "selected" : ""}`}
                onClick={() => setSelectedTag(tag.name)}
              >
                #{tag.name}
              </button>
            ))}
          </div>

          {loadingPosts ? (
            <p className="status">Loading posts...</p>
          ) : filteredPosts.length === 0 ? (
            <p className="status">No posts found for this tag.</p>
          ) : (
            <ul className="post-list">
              {filteredPosts.map((post) => (
                <li key={post.id}>
                  <button
                    className={`post-card ${selectedPostId === post.id ? "active" : ""}`}
                    onClick={() => setSelectedPostId(post.id)}
                  >
                    <h3>{post.title}</h3>
                    <p>{post.author}</p>
                    <div className="meta">
                      <span>{post.likeCount} likes</span>
                      <span>{post.commentCount} comments</span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </aside>

        <article className="panel detail-panel">
          {loadingPostDetail ? (
            <p className="status">Loading post detail...</p>
          ) : selectedPost ? (
            <>
              <div className="detail-head">
                <div>
                  <h2>{selectedPost.title}</h2>
                  <p className="byline">
                    {selectedPost.author} · {formatDate(selectedPost.createdAt)}
                  </p>
                </div>
                <button className="like-btn" onClick={() => handleLike(selectedPost.id)}>
                  Like {selectedPost.likeCount}
                </button>
              </div>

              <div className="tag-strip in-detail">
                {selectedPost.tags.map((tag) => (
                  <span key={tag} className="tag-chip static">#{tag}</span>
                ))}
              </div>

              <p className="content">{selectedPost.content}</p>

              <h3>Comments ({selectedPost.comments.length})</h3>
              {selectedPost.comments.length === 0 ? (
                <p className="status">No comments yet. Be the first one.</p>
              ) : (
                <ul className="comment-list">
                  {selectedPost.comments.map((comment) => (
                    <li key={comment.id} className="comment-item">
                      <div className="comment-head">
                        <strong>{comment.author}</strong>
                        <span>{formatDate(comment.createdAt)}</span>
                      </div>
                      <p>{comment.text}</p>
                    </li>
                  ))}
                </ul>
              )}

              <form className="comment-form" onSubmit={handleCommentSubmit}>
                <h4>Add Comment</h4>
                <input
                  type="text"
                  placeholder="Your name"
                  value={commentAuthor}
                  onChange={(event) => setCommentAuthor(event.target.value)}
                  required
                  maxLength={120}
                />
                <textarea
                  placeholder="Write your comment"
                  value={commentText}
                  onChange={(event) => setCommentText(event.target.value)}
                  required
                  maxLength={1200}
                  rows={4}
                />
                <button type="submit" disabled={submittingComment}>
                  {submittingComment ? "Posting..." : "Post Comment"}
                </button>
              </form>
            </>
          ) : (
            <p className="status">Select a post to view details.</p>
          )}
        </article>
      </section>

      {error && <p className="error-banner">{error}</p>}
    </main>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
