import { useMutation } from "@tanstack/react-query";
// import { useNotification } from "../../../services/useNotification";
import { FolderUseCase } from "../domain/usecase/FolderUseCase";
import { useFoldersMetaData } from "../../../core/state/FolderContext";
import { IsTokenExpired } from "../../../services/Http";
import { useNavigate } from "react-router";
import { FolderResponse } from "../data/dtos/FolderDtos";

export function useFolderViewModel(folderUseCase?: FolderUseCase) {
  // const { error } = useNotification();
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
        // setFoldersList(resp.data);
        if (resp.data.length > 0) {
          setFoldersList(resp.data);
        } else {
          console.log("🚨 No folders found, resetting state.");
          setFoldersList([]);
        }
      }
    },
    onError: (err: unknown) => {
      setFoldersList([]);
      console.error("Fetch error:", err);
      // error(
      //   "An error occurred while fetching folders. Please try again.",
      //   "colored"
      // );
    },
  });

  return {
    getFolders,
    isFolderLoading,
    isFolderSuccess,
    Folders,
  };
}
