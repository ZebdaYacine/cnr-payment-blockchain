import { FileResponse } from '../data/dtos/FileDtos';
import { useMutation } from "@tanstack/react-query";
import { ErrorResponse } from "../../../services/model/commun";
import { useNotification } from "../../../services/useNotification";
import { FileUseCase } from "../domain/usecase/FileUseCase";
import { FilesResponse } from "../data/dtos/FileDtos";
import { useFileMetaData } from "../../../core/state/FileContext";


function convertFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

export function useFileViewModel(fileUseCase: FileUseCase) {
  const { error } = useNotification();
  const { setFilesList } = useFileMetaData();

  const uploadFileAsync = (
    permission: string,
    file: File,
    parent: string,
    folder: string,
    description: string,
    version: number
  ): Promise<FileResponse> => {
    return new Promise((resolve, reject) => {
      uploadFile(
        { permission, file, parent, folder, description, version },
        {
          onSuccess: (data) => resolve(data as FileResponse),
          onError: (err) => reject(err),
        }
      );
    });
  };

  const { mutate: uploadFile, data: uploadMetadata, isPending: isUploading, isSuccess: uploadSuccess, isError: uploadError } = useMutation({
    mutationFn: async ({ permission, file, parent, folder, description, version }: { permission: string; file: File; parent: string; folder: string; description: string; version: number }) => {
      const base64File = await convertFileToBase64(file);
      const filename = file.name;
      const action = "upload";
      const storedToken = localStorage.getItem("authToken");
      if (!storedToken) {
        throw new Error("Authentication token not found");
      }
      return fileUseCase.UploadFile(permission, filename, base64File, storedToken, action, parent, folder, description, version);
    },
    onSuccess: (data) => {
      if (data && "data" in data) {
        const resp = data as FileResponse;
        console.log("File uploaded successfully:", resp.data?.ID);
        console.log("File URL:", resp.data?.HashFile);
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

  const { mutate: getFiles, data: filesMetadata, isPending: isFetchingFiles, isSuccess: isFetchSuccess } = useMutation({
    mutationFn: async ({ permission, folder }: { permission: string; folder: string }) => {
      const storedToken = localStorage.getItem("authToken");
      if (!storedToken) {
        throw new Error("Authentication token not found");
      }
      return fileUseCase.GetFiles(permission, storedToken, folder);
    },
    onSuccess: (data) => {
      if (data && "data" in data) {
        const resp = data as FilesResponse;
        setFilesList(resp.data);
      } else {
        const errorResponse = data as ErrorResponse;
        setFilesList([]);
        error(errorResponse.message || "Network error occurred while fetching files", "colored");
      }
    },
    onError: (err: unknown) => {
      console.error("Fetch error:", err);
      error("An error occurred while retrieving files. Please try again.", "colored");
    },
  });

  return {
    uploadFile,
    uploadMetadata,
    isUploading,
    uploadSuccess,
    uploadError,

    getFiles,
    filesMetadata,
    isFetchingFiles,
    isFetchSuccess,

    uploadFileAsync
  };
}
