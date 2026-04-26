import { request } from "./client";

export const platformApi = {
  register: (payload) => request("/auth/register", { method: "POST", body: JSON.stringify(payload) }),
  login: (payload) => request("/auth/login", { method: "POST", body: JSON.stringify(payload) }),
  me: () => request("/auth/me"),

  getPosts: ({ search = "", tag = "" } = {}) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (tag) params.set("tag", tag);
    const suffix = params.toString() ? `?${params.toString()}` : "";
    return request(`/posts${suffix}`);
  },
  getPost: (postId) => request(`/posts/${postId}`),
  createPost: (payload) => request("/posts", { method: "POST", body: JSON.stringify(payload) }),
  updatePost: (postId, payload) =>
    request(`/posts/${postId}`, { method: "PUT", body: JSON.stringify(payload) }),
  deletePost: (postId) => request(`/posts/${postId}`, { method: "DELETE" }),
  addComment: (postId, payload) =>
    request(`/posts/${postId}/comments`, { method: "POST", body: JSON.stringify(payload) }),
  toggleLike: (postId) => request(`/posts/${postId}/like`, { method: "POST" }),
  toggleBookmark: (postId) => request(`/posts/${postId}/bookmark`, { method: "POST" }),
  getBookmarks: () => request("/posts/bookmarks"),

  getTags: () => request("/tags"),

  getDashboard: () => request("/dashboard/me"),

  getPublicProfile: (username) => request(`/profiles/${username}`),
  getMyProfile: () => request("/profiles/me"),
  updateMyProfile: (payload) => request("/profiles/me", { method: "PUT", body: JSON.stringify(payload) }),
  toggleFollow: (username) => request(`/profiles/${username}/follow`, { method: "POST" }),

  createProject: (payload) =>
    request("/profiles/me/projects", { method: "POST", body: JSON.stringify(payload) }),
  updateProject: (projectId, payload) =>
    request(`/profiles/me/projects/${projectId}`, { method: "PUT", body: JSON.stringify(payload) }),
  deleteProject: (projectId) => request(`/profiles/me/projects/${projectId}`, { method: "DELETE" }),

  upsertResume: (payload) => request("/profiles/me/resume", { method: "PUT", body: JSON.stringify(payload) }),
  getResume: (username) => request(`/resume/${username}`),

  getAdminOverview: () => request("/admin/overview")
};
