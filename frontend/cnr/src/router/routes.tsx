import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../core/state/AuthContext";
import LoginPage from "../feature/auth/view/login/pages/Login";
import ProfilePage from "../feature/profile/view/pages/Profile";
import ErrorPage from "../feature/profile/view/pages/error_page";
import SchedulerPage from "../feature/profile/view/pages/items/SchedulerPage";
import FilesPage from "../feature/file/view/home/pages/Files";
import VersionPage from "../feature/version/view/home/pages/VersionPage";
import DashboardPage from "../feature/profile/view/pages/items/DashboardPage";
import NotYet from "../core/components/NotYet";
import ReglementationPage from "../feature/profile/view/pages/peers/ReglementationPage";
import PeerPage from "../feature/profile/view/pages/peers/PeerPage";
import ProfileUpdatePage from "../feature/profile/view/pages/editProfile/ProfileUpdatePage";
import PasswordUpdatePage from "../feature/profile/view/pages/editProfile/PasswordUpdatePage";
import PKeyPage from "../feature/profile/view/pages/editProfile/PKeyPage";

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
          path="dashboard"
          element={isAuthentificated ? <DashboardPage /> : <ErrorPage />}
        />
        <Route
          path="general-information"
          element={isAuthentificated ? <ProfileUpdatePage /> : <ErrorPage />}
        />
        <Route
          path="update-password"
          element={isAuthentificated ? <PasswordUpdatePage /> : <ErrorPage />}
        />
        <Route
          path="PK-manager/:action"
          element={isAuthentificated ? <PKeyPage /> : <ErrorPage />}
        />
        <Route
          path="ccr"
          element={isAuthentificated ? <NotYet /> : <ErrorPage />}
        />
        <Route
          path="agence"
          element={isAuthentificated ? <NotYet /> : <ErrorPage />}
        />
        <Route
          path="post"
          element={isAuthentificated ? <NotYet /> : <ErrorPage />}
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
        <Route
          path="reglementaion/:codeReglementation"
          element={isAuthentificated ? <ReglementationPage /> : <ErrorPage />}
        />
      </Route>

      {/* Fallback route */}
      <Route
        path="/error-page"
        element={isAuthentificated ? <ErrorPage /> : <LoginPage />}
      />
    </Routes>
  );
}

export default AppRouter;
