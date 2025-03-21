import { useMutation } from "@tanstack/react-query";
import { ErrorResponse } from "../../../services/model/commun";
import { useNotification } from "../../../services/useNotification";
import { FolderUseCase } from "../domain/usecase/FolderUseCase";
import { useFoldersMetaData } from "../../../core/state/FolderContext";
import { IsTokenExpired } from "../../../services/Http";
import { useNavigate } from "react-router";
import { NotificationResponse } from "../../../core/dtos/data";
import { FolderResponse } from "../data/dtos/FolderDtos";
import { useNotificationContext } from "../../../core/state/NotificationContext";

export function useFolderViewModel(folderUseCase?: FolderUseCase) {
  const { error } = useNotification();
  const { SetNotification } = useNotificationContext();
  const { setFoldersList } = useFoldersMetaData();
  const navigate = useNavigate();

  const {
    mutate: getFolders,
    data: Folders,
    isPending: isFolderLoading,
    isSuccess: isFolderSuccess,
  } = useMutation({
    mutationFn: async ({
      permission,
      receiverId,
      senderId,
    }: {
      permission: string;
      receiverId: string;
      senderId: string;
    }) => {
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
      return folderUseCase?.GetFolder(
        storedToken,
        permission,
        receiverId,
        senderId
      );
    },
    onSuccess: (data) => {
      console.log("Raw API Response:", data);
      if (data && "data" in data) {
        const resp = data as FolderResponse;
        if (resp.data.length > 0) {
          setFoldersList(resp.data);
        } else {
          console.log("🚨 No folders found, resetting state.");
          setFoldersList([]);
        }
      } else {
        const errorResponse = data as ErrorResponse;
        error(
          errorResponse.message || "Network error occurred during fetch",
          "colored"
        );
        console.log("🚨 No folders found, resetting state.");
        setFoldersList([]);
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
      time,
    }: {
      permission: string;
      receiverId: string[];
      senderId: string;
      message: string;
      time: Date;
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
      return folderUseCase?.AddNotification(
        storedToken,
        permission,
        receiverId,
        senderId,
        message,
        time
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
    getFolders,
    isFolderLoading,
    isFolderSuccess,
    Folders,

    addNotification,
    Notifications,
    isNotificationLoading,
    isNotificationSuccess,
    isNotificationError,
  };
}
