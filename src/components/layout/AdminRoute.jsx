import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminRoute({ children }) {
  const { ready, isAuthenticated, isAdmin } = useAuth();

  if (!ready) {
    return <div className="mx-auto mt-20 text-center text-slate-500">Checking permissions...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
