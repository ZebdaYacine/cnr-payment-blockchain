import { MdOutlineAccessTime } from "react-icons/md";
import { Notification } from "../../data/dtos/NotificationDtos";
import { useTheme } from "../../../../core/state/ThemeContext";
import { FaUserAlt } from "react-icons/fa";
import { useNavigate } from "react-router";

interface NotificationProps {
  notification: Notification;
}

function NotificationComponent({ notification }: NotificationProps) {
  const { isDarkMode } = useTheme();

  const formattedTime = new Date(notification.time).toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const navigate = useNavigate();

  const handleNotificationClick = (path: string) => {
    navigate(path);
  };

  return (
    <div
      key={notification.id}
      className="border-b  py-3 text-sm text-left transition-colors duration-300 cursor-pointer hover:bg-slate-100"
      onClick={() => handleNotificationClick(notification.path)}
    >
      <h5
        className={`text-md font-bold mb-1 ${
          isDarkMode ? "text-blue-300" : "text-blue-700"
        }`}
      >
        {notification.title || "Notification Sans Titre"}
      </h5>
      <div className="flex items-center gap-2 text-xs mt-1 justify-items-center text-gray-500">
        <FaUserAlt className="w-4 h-4" />
        <em>
          Par {notification.Sender.username} — {notification.Sender.workAt} /{" "}
          {notification.Sender.wilaya}
        </em>
      </div>
      <p className="text-gray-800 dark:text-gray-300">
        {notification.message.length > 100
          ? notification.message.slice(0, 100) + "..."
          : notification.message}
      </p>
      <div className="flex items-center gap-2 text-xs mt-2 text-gray-500">
        <MdOutlineAccessTime className="w-4 h-4" />
        <em>{formattedTime}</em>
      </div>
    </div>
  );
}

export default NotificationComponent;
