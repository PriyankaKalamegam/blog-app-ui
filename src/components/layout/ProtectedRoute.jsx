import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { ready, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!ready) {
    return <div className="mx-auto mt-20 text-center text-slate-500">Checking session...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace state={{ redirectTo: location.pathname }} />;
  }

  return children;
}
