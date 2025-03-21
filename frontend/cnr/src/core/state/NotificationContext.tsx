import { createContext, useState, ReactNode, useContext } from "react";
import { Notification } from "../dtos/data";

interface NotificationContextType {
  SetNotification: (notification: Notification | null) => void;
  GetNotification: () => Notification | null;
  SetNotificationsList: (notifications: Notification[] | null) => void;
  GetNotificationsList: () => Notification[] | null;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notificationState, setNotificationState] =
    useState<Notification | null>(null);
  const [notifications, setNotifications] = useState<Notification[] | null>([]);

  const setNotificationsList = (notifications: Notification[] | null) => {
    setNotifications(notifications || []);
  };

  const setNotification = (notification: Notification | null) => {
    setNotificationState(notification);
  };

  const getNotificationsList = () => notifications;

  const getNotification = () => notificationState;

  return (
    <NotificationContext.Provider
      value={{
        SetNotification: setNotification,
        GetNotification: getNotification,
        SetNotificationsList: setNotificationsList,
        GetNotificationsList: getNotificationsList,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};
