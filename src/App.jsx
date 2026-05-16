import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import AdminRoute from "./components/layout/AdminRoute";
import LandingPage from "./pages/LandingPage";
import FeedPage from "./pages/FeedPage";
import ArticlePage from "./pages/ArticlePage";
import EditorPage from "./pages/EditorPage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import ResumePage from "./pages/ResumePage";
import AdminPage from "./pages/AdminPage";
import AuthPage from "./pages/AuthPage";

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        {/* Public routes are readable by guests; write/dashboard/admin routes are wrapped below. */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/posts/:postId" element={<ArticlePage />} />
        <Route path="/profiles/:username" element={<ProfilePage />} />
        <Route path="/resume/:username" element={<ResumePage />} />
        <Route path="/auth" element={<AuthPage />} />

        {/* ProtectedRoute redirects anonymous users to login and brings them back after success. */}
        <Route
          path="/editor"
          element={
            <ProtectedRoute>
              <EditorPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editor/:postId"
          element={
            <ProtectedRoute>
              <EditorPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        {/* AdminRoute adds the role check on top of the normal authenticated session check. */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
