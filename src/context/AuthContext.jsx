import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { platformApi } from "../api/platformApi";
import { getStoredToken, setStoredToken } from "../lib/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      setReady(true);
      return;
    }

    platformApi
      .me()
      .then((data) => setUser(data))
      .catch(() => {
        setStoredToken(null);
        setUser(null);
      })
      .finally(() => setReady(true));
  }, []);

  const login = async (payload) => {
    const data = await platformApi.login(payload);
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
