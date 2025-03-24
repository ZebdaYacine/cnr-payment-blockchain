// components/NotificationDropdown.tsx
import { IoNotificationsSharp } from "react-icons/io5";
import NotificationComponent from "../../feature/notification/view/components/NotificationComponent";
import { useNotificationContext } from "../state/NotificationContext";
import { useTheme } from "../state/ThemeContext";

const NotificationDropdown = () => {
  const { GetNotificationsList } = useNotificationContext();
  const { isDarkMode } = useTheme();
  const notifications = GetNotificationsList() || [];

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
        <div className="indicator">
          <IoNotificationsSharp className="h-5 w-5" />
          <span className="badge badge-sm indicator-item">
            {notifications.length || "..."}
          </span>
        </div>
      </div>

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
        <div
          className={`sticky top-0 z-10 px-4 py-3 border-b w-full
            ${
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
              {notifications.length} notifications
            </span>
          </div>
        </div>

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
  );
};

export default NotificationDropdown;
