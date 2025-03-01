import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../core/state/AuthContext";
import LoginPage from "../feature/auth/view/login/pages/Login";
import ProfilePage from "../feature/profile/view/pages/Profile";
import VersionPage from "../feature/version/view/home/pages/VersionPage";

function AppRouter() {
  const { isAuthentificated } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthentificated ? <Navigate to="home" replace /> : <LoginPage />
        }
      />
      <Route
        path="/home"
        element={
          isAuthentificated ? <ProfilePage /> : <Navigate to="/" replace />
        }
      />
      <Route
        path="/versions-file"
        element={
          isAuthentificated ? <VersionPage /> : <Navigate to="/" replace />
        }
      />
    </Routes>
  );
}

export default AppRouter;
