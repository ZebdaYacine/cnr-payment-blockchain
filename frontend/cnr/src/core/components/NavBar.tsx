import { useEffect, useRef, useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { IoNotificationsSharp } from "react-icons/io5";
import { MdOutlineDarkMode } from "react-icons/md";
import { useTheme } from "../state/ThemeContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext";
import { useLogger } from "../../services/useLogger";
import { NotificationUseCase } from "../../feature/notification/domain/usecase/NotificationUseCase";
import { NotificationDataSourceImpl } from "../../feature/notification/data/dataSource/NotificationAPIDataSource";
import { NotificationRepositoryImpl } from "../../feature/notification/data/repository/NotificationRepositoryImpl";
import { useNotificationViewModel } from "../../feature/notification/viewmodel/NotificationViewModel";
import { useNotificationContext } from "../state/NotificationContext";
import { useUserId } from "../state/UserContext";
import NotificationComponent from "../../feature/notification/view/components/NotificationComponent";

interface NavBarProps {
  user: {
    username?: string;
    email?: string;
    permission?: string;
    workAt?: string;
    idInstituion?: string;
    type?: string;
  };
}

function NavBarComponent({ user }: NavBarProps) {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const { isAuthentificated, Userlogout } = useAuth();
  const { debug } = useLogger();
  const profileDialogRef = useRef<HTMLDialogElement>(null);

  const notificationUseCase = new NotificationUseCase(
    new NotificationRepositoryImpl(new NotificationDataSourceImpl())
  );

  const { permission } = useUserId();
  const userPermission = permission || localStorage.getItem("permission");
  const [canPlaySound, setCanPlaySound] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const { GetNotificationsList, SetNotificationsList } =
    useNotificationContext();
  const {
    getNotifications,
    isNotificationsLoading,
    isNotificationsSuccess,
    isNotificationError,
  } = useNotificationViewModel(notificationUseCase);

  // Initialize audio context on first user interaction
  useEffect(() => {
    const handleFirstInteraction = () => {
      setCanPlaySound(true);
      // Create and initialize audio context
      if (audioRef.current) {
        audioRef.current.load();
        audioRef.current.volume = 0.5; // Set volume to 50%
      }
      document.removeEventListener("click", handleFirstInteraction);
      document.removeEventListener("touchstart", handleFirstInteraction);
    };

    document.addEventListener("click", handleFirstInteraction);
    document.addEventListener("touchstart", handleFirstInteraction);

    return () => {
      document.removeEventListener("click", handleFirstInteraction);
      document.removeEventListener("touchstart", handleFirstInteraction);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(
      () =>
        getNotifications({
          permission: userPermission?.toLocaleLowerCase() || "",
        }),
      10000
    );
    return () => clearInterval(interval);
  }, [getNotifications]);

  const prevNotificationCount = useRef<number>(0);

  useEffect(() => {
    if (isNotificationsLoading) {
      console.log("getting notification...");
      SetNotificationsList([]);
    } else if (isNotificationsSuccess) {
      const currentNotifications = GetNotificationsList() || [];
      const nbr = currentNotifications.length;

      if (nbr > prevNotificationCount.current) {
        console.log("New notification received!");
        if (canPlaySound && audioRef.current) {
          // Reset audio to start
          audioRef.current.currentTime = 0;
          // Play the sound
          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
            playPromise.catch((error) => {
              console.warn("Audio playback failed:", error);
            });
          }
        } else {
          console.log("🔇 Sound disabled - waiting for user interaction");
        }
      }

      prevNotificationCount.current = nbr;
      SetNotificationsList(currentNotifications);
    } else if (isNotificationError) {
      console.log("Error fetching notifications");
      SetNotificationsList([]);
    }
  }, [isNotificationsLoading, isNotificationsSuccess, canPlaySound]);

  const logoutEvent = () => {
    Userlogout();
    debug("USER IS AUTHENTIFICATED : " + isAuthentificated);
    if (!isAuthentificated) navigate("/");
  };

  const goToHomePage = () => {
    navigate("/home");
  };

  return (
    <>
      <audio
        ref={audioRef}
        src="/sounds/snap-notification.mp3"
        preload="auto"
        loop={false}
      />
      <div
        className={
          isDarkMode
            ? "navbar bg-slate-950 text-white"
            : "navbar bg-blue-600 text-black"
        }
      >
        <div className="flex-1">
          <a
            className="btn btn-ghost text-xl text-cyan-50"
            onClick={() => {
              goToHomePage();
            }}
          >
            {user.username} - {user.workAt} / {user.type}
          </a>
        </div>
        <div className="flex-none">
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle"
            >
              <div className="indicator">
                <FaShoppingCart className="h-5 w-5" />
                <span className="badge badge-sm indicator-item">8</span>
              </div>
            </div>
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle"
              >
                <div className="indicator">
                  <IoNotificationsSharp className="h-5 w-5" />
                  <span className="badge badge-sm indicator-item">
                    {GetNotificationsList()?.length || 0}
                  </span>
                </div>
              </div>
              <ul
                tabIndex={0}
                className={`dropdown-content menu p-0 shadow-xl rounded-lg 
                  w-[280px] sm:w-[400px] md:w-[400px]
                  overflow-y-auto
                  left-1/4 sm:left-auto
                  -translate-x-1/2 sm:translate-x-0
                  mt-0 sm:mt-2
                  z-50
                  ${
                    isDarkMode
                      ? "bg-slate-800 border border-slate-700"
                      : "bg-white border border-gray-100 shadow-lg"
                  }`}
                style={{
                  backdropFilter: "none",
                  WebkitBackdropFilter: "none",
                }}
              >
                <div
                  className={`sticky top-0 z-10 p-3 sm:p-4 border-b
                  ${
                    isDarkMode
                      ? "bg-slate-800 border-slate-700"
                      : "bg-white border-gray-200"
                  }`}
                  style={{
                    backdropFilter: "none",
                    WebkitBackdropFilter: "none",
                  }}
                >
                  <div className="flex justify-between items-center">
                    <h3
                      className={`text-base sm:text-lg font-bold ${
                        isDarkMode ? "text-white" : "text-gray-800"
                      }`}
                    >
                      📌 Liste des Notifications
                    </h3>
                    <span
                      className={`text-xs sm:text-sm font-medium px-2 py-1 rounded-full
                        ${
                          isDarkMode
                            ? "bg-slate-700 text-slate-300"
                            : "bg-blue-100 text-blue-600"
                        }`}
                    >
                      {GetNotificationsList()?.length || 0} notifications
                    </span>
                  </div>
                </div>

                <div
                  className={`divide-y ${
                    isDarkMode ? "divide-slate-700" : "divide-gray-100"
                  }`}
                >
                  {GetNotificationsList()?.length ? (
                    GetNotificationsList()?.map((notif) => (
                      <NotificationComponent
                        key={notif.id}
                        notification={notif}
                      />
                    ))
                  ) : (
                    <div
                      className={`flex flex-col items-center justify-center py-8 sm:py-12 px-4
                      ${isDarkMode ? "bg-slate-800" : "bg-white"}`}
                      style={{
                        backdropFilter: "none",
                        WebkitBackdropFilter: "none",
                      }}
                    >
                      <p
                        className={`text-base sm:text-lg font-semibold ${
                          isDarkMode ? "text-slate-300" : "text-gray-700"
                        }`}
                      >
                        🚫 Aucune notification
                      </p>
                      <p
                        className={`text-xs sm:text-sm mt-2 text-center ${
                          isDarkMode ? "text-slate-400" : "text-gray-500"
                        }`}
                      >
                        Vous n'avez pas de nouvelles notifications
                      </p>
                    </div>
                  )}
                </div>
              </ul>
            </div>
          </div>
          <div
            role="button"
            className="btn btn-ghost btn-circle"
            onClick={toggleDarkMode}
          >
            <div className="indicator">
              <MdOutlineDarkMode className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Profile Dropdown */}
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              <img
                alt="User Profile"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li onClick={() => profileDialogRef.current?.showModal()}>
              <a className="justify-between">
                Profile
                <span className="badge">New</span>
              </a>
            </li>
            <li>
              <a>Settings</a>
            </li>
            <li>
              <a onClick={logoutEvent}>Logout</a>
            </li>
          </ul>
        </div>
      </div>

      {/* Profile Modal */}
      <dialog ref={profileDialogRef} id="Profile" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">User Profile</h3>
          <div className="py-4">
            <div className="flex items-center space-x-3">
              <img
                className="w-16 h-16 rounded-full border"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                alt="Profile"
              />
              <div>
                <p className="text-lg font-semibold">
                  {user.username || "Unknown User"}
                </p>
                <p className="text-sm text-gray-500">
                  {user.email || "No email provided"}
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <p>
                <span className="font-semibold">Permission:</span>{" "}
                {user.permission || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Work At:</span>{" "}
                {user.workAt || "Not Assigned"}
              </p>
              <p>
                <span className="font-semibold">Institution ID:</span>{" "}
                {user.idInstituion || "None"}
              </p>
            </div>
          </div>

          <div className="modal-action">
            <button
              className="btn"
              onClick={() => profileDialogRef.current?.close()}
            >
              Close
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}

export default NavBarComponent;

//  <div className="absolute right-0 mt-2 w-64 rounded-md bg-base-100 shadow-lg z-50">
//    <div className="p-2 max-h-80 overflow-y-auto ">
//      <div className="flex justify-between">
//        <h3 className="font-bold text-lg">List de notifications:</h3>
//        <BsXLg className="cursor-pointer" onClick={close} />
//      </div>
//      {GetNotificationsList()?.length ? (
//        GetNotificationsList()?.map((notif) => (
//          <NotificationComponent notification={notif} />
//        ))
//      ) : (
//        <p className="text-center text-sm text-gray-500 py-4">
//          No notifications
//        </p>
//      )}
//    </div>
//  </div>;
