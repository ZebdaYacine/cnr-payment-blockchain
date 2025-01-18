import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../core/state/AuthContext";
import LoginPage from "../feature/auth/view/login/pages/Login";
import HomePage from "../feature/profile/view/home/pages/Home";

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
        path="home"
        element={isAuthentificated ? <HomePage /> : <Navigate to="/" replace />}
      />
    </Routes>
  );
}

export default AppRouter;
