import { useTheme } from "../state/ThemeContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext";
import { useLogger } from "../../services/useLogger";
import NotificationDropdown from "./NotificationDropdown";
import { usePhaseId } from "../state/PhaseContext";
import { useRef } from "react";
import UserInfoButton from "./navbar/UserInfoButton";
import Skeleton from "react-loading-skeleton";
import { User } from "../dtos/data";
import TimeDisplay from "./navbar/TimeDisplay";
import DarkModeToggle from "./navbar/DarkModeToggle";
import ProfileDropdown from "./navbar/ProfileDropdown";
import ProfileModal from "./navbar/ProfileModal";
import PhaseModal from "./navbar/PhaseModal";

interface NavBarProps {
  user: User;
}

function NavBarComponent({ user }: NavBarProps) {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const { isAuthentificated, Userlogout } = useAuth();
  const { debug } = useLogger();

  const profileDialogRef = useRef<HTMLDialogElement>(null);
  const phaseDialogRef = useRef<HTMLDialogElement>(null);
  const { phase } = usePhaseId();

  const logoutEvent = () => {
    Userlogout();
    debug("USER IS AUTHENTIFICATED : " + isAuthentificated);
    if (!isAuthentificated) navigate("/");
  };

  return (
    <>
      <div
        className={`flex navbar shadow px-4 h-16 ${
          isDarkMode ? "text-white border-r border-gray-700" : ""
        }`}
      >
        <div className="flex-1">
          {user ? (
            <UserInfoButton user={user} />
          ) : (
            <Skeleton circle height={50} width={50} />
          )}
        </div>

        <div className="flex-1 justify-end flex items-center gap-4">
          {/* <TimeDisplay phaseDialogRef={phaseDialogRef} /> */}
          <TimeDisplay />

          <NotificationDropdown />
          <DarkModeToggle />
          <ProfileDropdown
            profileDialogRef={profileDialogRef}
            onLogout={logoutEvent}
          />
        </div>
      </div>
      <ProfileModal user={user} profileDialogRef={profileDialogRef} />
      <PhaseModal phase={phase || null} phaseDialogRef={phaseDialogRef} />
    </>
  );
}

export default NavBarComponent;
