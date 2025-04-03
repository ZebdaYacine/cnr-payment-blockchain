import React, { useEffect, useRef, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { MdDashboard, MdCalendarToday, MdError } from "react-icons/md";
import { HiMiniUserGroup } from "react-icons/hi2";
import { FaCheckCircle, FaKey, FaUserEdit } from "react-icons/fa";
import { SiAwsorganizations } from "react-icons/si";
import { useListUsers } from "../state/ListOfUsersContext";
import { User } from "../dtos/data";
import { useUser } from "../state/UserContext";
import NotificationDropdown from "./NotificationDropdown";
import DarkModeToggle from "./navbar/DarkModeToggle";
import ProfileDropdown from "./navbar/ProfileDropdown";
import ProfileModal from "./navbar/ProfileModal";
import PhaseModal from "./navbar/PhaseModal";
import { useLogger } from "../../services/useLogger";
import { usePhaseId } from "../state/PhaseContext";
import { useAuth } from "../state/AuthContext";
import { TiThMenu } from "react-icons/ti";
import { useTheme } from "../state/ThemeContext";
import { GetAgentLabel } from "../../services/Utils";
import { BsFillClipboard2DataFill } from "react-icons/bs";
import { TbLockPassword, TbLogout2 } from "react-icons/tb";
import WelcomePage from "../../feature/profile/view/pages/WelcomePage";
import { useKeys } from "../state/KeyContext";
const ResponsiveDrawer: React.FC = () => {
  const { users } = useListUsers();
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const { isAuthentificated, Userlogout } = useAuth();
  const { debug } = useLogger();
  const location = useLocation();
  const profileDialogRef = useRef<HTMLDialogElement>(null);
  const phaseDialogRef = useRef<HTMLDialogElement>(null);
  const { phase } = usePhaseId();
  const { userSaved } = useUser();
  const { isDarkMode } = useTheme();
  const { isDigitalSignatureConfirmed } = useKeys();

  const logoutEvent = () => {
    Userlogout();
    debug("USER IS AUTHENTIFICATED : " + isAuthentificated);
    if (!isAuthentificated) navigate("/");
  };
  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);
  const navigate = useNavigate();
  return (
    <>
      <div className="drawer lg:drawer-open min-h-screen">
        {/* Page Layout */}
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col">
          {/* Navbar */}
          <header
            className={`fixed top-0 left-0 w-full z-50 navbar 
          ${
            isDarkMode ? "" : "bg-primary "
          } shadow h-16 flex items-center px-4`}
          >
            <label
              htmlFor="my-drawer-2"
              className="btn btn-ghost btn-square drawer-button lg:hidden"
            >
              <TiThMenu className="w-6 h-6 text-cyan-50" />
            </label>
            <div
              className={`btn btn-outline font-bold text-xl ${
                isDarkMode ? "" : "text-white"
              }`}
              onClick={() => {
                navigate("/home/welcome");
              }}
            >
              CNR-Paiement {new String(isDigitalSignatureConfirmed)}
            </div>
            {/* <TimeDisplay phaseDialogRef={phaseDialogRef} /> */}
            <div className="flex-1 justify-end flex items-center ">
              {/* <TimeDisplay phaseDialogRef={phaseDialogRef} /> */}
              <NotificationDropdown />
              <DarkModeToggle />
              <ProfileDropdown
                profileDialogRef={profileDialogRef}
                onLogout={logoutEvent}
              />
            </div>

            <ProfileModal
              user={userSaved}
              profileDialogRef={profileDialogRef}
            />
            <PhaseModal phase={phase || null} phaseDialogRef={phaseDialogRef} />
          </header>

          {/* Push content below navbar */}
          <div className="h-16" />

          {/* Page Content */}
          <main className="p-6">
            {location.pathname === "/home" ? <WelcomePage /> : <Outlet />}
          </main>
        </div>
        {/* Sidebar */}
        <div className="drawer-side">
          <label
            htmlFor="my-drawer-2"
            className="drawer-overlay lg:hidden "
            aria-label="close sidebar"
          />
          <aside
            className={`w-80 h-full pt-16 p-4 ${
              isDarkMode ? "" : "bg-gray-50 text-gray-800"
            }`}
          >
            <div
              className={` rounded-xl shadow-md p-5 m-2 transition-all space-y-3 ${
                isDarkMode
                  ? "bg-slate-800 text-white"
                  : "bg-white text-gray-800"
              }`}
            >
              <h2 className="text-lg font-bold mb-1">
                👤 {userSaved.username}
              </h2>
              <p className="text-sm">
                <span className="font-semibold">🏢 Organisation:</span>{" "}
                {userSaved.workAt}
              </p>
              <p className="text-sm">
                <span className="font-semibold">🎖️ Rôle:</span>{" "}
                {GetAgentLabel(userSaved.type)}
              </p>
              <p className="text-sm">
                <span className="font-semibold">📍 Wilaya:</span>{" "}
                {userSaved.wilaya}
              </p>
              <p className="text-sm">
                <span className="font-semibold">🧩 Rôle:</span>{" "}
                {userSaved.permission}
              </p>
              <p className="text-sm flex items-center gap-2">
                <span className="font-semibold">🔐 Signature numérique : </span>
                {isDigitalSignatureConfirmed ? (
                  <FaCheckCircle className="text-blue-700 font-bold text-xl" />
                ) : (
                  <MdError className="text-xl text-red-700 animate-pulse" />
                )}
              </p>
            </div>
            <div className="divider" />
            <ul className="menu space-y-2 text-base font-medium">
              <li>
                <Link to="/home/dashboard" className="flex items-center gap-3">
                  <MdDashboard className="text-xl" />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/home/calender" className="flex items-center gap-3">
                  <MdCalendarToday className="text-xl" />
                  Calendrier
                </Link>
              </li>
              <li>
                <details className="group">
                  <summary className="flex items-center gap-3 cursor-pointer">
                    <HiMiniUserGroup className="text-xl" />
                    Intervenants
                  </summary>
                  <ul className="pl-8 mt-2 space-y-2 max-h-64 overflow-y-auto pr-2">
                    {filteredUsers.length === 0 ? (
                      <p className="text-lg font-semibold ">
                        Aucun utilisateur disponible
                      </p>
                    ) : (
                      filteredUsers
                        .filter(
                          (user) =>
                            user.id !== undefined &&
                            user.id !== userSaved.idInstituion
                        )
                        .map((user) => (
                          <li key={user.id}>
                            <button
                              onClick={() => {
                                if (
                                  user.phases.includes(phase?.id || "") &&
                                  userSaved.phases.includes(phase?.id || "")
                                ) {
                                  navigate(`/home/peer/${user.id}`);
                                } else {
                                  navigate(`/home/reglementaion/COM-001`);
                                }
                              }}
                              className="block text-left w-full"
                            >
                              {user.username} – {user.workAt} / {user.wilaya}
                            </button>
                          </li>
                        ))
                    )}
                  </ul>
                </details>
              </li>
              <li>
                <details className="group">
                  <summary className="flex items-center gap-3 cursor-pointer">
                    <SiAwsorganizations className="text-xl" />
                    Organisations
                  </summary>
                  <ul className="pl-8 mt-2 space-y-2">
                    <li>
                      <Link to="/home/ccr" className="block">
                        CCR
                      </Link>
                    </li>
                    <li>
                      <Link to="/home/agence" className="block">
                        Agences
                      </Link>
                    </li>
                    <li>
                      <Link to="/home/post" className="block">
                        POSTS
                      </Link>
                    </li>
                  </ul>
                </details>
              </li>
              <li>
                <details className="group">
                  <summary className="flex items-center gap-3 cursor-pointer">
                    <FaUserEdit className="text-xl" />
                    Profile
                  </summary>
                  <ul className="pl-8 mt-2 space-y-2">
                    <li>
                      <Link
                        to="/home/general-information"
                        className="flex items-center gap-2"
                      >
                        <BsFillClipboard2DataFill />
                        Informations Generale
                      </Link>
                    </li>

                    <li>
                      <Link
                        to="/home/update-password"
                        className="flex items-center gap-2"
                      >
                        <TbLockPassword />
                        Mots de passe
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/home/PK-manager/get-public-key"
                        className="flex items-center gap-2"
                      >
                        <FaKey />
                        Cles Publique
                      </Link>
                    </li>
                  </ul>
                </details>
              </li>
              <li>
                <button
                  onClick={() => {
                    if (isAuthentificated) {
                      Userlogout();
                      navigate(`/login`);
                    }
                  }}
                  className=" flex items-center gap-2"
                >
                  <TbLogout2 />
                  déconnexion
                </button>
              </li>
            </ul>
          </aside>
        </div>
      </div>
    </>
  );
};

export default ResponsiveDrawer;
