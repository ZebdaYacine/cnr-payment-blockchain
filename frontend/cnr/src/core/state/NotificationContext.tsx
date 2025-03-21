import { createContext, useState, ReactNode, useContext } from "react";
import { Notification } from "../dtos/data";

interface NotificationContextType {
  setNotification: (notification: Notification) => void;
  getNotification: () => Notification | null;
  setNotificationsList: (notifications: Notification[]) => void;
  getNotificationsList: () => Notification[];
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notification, setNotification] = useState<Notification | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const setNotificationsList = (notifications: Notification[]) => {
    setNotifications(notifications);
  };

  const getNotificationsList = () => notifications;

  const getNotification = () => notification;

  return (
    <NotificationContext.Provider
      value={{
        setNotification,
        getNotification,
        setNotificationsList,
        getNotificationsList,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};
