import { useMutation } from "@tanstack/react-query";
import { ErrorResponse } from "../../../services/model/commun";
import { useNotification } from "../../../services/useNotification";
import { FolderUseCase } from "../domain/usecase/FolderUseCase";
import { useNavigate } from "react-router";
import { useAuth } from "../../../core/state/AuthContext";
import { useFoldersMetaData } from '../../../core/state/FolderContext';
import { FolderResponse } from "../data/dtos/FolderDtos";



export function useFolderViewModel(profileUseCase: FolderUseCase) {
  
  const { isAuthentificated, Userlogout } = useAuth();
  const navigate = useNavigate();
  const { error } = useNotification();
    const { setFoldersList } = useFoldersMetaData();



  const { mutate: getFolders, data: Folders, isPending: isFolderLoading, isSuccess: isFolderSuccess} = useMutation({
    mutationFn: async () => {
      console.log("Folders")
      const storedToken = localStorage.getItem("authToken");
      if (!storedToken) {
        throw new Error("Authentication token not found");
      }
      return profileUseCase.GetFolder(storedToken);
    },
    onSuccess: (data) => {
      console.log("Raw API Response:", data);
      if (data && "data" in data ) {
        const resp = data as FolderResponse;
        setFoldersList(resp.data);
      } else {
         const errorResponse = data as ErrorResponse;
         error(errorResponse.message || "Network error occurred during upload", "colored");
         Userlogout();
        if (!isAuthentificated) navigate("/");
      }
    },
    onError: (err: unknown) => {
      console.error("Upload error:", err);
      error("An error occurred during the upload. Please try again.", "colored");
    },
  });
  
  return {
    getFolders,
    isFolderLoading,
    isFolderSuccess,
    Folders,
  };
}
