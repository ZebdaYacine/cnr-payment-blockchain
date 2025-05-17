import { MdOutlineAccessTime } from "react-icons/md";
import { Notification } from "../../data/dtos/NotificationDtos";
import { useTheme } from "../../../../core/state/ThemeContext";
import { FaUserAlt } from "react-icons/fa";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { useNotificationViewModel } from "../../viewmodel/NotificationViewModel";
import { NotificationUseCase } from "../../domain/usecase/NotificationUseCase";
import { NotificationDataSourceImpl } from "../../data/dataSource/NotificationAPIDataSource";
import { NotificationRepositoryImpl } from "../../data/repository/NotificationRepositoryImpl";
import { useUser } from "../../../../core/state/UserContext";

interface NotificationProps {
  notification: Notification;
}

function NotificationComponent({ notification }: NotificationProps) {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const { userSaved } = useUser();

  const notificationUseCase = new NotificationUseCase(
    new NotificationRepositoryImpl(new NotificationDataSourceImpl())
  );

  const { updateNotification } = useNotificationViewModel(notificationUseCase);

  const formattedTime = new Date(notification.time).toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const handleNotificationClick = async (path: string) => {
    if (userSaved?.permission) {
      try {
        await updateNotification({
          notificationId: notification.id,
          permission: userSaved.permission.toLowerCase(),
        });
        // Refresh notifications list after successful update
        // getNotifications({ permission: userSaved.permission.toLowerCase() });
      } catch (error) {
        console.error("Error updating notification:", error);
      }
    }
    navigate(path);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      key={notification.id}
      className={`relative py-4 px-4 text-sm text-left transition-all duration-300 cursor-pointer 
        ${
          isDarkMode
            ? "hover:bg-slate-800 border-slate-700"
            : "hover:bg-slate-50 border-slate-200"
        }`}
      onClick={() => handleNotificationClick(notification.path)}
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 rounded-r opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

      <div className="flex flex-col space-y-2">
        <h5
          className={`text-md font-bold ${
            isDarkMode ? "text-blue-400" : "text-blue-600"
          }`}
        >
          {notification.title || "Notification Sans Titre"}
        </h5>

        <div className="flex items-center gap-2 text-xs">
          <FaUserAlt
            className={`w-4 h-4 ${
              isDarkMode ? "text-slate-400" : "text-slate-500"
            }`}
          />
          <em className={`${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
            Par {notification.Sender.username} — {notification.Sender.workAt} /{" "}
            {notification.Sender.wilaya}
          </em>
        </div>

        <p
          className={`text-sm leading-relaxed ${
            isDarkMode ? "text-slate-300" : "text-slate-700"
          }`}
        >
          {notification.message.length > 100
            ? notification.message.slice(0, 100) + "..."
            : notification.message}
        </p>

        <div className="flex items-center gap-2 text-xs">
          <MdOutlineAccessTime
            className={`w-4 h-4 ${
              isDarkMode ? "text-slate-400" : "text-slate-500"
            }`}
          />
          <em className={`${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
            {formattedTime}
          </em>
        </div>
      </div>

      <div
        className={`absolute inset-0 opacity-0 transition-opacity duration-300 
        ${isDarkMode ? "hover:bg-slate-800/50" : "hover:bg-slate-50/50"}`}
      />
    </motion.div>
  );
}

export default NotificationComponent;
