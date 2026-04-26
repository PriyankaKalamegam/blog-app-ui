import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const initialRegister = {
  email: "",
  username: "",
  displayName: "",
  password: ""
};

const initialLogin = {
  identifier: "",
  password: ""
};

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();
  const toast = useToast();

  const [mode, setMode] = useState("login");
  const [loginForm, setLoginForm] = useState(initialLogin);
  const [registerForm, setRegisterForm] = useState(initialRegister);
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = location.state?.redirectTo || "/dashboard";

  const onLogin = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await login(loginForm);
      toast.success("Logged in");
      navigate(redirectTo, { replace: true });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const onRegister = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await register(registerForm);
      toast.success("Account created");
      navigate(redirectTo, { replace: true });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mx-auto max-w-lg card-panel p-6">
      <div className="mb-5 flex gap-2 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
        <button
          type="button"
          onClick={() => setMode("login")}
          className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${
            mode === "login" ? "bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100" : "text-slate-500"
          }`}
        >
          Login
        </button>
        <button
          type="button"
          onClick={() => setMode("register")}
          className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${
            mode === "register" ? "bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100" : "text-slate-500"
          }`}
        >
          Register
        </button>
      </div>

      {mode === "login" ? (
        <form onSubmit={onLogin} className="grid gap-3">
          <input
            value={loginForm.identifier}
            onChange={(event) => setLoginForm((prev) => ({ ...prev, identifier: event.target.value }))}
            placeholder="Username or email"
            required
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-brand-400 dark:border-slate-700 dark:bg-slate-900"
          />
          <input
            type="password"
            value={loginForm.password}
            onChange={(event) => setLoginForm((prev) => ({ ...prev, password: event.target.value }))}
            placeholder="Password"
            required
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-brand-400 dark:border-slate-700 dark:bg-slate-900"
          />
          <button
            type="submit"
            disabled={submitting}
            className="rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-500 disabled:cursor-wait disabled:opacity-70"
          >
            {submitting ? "Signing in..." : "Sign In"}
          </button>
        </form>
      ) : (
        <form onSubmit={onRegister} className="grid gap-3">
          <input
            value={registerForm.email}
            onChange={(event) => setRegisterForm((prev) => ({ ...prev, email: event.target.value }))}
            placeholder="Email"
            required
            type="email"
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-brand-400 dark:border-slate-700 dark:bg-slate-900"
          />
          <input
            value={registerForm.username}
            onChange={(event) => setRegisterForm((prev) => ({ ...prev, username: event.target.value }))}
            placeholder="Username"
            required
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-brand-400 dark:border-slate-700 dark:bg-slate-900"
          />
          <input
            value={registerForm.displayName}
            onChange={(event) => setRegisterForm((prev) => ({ ...prev, displayName: event.target.value }))}
            placeholder="Display Name"
            required
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-brand-400 dark:border-slate-700 dark:bg-slate-900"
          />
          <input
            type="password"
            value={registerForm.password}
            onChange={(event) => setRegisterForm((prev) => ({ ...prev, password: event.target.value }))}
            placeholder="Password"
            minLength={8}
            required
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-brand-400 dark:border-slate-700 dark:bg-slate-900"
          />
          <button
            type="submit"
            disabled={submitting}
            className="rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-500 disabled:cursor-wait disabled:opacity-70"
          >
            {submitting ? "Creating account..." : "Create Account"}
          </button>
        </form>
      )}
    </section>
  );
}
