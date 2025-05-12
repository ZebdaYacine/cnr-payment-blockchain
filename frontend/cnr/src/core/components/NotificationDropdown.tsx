import { useEffect, useMemo, useRef, useCallback, useState } from "react";
import { IoNotificationsSharp } from "react-icons/io5";
import { useNotificationContext } from "../state/NotificationContext";
import { useTheme } from "../state/ThemeContext";
import { NotificationUseCase } from "../../feature/notification/domain/usecase/NotificationUseCase";
import { NotificationDataSourceImpl } from "../../feature/notification/data/dataSource/NotificationAPIDataSource";
import { NotificationRepositoryImpl } from "../../feature/notification/data/repository/NotificationRepositoryImpl";
import { useNotificationViewModel } from "../../feature/notification/viewmodel/NotificationViewModel";
import { useUser } from "../state/UserContext";
import NotificationComponent from "../../feature/notification/view/components/NotificationComponent";

const NotificationDropdown = () => {
  const { userSaved } = useUser();
  const { isDarkMode } = useTheme();
  const { GetNotificationsList } = useNotificationContext();
  const notifications = GetNotificationsList() || [];

  const [canPlaySound, setCanPlaySound] = useState(false);
  const prevNotificationCount = useRef(notifications.length);
  const audioRef = useRef<HTMLAudioElement>(null);

  const notificationUseCase = useMemo(() => {
    return new NotificationUseCase(
      new NotificationRepositoryImpl(new NotificationDataSourceImpl())
    );
  }, []);

  const { getNotifications, isNotificationsLoading, isNotificationError } =
    useNotificationViewModel(notificationUseCase);

  const fetchNotifications = useCallback(() => {
    if (!userSaved?.permission) return;
    getNotifications({ permission: userSaved.permission.toLowerCase() });
  }, [getNotifications, userSaved?.permission]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  useEffect(() => {
    const unlockSound = () => {
      setCanPlaySound(true);
      audioRef.current?.load();
      audioRef.current!.volume = 1;
      document.removeEventListener("click", unlockSound);
      document.removeEventListener("touchstart", unlockSound);
    };
    document.addEventListener("click", unlockSound);
    document.addEventListener("touchstart", unlockSound);
    return () => {
      document.removeEventListener("click", unlockSound);
      document.removeEventListener("touchstart", unlockSound);
    };
  }, []);

  useEffect(() => {
    const current = notifications.length;
    const prev = prevNotificationCount.current;

    if (current > prev && canPlaySound && audioRef.current) {
      const playPromise = audioRef.current.play();
      playPromise?.catch((err) =>
        console.warn("🔇 Audio playback failed:", err)
      );
    }

    prevNotificationCount.current = current;
  }, [notifications, canPlaySound]);

  return (
    <>
      <audio
        ref={audioRef}
        src="/sounds/snap-notification.mp3"
        preload="auto"
      />

      <div className="dropdown dropdown-end">
        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
          <div className="indicator">
            <IoNotificationsSharp
              className={`h-5 w-5 ${isDarkMode ? "" : "text-gray-200"}`}
            />
            <span className="badge badge-sm indicator-item">
              {isNotificationsLoading ? "..." : notifications.length}
            </span>
          </div>
        </div>

        <ul
          tabIndex={0}
          className={`dropdown-content shadow-2xl rounded-2xl w-72 sm:w-[400px] md:w-[450px] min-h-[200px] max-h-[70vh] overflow-y-auto overflow-x-hidden z-50 ${
            isDarkMode
              ? "bg-slate-800/95 border border-slate-700"
              : "bg-white/95 border border-gray-200"
          }`}
          style={{
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            height: notifications.length ? "auto" : "300px",
          }}
        >
          {/* Header */}
          <div
            className={`sticky top-0 z-10 px-4 py-3 border-b w-full ${
              isDarkMode
                ? "bg-slate-800/95 border-slate-700"
                : "bg-white/95 border-gray-200"
            }`}
          >
            <div className="flex justify-between items-center">
              <h3
                className={`text-lg font-bold ${
                  isDarkMode ? "text-white" : "text-gray-800"
                }`}
              >
                📌 Notifications
              </h3>
              <span
                className={`text-sm px-3 py-1.5 rounded-full ${
                  isDarkMode
                    ? "bg-blue-500/20 text-blue-300"
                    : "bg-blue-100 text-blue-600"
                }`}
              >
                {isNotificationsLoading
                  ? ""
                  : isNotificationError
                  ? "Erreur"
                  : `${notifications.length}`}
              </span>
            </div>
          </div>

          {/* List or Empty State */}
          {notifications.length ? (
            <div className="divide-y">
              {notifications.map((notif) => (
                <div key={notif.id} className="px-4 py-3">
                  <NotificationComponent notification={notif} />
                </div>
              ))}
            </div>
          ) : (
            <div
              className={`flex flex-col items-center justify-center h-[200px] w-full ${
                isDarkMode ? "bg-slate-800/95" : "bg-white/95"
              }`}
            >
              <div className="flex flex-col items-center space-y-3 px-4">
                <span className="text-5xl">🔔</span>
                <p
                  className={`text-lg font-semibold ${
                    isDarkMode ? "text-slate-300" : "text-gray-700"
                  }`}
                >
                  Aucune notification
                </p>
                <p
                  className={`text-sm text-center ${
                    isDarkMode ? "text-slate-400" : "text-gray-500"
                  }`}
                >
                  Vous n'avez pas de nouvelles notifications.
                </p>
              </div>
            </div>
          )}
        </ul>
      </div>
    </>
  );
};

export default NotificationDropdown;
