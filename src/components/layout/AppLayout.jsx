import { Link, NavLink, Outlet } from "react-router-dom";
import ThemeToggle from "../ui/ThemeToggle";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { to: "/feed", label: "Blog Feed" },
  { to: "/editor", label: "Write" },
  { to: "/dashboard", label: "Dashboard" }
];

export default function AppLayout() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-white/30 bg-white/70 backdrop-blur dark:border-slate-800 dark:bg-slate-950/70">
        <div className="mx-auto flex w-[min(1200px,calc(100vw-1.5rem))] items-center justify-between py-3">
          <div className="flex items-center gap-5">
            <Link to="/" className="font-display text-xl font-semibold tracking-tight text-brand-700 dark:text-brand-300">
              DevLog Platform
            </Link>
            <nav className="hidden items-center gap-1 md:flex">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-2 text-sm transition ${
                      isActive
                        ? "bg-brand-600 text-white"
                        : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              {isAdmin && (
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-2 text-sm transition ${
                      isActive
                        ? "bg-accent-500 text-white"
                        : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                    }`
                  }
                >
                  Admin
                </NavLink>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            {isAuthenticated ? (
              <>
                <Link
                  to={`/profiles/${user.username}`}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-brand-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                >
                  @{user.username}
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="rounded-lg bg-brand-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-brand-500"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="page-transition mx-auto w-[min(1200px,calc(100vw-1.5rem))] py-6">
        <Outlet />
      </main>
    </div>
  );
}
