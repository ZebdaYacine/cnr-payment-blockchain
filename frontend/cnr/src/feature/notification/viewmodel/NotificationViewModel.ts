import { useMutation } from "@tanstack/react-query";
import { ErrorResponse } from "../../../services/model/commun";
import { useNotification } from "../../../services/useNotification";
import { NotificationUseCase } from "../domain/usecase/NotificationUseCase";
import { IsTokenExpired } from "../../../services/Http";
import { useNavigate } from "react-router";
import { useNotificationContext } from "../../../core/state/NotificationContext";
import { NotificationResponse } from "../data/dtos/NotificationDtos";

export function useNotificationViewModel(
  notificationUseCase?: NotificationUseCase
) {
  const { error } = useNotification();
  const { SetNotification, SetNotificationsList } = useNotificationContext();
  const navigate = useNavigate();

  const {
    mutate: getNotifications,
    isPending: isNotificationsLoading,
    isSuccess: isNotificationsSuccess,
    isError: isNotificationsError,
  } = useMutation({
    mutationFn: async ({ permission }: { permission: string }) => {
      console.log("Fetching Folders with permission:", permission);
      const storedToken = localStorage.getItem("authToken");
      if (!storedToken) {
        navigate("/");
        throw new Error("Authentication token not found");
      }
      if (IsTokenExpired(storedToken)) {
        localStorage.removeItem("authToken");
        navigate("/");
        throw new Error("Session expired. Please log in again.");
      }
      return notificationUseCase?.GetNotifications(storedToken, permission);
    },
    onSuccess: (data) => {
      console.log("Raw API Response:", data);
      if (data && "data" in data) {
        const resp = data as NotificationResponse;
        if (resp?.data?.length > 0) {
          SetNotificationsList(resp.data);
        } else {
          console.log("🚨 No folders found, resetting state.");
          SetNotificationsList([]);
        }
      }
    },
    onError: (err: unknown) => {
      console.error("Fetch error:", err);
      error(
        "An error occurred while fetching folders. Please try again.",
        "colored"
      );
    },
  });

  const {
    mutate: addNotification,
    data: Notifications,
    isPending: isNotificationLoading,
    isSuccess: isNotificationSuccess,
    isError: isNotificationError,
  } = useMutation({
    mutationFn: async ({
      permission,
      receiverId,
      senderId,
      message,
      title,
      time,
      path,
    }: {
      permission: string;
      receiverId: string[];
      senderId: string;
      message: string;
      title: string;
      time: Date;
      path: string;
    }) => {
      console.log("Adding Notification to ", receiverId);
      const storedToken = localStorage.getItem("authToken");
      if (!storedToken) {
        navigate("/");
        throw new Error("Authentication token not found");
      }
      if (IsTokenExpired(storedToken)) {
        localStorage.removeItem("authToken");
        navigate("/");
        throw new Error("Session expired. Please log in again.");
      }
      return notificationUseCase?.AddNotification(
        storedToken,
        permission,
        receiverId,
        senderId,
        message,
        title,
        time,
        path
      );
    },
    onSuccess: (data) => {
      console.log("Raw API Response:", data);
      if (data && "data" in data) {
        const resp = data as NotificationResponse;
        if (resp.data.length > 0) {
          SetNotification(resp.data[0]);
        }
      } else {
        const errorResponse = data as ErrorResponse;
        error(
          errorResponse.message || "Network error occurred during fetch",
          "colored"
        );
        console.log("🚨 No folders found, resetting state.");
        SetNotification(null);
      }
    },
    onError: (err: unknown) => {
      console.error("Fetch error:", err);
      error(
        "An error occurred while fetching folders. Please try again.",
        "colored"
      );
    },
  });

  return {
    getNotifications,
    isNotificationsLoading,
    isNotificationsSuccess,
    isNotificationsError,

    addNotification,
    Notifications,
    isNotificationLoading,
    isNotificationSuccess,
    isNotificationError,
  };
}
