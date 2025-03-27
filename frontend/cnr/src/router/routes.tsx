import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../core/state/AuthContext";
import LoginPage from "../feature/auth/view/login/pages/Login";
import ProfilePage from "../feature/profile/view/pages/Profile";
import ErrorPage from "../feature/profile/view/pages/error_page";
import SettingsPage from "../feature/profile/view/pages/Setting";
import SchedulerPage from "../feature/profile/view/pages/SchedulerPage";
import PeerPage from "../feature/profile/view/pages/PeerPage";
import FilesPage from "../feature/file/view/home/pages/Files";
import VersionPage from "../feature/version/view/home/pages/VersionPage";

function AppRouter() {
  const { isAuthentificated } = useAuth();

  return (
    <Routes>
      {/* Login or redirect to home */}
      <Route
        path="/"
        element={
          isAuthentificated ? <Navigate to="/home" replace /> : <LoginPage />
        }
      />

      {/* Protected Profile Layout */}
      <Route
        path="/home"
        element={
          isAuthentificated ? <ProfilePage /> : <Navigate to="/" replace />
        }
      >
        {/* Sub-routes rendered inside ProfilePage */}
        <Route
          path="calender"
          element={isAuthentificated ? <SchedulerPage /> : <ErrorPage />}
        />
        <Route
          path="peer/:userId"
          element={isAuthentificated ? <PeerPage /> : <ErrorPage />}
        >
          <Route path=":folderName" element={<FilesPage />}>
            <Route
              path=":fileName"
              element={
                isAuthentificated ? (
                  <VersionPage />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
          </Route>
        </Route>
      </Route>

      {/* Settings - not nested */}
      <Route
        path="/settings"
        element={isAuthentificated ? <SettingsPage /> : <ErrorPage />}
      />

      {/* Fallback route */}
      <Route
        path="/error-page"
        element={isAuthentificated ? <ErrorPage /> : <LoginPage />}
      />
    </Routes>
  );
}

export default AppRouter;
