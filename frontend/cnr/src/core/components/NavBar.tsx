import { useEffect, useRef, useState } from "react";
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
import NotificationDropdown from "./NotificationDropdown";

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
            ? "flex navbar bg-slate-950 text-white"
            : "flex navbar bg-blue-600 text-black"
        }
      >
        <div className="flex-1">
          <a
            className="btn btn-ghost text-lg sm:text-xl md:text-xl text-cyan-50"
            onClick={() => {
              goToHomePage();
            }}
          >
            {user.username} - {user.workAt} / {user.type}
          </a>
        </div>

        <div className="flex-none">
          <NotificationDropdown />
          <div
            role="button"
            className="btn btn-ghost btn-circle"
            onClick={toggleDarkMode}
          >
            <div className="indicator">
              <MdOutlineDarkMode className="h-5 w-5" />
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
