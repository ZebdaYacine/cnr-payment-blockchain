import { MdOutlineAccessTime } from "react-icons/md";
import { Notification } from "../../data/dtos/NotificationDtos";
import { useTheme } from "../../../../core/state/ThemeContext";

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

  return (
    <div
      className={`border-b py-2 text-sm text-left transition-colors duration-300 `}
    >
      <h5
        className={`text-md font-semibold ${
          isDarkMode ? "text-blue-300" : "text-blue-700"
        }`}
      >
        {notification.title || "📌 Notification Sans Titre"}
      </h5>
      <p className="mt-1">
        {notification.message.length > 100
          ? notification.message.slice(0, 100) + "..."
          : notification.message}
      </p>
      <div className={`flex items-center gap-1 text-xs mt-2 `}>
        <MdOutlineAccessTime className="w-4 h-4" />
        <em>{formattedTime}</em>
      </div>
    </div>
  );
}

export default NotificationComponent;
