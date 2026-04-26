import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Github, Globe, MapPin, UserRoundPlus } from "lucide-react";
import { platformApi } from "../api/platformApi";
import { useToast } from "../context/ToastContext";

export default function ProfilePage() {
  const { username } = useParams();
  const toast = useToast();

  const [profile, setProfile] = useState(null);
  const [github, setGithub] = useState(null);
  const [repos, setRepos] = useState([]);

  useEffect(() => {
    platformApi
      .getPublicProfile(username)
      .then((data) => {
        setProfile(data);
        return data;
      })
      .then((data) => {
        if (!data.githubUsername) return;

        fetch(`https://api.github.com/users/${data.githubUsername}`)
          .then((response) => response.json())
          .then(setGithub)
          .catch(() => {
            // optional
          });

        fetch(`https://api.github.com/users/${data.githubUsername}/repos?sort=updated&per_page=6`)
          .then((response) => response.json())
          .then((items) => setRepos(Array.isArray(items) ? items : []))
          .catch(() => {
            // optional
          });
      })
      .catch((error) => toast.error(error.message));
  }, [username, toast]);

  const onFollow = async () => {
    try {
      const result = await platformApi.toggleFollow(username);
      toast.success(result.message);
      const refreshed = await platformApi.getPublicProfile(username);
      setProfile(refreshed);
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (!profile) {
    return <p className="text-slate-600 dark:text-slate-300">Loading profile...</p>;
  }

  return (
    <section className="space-y-5">
      <header className="card-panel p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <img
              src={github?.avatar_url || profile.avatarUrl || "https://placehold.co/96x96?text=Dev"}
              alt={profile.displayName}
              className="h-20 w-20 rounded-2xl border border-slate-200 object-cover dark:border-slate-700"
            />
            <div>
              <h1 className="font-display text-3xl text-slate-900 dark:text-slate-100">{profile.displayName}</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">@{profile.username}</p>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{profile.headline}</p>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                {profile.location && (
                  <span className="inline-flex items-center gap-1"><MapPin size={13} /> {profile.location}</span>
                )}
                {profile.websiteUrl && (
                  <a href={profile.websiteUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-brand-600">
                    <Globe size={13} /> Website
                  </a>
                )}
                {profile.githubUsername && (
                  <a
                    href={`https://github.com/${profile.githubUsername}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 hover:text-brand-600"
                  >
                    <Github size={13} /> GitHub
                  </a>
                )}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onFollow}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-500"
          >
            <UserRoundPlus size={16} /> Follow
          </button>
        </div>

        <p className="mt-4 max-w-3xl text-sm text-slate-700 dark:text-slate-200">{profile.bio}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {profile.skills?.map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              {skill}
            </span>
          ))}
        </div>

        <div className="mt-4 grid gap-3 text-sm md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
            <p className="text-xs text-slate-500 dark:text-slate-400">Followers</p>
            <p className="font-display text-2xl text-brand-700 dark:text-brand-300">{profile.followerCount}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
            <p className="text-xs text-slate-500 dark:text-slate-400">Following</p>
            <p className="font-display text-2xl text-brand-700 dark:text-brand-300">{profile.followingCount}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
            <p className="text-xs text-slate-500 dark:text-slate-400">GitHub Followers</p>
            <p className="font-display text-2xl text-brand-700 dark:text-brand-300">{github?.followers || 0}</p>
          </div>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="card-panel p-5">
          <h2 className="font-display text-lg text-slate-900 dark:text-slate-100">Featured Projects</h2>
          <div className="mt-3 space-y-3">
            {profile.projects.length === 0 && <p className="text-sm text-slate-500 dark:text-slate-400">No projects yet.</p>}
            {profile.projects.map((project) => (
              <article key={project.id} className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{project.name}</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{project.description}</p>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{project.techStack}</p>
                <div className="mt-3 flex gap-3 text-xs font-semibold text-brand-700 dark:text-brand-300">
                  {project.repositoryUrl && (
                    <a href={project.repositoryUrl} target="_blank" rel="noreferrer">Repository</a>
                  )}
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noreferrer">Live</a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="card-panel p-5">
          <h2 className="font-display text-lg text-slate-900 dark:text-slate-100">GitHub Repositories</h2>
          <div className="mt-3 space-y-3">
            {repos.length === 0 && <p className="text-sm text-slate-500 dark:text-slate-400">No GitHub repositories loaded.</p>}
            {repos.map((repo) => (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noreferrer"
                className="block rounded-xl border border-slate-200 bg-white p-4 transition hover:border-brand-300 dark:border-slate-700 dark:bg-slate-900"
              >
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{repo.name}</p>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">{repo.description || "No description"}</p>
              </a>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
