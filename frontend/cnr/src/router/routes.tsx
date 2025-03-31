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
import WelcomePage from "../feature/profile/view/pages/WelcomePage";
import OtpInput from "../core/components/OtpInput";
import NotFound from "../core/components/NotFound";
import { useOTP } from "../core/state/OTPContext";
import GoBack from "./GoBack";

function AppRouter() {
  const { isAuthentificated } = useAuth();
  const { isOTPSent } = useOTP();

  return (
    <Routes>
      {/* Login or redirect to home */}
      <Route
        path="/"
        element={
          isAuthentificated ? <Navigate to="/home" replace /> : <LoginPage />
        }
      />
      <Route path="*" element={<NotFound />} />

      {/* Protected Profile Layout */}
      <Route
        path="/home"
        element={
          isAuthentificated ? <ProfilePage /> : <Navigate to="/" replace />
        }
      >
        {/* Sub-routes rendered inside ProfilePage */}
        <Route
          path="welcome"
          element={isAuthentificated ? <WelcomePage /> : <LoginPage />}
        />
        <Route
          path="calender"
          element={isAuthentificated ? <SchedulerPage /> : <LoginPage />}
        />
        <Route
          path="dashboard"
          element={isAuthentificated ? <DashboardPage /> : <LoginPage />}
        />
        <Route
          path="general-information"
          element={isAuthentificated ? <ProfileUpdatePage /> : <LoginPage />}
        />
        <Route
          path="update-password"
          element={isAuthentificated ? <PasswordUpdatePage /> : <LoginPage />}
        />
        <Route
          path="PK-manager/:action"
          element={isAuthentificated ? <PKeyPage /> : <LoginPage />}
        />
        <Route
          path="PK-manager/check-otp"
          element={
            isAuthentificated ? (
              isOTPSent ? (
                <OtpInput />
              ) : (
                <GoBack />
              )
            ) : (
              <LoginPage />
            )
          }
        />
        <Route
          path="ccr"
          element={isAuthentificated ? <NotYet /> : <LoginPage />}
        />
        <Route
          path="agence"
          element={isAuthentificated ? <NotYet /> : <LoginPage />}
        />
        <Route
          path="post"
          element={isAuthentificated ? <NotYet /> : <LoginPage />}
        />
        <Route
          path="peer/:userId"
          element={isAuthentificated ? <PeerPage /> : <LoginPage />}
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
          element={isAuthentificated ? <ReglementationPage /> : <LoginPage />}
        />
      </Route>
      <Route
        path="/error-page"
        element={isAuthentificated ? <ErrorPage /> : <LoginPage />}
      />
    </Routes>
  );
}

export default AppRouter;
