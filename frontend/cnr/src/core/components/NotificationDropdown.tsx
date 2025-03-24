import { useEffect, useMemo, useRef, useState } from "react";
import { IoNotificationsSharp } from "react-icons/io5";
import NotificationComponent from "../../feature/notification/view/components/NotificationComponent";
import { useNotificationContext } from "../state/NotificationContext";
import { useTheme } from "../state/ThemeContext";
import { NotificationUseCase } from "../../feature/notification/domain/usecase/NotificationUseCase";
import { NotificationDataSourceImpl } from "../../feature/notification/data/dataSource/NotificationAPIDataSource";
import { NotificationRepositoryImpl } from "../../feature/notification/data/repository/NotificationRepositoryImpl";
import { useNotificationViewModel } from "../../feature/notification/viewmodel/NotificationViewModel";
import { useUser } from "../state/UserContext";

const NotificationDropdown = () => {
  const { userSaved } = useUser();
  const { isDarkMode } = useTheme();
  const { GetNotificationsList } = useNotificationContext();
  const notifications = GetNotificationsList() || [];

  const [canPlaySound, setCanPlaySound] = useState(false);
  const prevNotificationCount = useRef<number>(notifications.length);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Prepare Notification UseCase (only once)
  const notificationUseCase = useMemo(() => {
    return new NotificationUseCase(
      new NotificationRepositoryImpl(new NotificationDataSourceImpl())
    );
  }, []);

  const { getNotifications, isNotificationsLoading, isNotificationError } =
    useNotificationViewModel(notificationUseCase);

  // Fetch notifications initially and every 10 seconds
  useEffect(() => {
    if (!userSaved?.permission) return;
    const permission = userSaved.permission.toLowerCase();

    getNotifications({ permission }); // Initial fetch

    const interval = setInterval(() => {
      getNotifications({ permission });
    }, 10 * 1000);

    return () => clearInterval(interval);
  }, [getNotifications, userSaved?.permission]);

  // Detect first user interaction to unlock audio (browser policy)
  useEffect(() => {
    const handleFirstInteraction = () => {
      setCanPlaySound(true);
      if (audioRef.current) {
        audioRef.current.load(); // preload sound
        audioRef.current.volume = 2.5;
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

  // Play sound if new notifications arrive
  useEffect(() => {
    const currentCount = notifications.length;

    if (currentCount > prevNotificationCount.current) {
      console.log("🔔 New notification received!");

      if (canPlaySound && audioRef.current) {
        audioRef.current.currentTime = 0;
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.warn("Audio playback failed:", err);
          });
        }
      }
    }

    prevNotificationCount.current = currentCount;
  }, [notifications, canPlaySound]);

  return (
    <>
      {/* 🔊 Hidden audio element */}
      <audio
        ref={audioRef}
        src="/sounds/snap-notification.mp3"
        preload="auto"
        loop={false}
      />

      {/* 🔽 Notification Dropdown */}
      <div className="dropdown dropdown-end">
        {/* 🔘 Notification Bell */}
        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
          <div className="indicator">
            <IoNotificationsSharp className="h-5 w-5" />
            <span className="badge badge-sm indicator-item">
              {isNotificationsLoading ? "..." : notifications.length}
            </span>
          </div>
        </div>

        {/* 📋 Dropdown Content */}
        <ul
          tabIndex={0}
          className={`dropdown-content shadow-2xl rounded-2xl 
            w-72 sm:w-[400px] md:w-[450px] min-h-[200px] 
            max-h-[calc(100vh-60px)] sm:max-h-[70vh]
            overflow-y-auto overflow-x-hidden z-50
            ${
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
          {/* 🧾 Header */}
          <div
            className={`sticky top-0 z-10 px-4 py-3 border-b w-full ${
              isDarkMode
                ? "bg-slate-800/95 border-slate-700"
                : "bg-white/95 border-gray-200"
            }`}
          >
            <div className="flex justify-between items-center">
              <h3
                className={`text-base sm:text-lg font-bold flex items-center gap-2 ${
                  isDarkMode ? "text-white" : "text-gray-800"
                }`}
              >
                📌 Liste des Notifications
              </h3>
              <span
                className={`text-sm px-3 py-1.5 rounded-full ${
                  isDarkMode
                    ? "bg-blue-500/20 text-blue-300"
                    : "bg-blue-100 text-blue-600"
                }`}
              >
                {isNotificationsLoading
                  ? "..."
                  : isNotificationError
                  ? "Erreur"
                  : `${notifications.length}`}{" "}
                notifications
              </span>
            </div>
          </div>

          {/* 📬 Notification List or Empty State */}
          <div className="w-full">
            {notifications.length ? (
              <div className="divide-y w-full">
                {notifications.map((notif) => (
                  <div key={notif.id} className="w-full px-4 py-3">
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
                <div className="flex flex-col items-center space-y-4 px-4">
                  <span className="text-5xl sm:text-4xl mb-2">🔔</span>
                  <p
                    className={`text-xl sm:text-lg font-semibold ${
                      isDarkMode ? "text-slate-300" : "text-gray-700"
                    }`}
                  >
                    Aucune notification
                  </p>
                  <p
                    className={`text-base sm:text-sm text-center ${
                      isDarkMode ? "text-slate-400" : "text-gray-500"
                    }`}
                  >
                    Vous n'avez pas de nouvelles notifications
                  </p>
                </div>
              </div>
            )}
          </div>
        </ul>
      </div>
    </>
  );
};

export default NotificationDropdown;
