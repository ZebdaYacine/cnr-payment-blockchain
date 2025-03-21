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

  const { GetNotificationsList, SetNotificationsList } =
    useNotificationContext();
  const {
    getNotifications,
    isNotificationsLoading,
    isNotificationsSuccess,
    isNotificationError,
  } = useNotificationViewModel(notificationUseCase);

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
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const handleFirstClick = () => {
      setCanPlaySound(true);
      document.removeEventListener("click", handleFirstClick);
    };

    document.addEventListener("click", handleFirstClick);

    return () => {
      document.removeEventListener("click", handleFirstClick);
    };
  }, []);

  useEffect(() => {
    if (isNotificationsLoading) {
      console.log("getting notification...");
      SetNotificationsList([]);
    } else if (isNotificationsSuccess) {
      const nbr = GetNotificationsList()?.length || 0;

      if (nbr > prevNotificationCount.current) {
        if (canPlaySound && audioRef.current) {
          audioRef.current.play().catch((err) => {
            console.warn("Audio play failed", err);
          });
        } else {
          console.log("🔇 Can't play sound yet – user hasn't interacted");
        }
      }

      prevNotificationCount.current = nbr;
      SetNotificationsList(GetNotificationsList());
    } else if (isNotificationError) {
      console.log("Error..");
      SetNotificationsList([]);
    }
  }, [isNotificationsLoading, isNotificationsSuccess, canPlaySound]);

  const logoutEvent = () => {
    Userlogout();
    debug("USER IS AUTHENTIFICATED : " + isAuthentificated);
    if (!isAuthentificated) navigate("/");
  };

  return (
    <>
      <audio
        ref={audioRef}
        src="/sounds/snap-notification.mp3"
        preload="auto"
      />
      <div
        className={
          isDarkMode
            ? "navbar bg-slate-950 text-white"
            : "navbar bg-blue-600 text-black"
        }
      >
        <div className="flex-1">
          <a className="btn btn-ghost text-xl text-cyan-50">
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
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle"
            >
              <div className="indicator">
                <IoNotificationsSharp className="h-5 w-5 " />
                <span className="badge badge-sm indicator-item">
                  {GetNotificationsList()?.length === 0
                    ? 0
                    : GetNotificationsList()?.length}
                </span>
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
