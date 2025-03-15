import { useMutation } from "@tanstack/react-query";
import { ErrorResponse } from "../../../services/model/commun";
import { useNotification } from "../../../services/useNotification";
import { FolderUseCase } from "../domain/usecase/FolderUseCase";
import { useFoldersMetaData } from '../../../core/state/FolderContext';
import { FolderResponse } from "../data/dtos/FolderDtos";



export function useFolderViewModel(profileUseCase: FolderUseCase) {
  
  const { error } = useNotification();
    const { setFoldersList } = useFoldersMetaData();



  const { mutate: getFolders, data: Folders, isPending: isFolderLoading, isSuccess: isFolderSuccess} = useMutation({
    mutationFn: async ({organisation:organisation,destination:destination}: { organisation: string,destination: string}) => {
      console.log("Folders")
      const storedToken = localStorage.getItem("authToken");
      if (!storedToken) {
        throw new Error("Authentication token not found");
      }
      return profileUseCase.GetFolder(storedToken,organisation,destination);
    },
    onSuccess: (data) => {
      console.log("Raw API Response:", data);
      if (data && "data" in data ) {
        const resp = data as FolderResponse;
        if(resp.data.length>0){
        setFoldersList(resp.data);
        }else{
          console.log("🚨 No folders found, resetting state.");
          setFoldersList([])
        }
      } else {
         const errorResponse = data as ErrorResponse;
         error(errorResponse.message || "Network error occurred during upload", "colored");
         console.log("🚨 No folders found, resetting state.");
         setFoldersList([])
        //  Userlogout();
        // if (!isAuthentificated) navigate("/");
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
