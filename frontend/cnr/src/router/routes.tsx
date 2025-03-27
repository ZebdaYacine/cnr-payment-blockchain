import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../core/state/AuthContext";
import LoginPage from "../feature/auth/view/login/pages/Login";
import ProfilePage from "../feature/profile/view/pages/Profile";
import VersionPage from "../feature/version/view/home/pages/VersionPage";
import FilesPage from "../feature/file/view/home/pages/Files";
import ErrorPage from "../feature/profile/view/pages/error_page";
import SettingsPage from "../feature/profile/view/pages/Setting";
import SchedulerPage from "../feature/profile/view/pages/SchedulerPage";

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
      >
        <Route path=":folderName" element={<FilesPage />}>
          <Route
            path=":fileName"
            element={
              isAuthentificated ? <VersionPage /> : <Navigate to="/" replace />
            }
          />
        </Route>
      </Route>
      <Route
        path="/settings"
        element={isAuthentificated ? <SettingsPage /> : <ErrorPage />}
      />
      <Route
        path="/calender"
        element={isAuthentificated ? <SchedulerPage /> : <ErrorPage />}
      />
      <Route
        path="/error-page"
        element={isAuthentificated ? <ErrorPage /> : <LoginPage />}
      />
      {/* <Route path="/home/:folderName" element={<FilesPage />} />{" "} */}
    </Routes>
  );
}

export default AppRouter;
