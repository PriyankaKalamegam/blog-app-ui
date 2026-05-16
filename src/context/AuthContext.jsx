import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { platformApi } from "../api/platformApi";
import { getStoredToken, setStoredToken } from "../lib/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // On page refresh, restore the session from localStorage and validate it with the backend.
    const token = getStoredToken();
    if (!token) {
      setReady(true);
      return;
    }

    platformApi
      .me()
      .then((data) => setUser(data))
      .catch(() => {
        // A missing/expired token should not trap the user in a broken authenticated state.
        setStoredToken(null);
        setUser(null);
      })
      .finally(() => setReady(true));
  }, []);

  const login = async (payload) => {
    const data = await platformApi.login(payload);
    // Persist the JWT once and keep React state as the source of truth for the current render.
    setStoredToken(data.token);
    setUser(data.user);
    return data;
  };

  const register = async (payload) => {
    const data = await platformApi.register(payload);
    setStoredToken(data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    setStoredToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      ready,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === "ADMIN",
      login,
      register,
      logout,
      refreshMe: async () => {
        // Pages that edit profile data can call this to refresh nav labels/avatar after saving.
        const current = await platformApi.me();
        setUser(current);
        return current;
      }
    }),
    [user, ready]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
