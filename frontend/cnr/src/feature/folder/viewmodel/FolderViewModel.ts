import { useMutation } from "@tanstack/react-query";
import { ErrorResponse } from "../../../services/model/commun";
import { useNotification } from "../../../services/useNotification";
import { FolderUseCase } from "../domain/usecase/FolderUseCase";
import { useFoldersMetaData } from "../../../core/state/FolderContext";
import { FolderResponse } from "../data/dtos/FolderDtos";

export function useFolderViewModel(profileUseCase: FolderUseCase) {
  const { error } = useNotification();
  const { setFoldersList } = useFoldersMetaData();

  const {
    mutate: getFolders,
    data: Folders,
    isPending: isFolderLoading,
    isSuccess: isFolderSuccess,
  } = useMutation({
    mutationFn: async ({
      permission,
      organisation,
      destination,
    }: {
      permission: string;
      organisation: string;
      destination: string;
    }) => {
      console.log("Fetching Folders with permission:", permission);
      const storedToken = localStorage.getItem("authToken");
      if (!storedToken) {
        throw new Error("Authentication token not found");
      }
      return profileUseCase.GetFolder(storedToken, permission, organisation, destination);
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
        error(errorResponse.message || "Network error occurred during fetch", "colored");
        console.log("🚨 No folders found, resetting state.");
        setFoldersList([]);
      }
    },
    onError: (err: unknown) => {
      console.error("Fetch error:", err);
      error("An error occurred while fetching folders. Please try again.", "colored");
    },
  });

  return {
    getFolders,
    isFolderLoading,
    isFolderSuccess,
    Folders,
  };
}
