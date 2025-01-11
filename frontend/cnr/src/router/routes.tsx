import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import { ThemeProvider } from "../core/state/ThemeContext";
import { UserProvider } from "../core/state/UserContext";
import LoginPage from "../feature/auth/view/login/pages/Login";
import HomePage from "../feature/profile/view/home/pages/Home";
import ProtectedRoute from "./protected";

function AppRouter() {
  const token = localStorage.getItem("authToken");
  const isAuthenticated = !!token;

  return (
    <BrowserRouter>
      <ThemeProvider>
        <UserProvider>
          <Routes>
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  <Navigate to="/home" replace />
                ) : (
                  <LoginPage />
                )
              }
            />
            <Route
              path="home"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <HomePage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </UserProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default AppRouter;
