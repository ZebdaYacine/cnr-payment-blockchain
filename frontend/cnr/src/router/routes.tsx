import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../core/state/AuthContext";
import LoginPage from "../feature/auth/view/login/pages/Login";
import RegisterPage from "../feature/auth/view/register/pages/Register";
import ProfilePage from "../feature/profile/view/pages/Profile";
import ErrorPage from "../feature/profile/view/pages/error_page";
import SchedulerPage from "../feature/profile/view/pages/items/SchedulerPage";
import FilesPage from "../feature/file/view/home/pages/Files";
import VersionPage from "../feature/version/view/home/pages/VersionPage";
import DashboardPage from "../feature/dashboard/view/page/DashboardPage";
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
import { ForgetPwdPage } from "../feature/auth/view/forgetPwd/ForgetPwdPage";
import { CCRPage } from "../feature/profile/view/pages/organisatons/CcrPage";
import { AccountPage } from "../feature/profile/view/pages/organisatons/AccountPage";
import { AgencePage } from "../feature/profile/view/pages/organisatons/AgencePage";
import AccountActivation from "../feature/auth/view/register/pages/AccountActivation";

function AppRouter() {
  const { isAuthentificated } = useAuth();
  const { isOTPSent } = useOTP();

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthentificated ? <Navigate to="/home" replace /> : <LoginPage />
        }
      />
      <Route
        path="/register"
        element={
          isAuthentificated ? (
            <Navigate to="/home/welcome" replace />
          ) : (
            <RegisterPage />
          )
        }
      />
      <Route path="/account-activation" element={<AccountActivation />} />
      <Route
        path="/forgot-password"
        element={
          isAuthentificated ? (
            <Navigate to="/home/welcome" replace />
          ) : (
            <ForgetPwdPage />
          )
        }
      />
      <Route path="*" element={<NotFound />} />

      <Route
        path="/home"
        element={
          isAuthentificated ? <ProfilePage /> : <Navigate to="/" replace />
        }
      >
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
          element={isAuthentificated ? <CCRPage /> : <LoginPage />}
        />
        <Route
          path="agence"
          element={isAuthentificated ? <AgencePage /> : <LoginPage />}
        />
        <Route
          path="accounts"
          element={isAuthentificated ? <AccountPage /> : <LoginPage />}
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
