import { useMutation } from "@tanstack/react-query";
import { ErrorResponse } from "../../../services/model/commun";
import { useNotification } from "../../../services/useNotification";
import { PofileUseCase } from "../domain/usecase/ProfileUseCase";
import { FilesResponse } from "../data/dtos/ProfileDtos";

// Helper function to convert file to Base64
function convertFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

export function useUploadViewModel(profileUseCase: PofileUseCase) {
  const { error } = useNotification();

  const { mutate:uploadFile, data: metadata, isPending: isPending, isSuccess, isError } = useMutation({
    mutationFn: async ({ file,parent,version }: { file: File,parent:string,version:number }) => {
      const base64File = await convertFileToBase64(file);
      const filename = file.name;
      const action="upload"
      const storedToken = localStorage.getItem("authToken");
      if (!storedToken) {
        throw new Error("Authentication token not found");
      }
      return profileUseCase.UploadFile(filename, base64File, storedToken,action,parent,version);
    },
    onSuccess: (data) => {
      if (data && "data" in data) {
        const resp = data as FilesResponse;
        console.log("File uploaded successfully:", resp.data.at(-1)?.ID);
        console.log("File URL:", resp.data.at(-1)?.HashFile);
      } else {
        const errorResponse = data as ErrorResponse;
        error(errorResponse.message || "Network error occurred during upload", "colored");
      }
    },
    onError: (err: unknown) => {
      console.error("Upload error:", err);
      error("An error occurred during the upload. Please try again.", "colored");
    },
  });

  return {
    upload: uploadFile,
    metadata,
    isPending,
    isSuccess,
    isError,
  };
}
