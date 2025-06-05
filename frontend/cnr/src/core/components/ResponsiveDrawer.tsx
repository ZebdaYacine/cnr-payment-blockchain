import React, { useEffect, useRef, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { MdDashboard, MdCalendarToday, MdError } from "react-icons/md";
import { HiMiniUserGroup } from "react-icons/hi2";
import { FaCheckCircle, FaKey, FaUserEdit } from "react-icons/fa";
import { SiAwsorganizations } from "react-icons/si";
import { BsFillClipboard2DataFill } from "react-icons/bs";
import { TbLockPassword, TbLogout2 } from "react-icons/tb";
import { TiThMenu } from "react-icons/ti";

import { useListUsers } from "../state/ListOfUsersContext";
import { useUser } from "../state/UserContext";
import { usePhaseId } from "../state/PhaseContext";
import { useAuth } from "../state/AuthContext";
import { useTheme } from "../state/ThemeContext";
import { useLogger } from "../../services/useLogger";
import { useKeys } from "../state/KeyContext";
import { GetAgentLabel } from "../../services/Utils";

import NotificationDropdown from "./NotificationDropdown";
import DarkModeToggle from "./navbar/DarkModeToggle";
import ProfileDropdown from "./navbar/ProfileDropdown";
import ProfileModal from "./navbar/ProfileModal";
import PhaseModal from "./navbar/PhaseModal";
import WelcomePage from "../../feature/profile/view/pages/WelcomePage";
import KeyDownloadDropdown from "./KeyDownLoadDropdown";

const NavItem = ({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  path: string;
  onClick?: () => void;
}) => (
  <li>
    <button
      onClick={onClick}
      className="flex items-center gap-3 w-full text-left"
    >
      {icon}
      {label}
    </button>
  </li>
);

const ResponsiveDrawer: React.FC = () => {
  const { users } = useListUsers();
  const { userSaved } = useUser();
  const { phase } = usePhaseId();
  const { isAuthentificated, Userlogout } = useAuth();
  const { isDarkMode } = useTheme();
  const { isDigitalSignatureConfirmed } = useKeys();
  const { debug } = useLogger();
  const location = useLocation();
  const navigate = useNavigate();

  const [filteredUsers, setFilteredUsers] = useState(users);

  const profileDialogRef = useRef<HTMLDialogElement>(null);
  const phaseDialogRef = useRef<HTMLDialogElement>(null);

  const navigateWithSignatureCheck = (path: string) => {
    const storedConfirmed = localStorage.getItem("isDigitalSignatureConfirmed");
    if (storedConfirmed !== "true") {
      navigate("/home/reglementaion/COM-003");
    } else {
      navigate(path);
    }
  };

  // const navigatePeers = (user: User) => {
  //   navigateWithSignatureCheck(`/home/peer/${user.id}`);
  //   console.log("Current Phase:", phase == null);
  //   if (phase == null) {
  //     navigate("/home/reglementaion/COM-001");
  //   }
  //   console.log(">>>>>>>>>>>>>>>>>>>>:", user.phases);
  //   console.log(">>>>>>>>>>>>>>>>>>>>:", userSaved.phases);

  //   if (!userSaved.phases.some((p) => p.id == phase?.id)) {
  //     navigate("/home/reglementaion/COM-001");
  //   }
  //   if (!user.phases.some((p) => p.id === phase?.id)) {
  //     navigate("/home/reglementaion/COM-002");
  //   }
  //   navigate(`/home/peer/${user.id}`);
  // };

  const logoutEvent = () => {
    Userlogout();
    debug("USER IS AUTHENTIFICATED : " + isAuthentificated);
    navigate("/login");
  };

  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);

  return (
    <>
      <div className="drawer lg:drawer-open min-h-screen">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col">
          <header
            className={`fixed top-0 left-0 w-full z-50 navbar ${
              isDarkMode ? "" : "bg-primary"
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
              onClick={() => navigate("/home/welcome")}
            >
              TE-CNR
            </div>
            <div className="flex-1 justify-end flex items-center">
              <KeyDownloadDropdown />
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

          <div className="h-16" />
          <main className="p-6">
            {location.pathname === "/home" ? <WelcomePage /> : <Outlet />}
          </main>
        </div>

        <div className="drawer-side">
          <label htmlFor="my-drawer-2" className="drawer-overlay lg:hidden" />
          <aside
            className={`w-80 h-full pt-16 p-4 shadow-md ${
              isDarkMode ? "bg-gray-900 text-white" : "bg-white"
            }`}
          >
            <div className="rounded-xl shadow p-5 m-2 space-y-3">
              <h2 className="text-lg font-bold mb-1">
                👤 {userSaved.username}
              </h2>
              <p className="text-sm">
                <strong>🏢 Organisation:</strong> {userSaved.workAt}
              </p>
              <p className="text-sm">
                <strong>🎖️ Rôle:</strong> {GetAgentLabel(userSaved.type)}
              </p>
              <p className="text-sm">
                <strong>📍 Wilaya:</strong> {userSaved.wilaya}
              </p>
              <p className="text-sm">
                <strong>🧩 Rôle:</strong> {userSaved.permission}
              </p>
              <p className="text-sm flex items-center gap-2">
                <strong>🔐 Signature numérique:</strong>
                {isDigitalSignatureConfirmed ? (
                  <FaCheckCircle className="text-blue-700 font-bold text-xl" />
                ) : (
                  <MdError className="text-xl text-red-700 animate-pulse" />
                )}
              </p>
            </div>

            <div className="divider" />

            <ul className="menu space-y-2 text-base font-medium">
              {userSaved.permission === "ADMIN" ? (
                <NavItem
                  icon={<MdDashboard />}
                  label="Dashboard"
                  path="/home/dashboard"
                  onClick={() => navigateWithSignatureCheck("/home/dashboard")}
                />
              ) : (
                ""
              )}
              <NavItem
                icon={<MdCalendarToday />}
                label="Calendrier"
                path="/home/calender"
                onClick={() => navigateWithSignatureCheck("/home/calender")}
              />
              <li>
                <details className="group">
                  <summary className="flex items-center gap-3 cursor-pointer">
                    <HiMiniUserGroup className="text-xl" />
                    Intervenants
                  </summary>
                  <ul className="pl-8 mt-2 space-y-2 max-h-64 overflow-y-auto pr-2">
                    {filteredUsers.length === 0 ? (
                      <div className="flex flex-col space-y-5 items-center justify-center p w-full max-w-md mx-auto">
                        <p
                          className="text-sm font-semibold text-blue-500 hover:text-blue-700 transition-colors duration-200 cursor-pointer"
                          onClick={() =>
                            navigate(`/home/reglementaion/COM-001`)
                          }
                        >
                          Aucun utilisateur disponible <br />
                          👉 voir la réglementation
                        </p>
                      </div>
                    ) : (
                      filteredUsers
                        .filter(
                          (user) =>
                            user.id && user.id !== userSaved.idInstituion
                        )
                        .map((user) => (
                          <li key={user.id}>
                            <button
                              onClick={() =>
                                navigateWithSignatureCheck(
                                  `/home/peer/${user.id}`
                                )
                              }
                              className="block text-left w-full"
                            >
                              {user.last_name} – {user.workAt} / {user.wilaya}
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
                      <button
                        onClick={() => navigate("/home/ccr")}
                        className="block text-left w-full"
                      >
                        CCR
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => navigate("/home/agence")}
                        className="block text-left w-full"
                      >
                        Agences
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => navigate("/home/accounts")}
                        className="block text-left w-full"
                      >
                        Comptes
                      </button>
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
                      <button
                        onClick={() =>
                          navigateWithSignatureCheck(
                            "/home/general-information"
                          )
                        }
                        className="flex items-center gap-2"
                      >
                        <BsFillClipboard2DataFill />
                        Informations Générales
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() =>
                          navigateWithSignatureCheck("/home/update-password")
                        }
                        className="flex items-center gap-2"
                      >
                        <TbLockPassword />
                        Mot de passe
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() =>
                          navigate("/home/PK-manager/get-public-key")
                        }
                        className="flex items-center gap-2"
                      >
                        <FaKey />
                        Clé Publique
                      </button>
                    </li>
                  </ul>
                </details>
              </li>

              <li>
                <button
                  onClick={logoutEvent}
                  className="flex items-center gap-2"
                >
                  <TbLogout2 />
                  Déconnexion
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
