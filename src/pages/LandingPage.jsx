import { Link } from "react-router-dom";
import { ArrowRight, PenSquare, Sparkles, UserRound } from "lucide-react";

export default function LandingPage() {
  return (
    <section className="space-y-6">
      <div className="card-panel overflow-hidden p-8 md:p-12">
        <div className="grid gap-8 md:grid-cols-[1.3fr,1fr] md:items-center">
          <div>
            <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-700 dark:bg-brand-950/40 dark:text-brand-300">
              <Sparkles size={12} /> Developer Blogging Platform
            </p>
            <h1 className="font-display text-4xl font-semibold leading-tight text-slate-900 md:text-5xl dark:text-slate-50">
              Publish engineering stories with startup-grade polish.
            </h1>
            <p className="mt-4 max-w-2xl text-base text-slate-600 md:text-lg dark:text-slate-200">
              Write in markdown, showcase projects, highlight your resume, and build a public developer portfolio that feels premium on every screen.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                to="/feed"
                className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-3 font-semibold text-white transition hover:bg-brand-500"
              >
                Explore Feed <ArrowRight size={16} />
              </Link>
              <Link
                to="/editor"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:border-brand-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              >
                Start Writing <PenSquare size={16} />
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-white/50 bg-gradient-to-br from-brand-600 via-brand-500 to-accent-500 p-6 text-white shadow-card">
            <p className="text-sm uppercase tracking-wider text-white/80">What You Get</p>
            <ul className="mt-3 space-y-3 text-sm md:text-base">
              <li>• Markdown + syntax-highlighted code snippets</li>
              <li>• Dashboard metrics (views, likes, drafts, activity)</li>
              <li>• Public profile with GitHub integration</li>
              <li>• Resume showcase and featured projects</li>
              <li>• Role-based admin controls</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          {
            title: "Modern Feed",
            description: "Searchable, tag-friendly reading experience with smooth loading states.",
            icon: PenSquare
          },
          {
            title: "Developer Identity",
            description: "Public profiles, GitHub stats, skills badges, projects, and resume cards.",
            icon: UserRound
          },
          {
            title: "Portfolio Ready",
            description: "A clean visual system with dark mode and reusable components.",
            icon: Sparkles
          }
        ].map((item) => (
          <article key={item.title} className="card-panel p-5">
            <item.icon className="text-brand-600 dark:text-brand-300" size={20} />
            <h3 className="mt-3 font-display text-lg text-slate-900 dark:text-slate-100">{item.title}</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
