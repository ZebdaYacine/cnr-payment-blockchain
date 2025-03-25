import { Data, FileResponse } from "../data/dtos/FileDtos";
import { useMutation } from "@tanstack/react-query";
import { ErrorResponse } from "../../../services/model/commun";
import { useNotification } from "../../../services/useNotification";
import { FileUseCase } from "../domain/usecase/FileUseCase";
import { FilesResponse } from "../data/dtos/FileDtos";
import { useFileMetaData } from "../../../core/state/FileContext";
import { GetAuthToken } from "../../../services/Http";
import { useNavigate } from "react-router";

function convertFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

export function useFileViewModel(fileUseCase: FileUseCase) {
  const { error, success } = useNotification();
  const { setFilesList } = useFileMetaData();
  const navigate = useNavigate();

  const {
    mutate: uploadFile,
    data: uploadMetadata,
    isPending: isUploading,
    isSuccess: uploadSuccess,
    isError: uploadError,
  } = useMutation({
    mutationFn: async ({
      file,
      parent,
      folder,
      description,
      organisation,
      destination,
      version,
      permission,
      reciverId,
      tagged_users,
      phase,
    }: {
      file: File;
      parent: string;
      folder: string;
      description: string;
      organisation: string;
      destination: string;
      version: number;
      permission: string;
      reciverId: string;
      tagged_users: string[];
      phase: string;
    }) => {
      const base64File = await convertFileToBase64(file);
      const filename = file.name;
      const action = "upload";
      const storedToken = GetAuthToken(navigate);
      return fileUseCase.UploadFile(
        filename,
        base64File,
        storedToken,
        action,
        parent,
        folder,
        description,
        organisation,
        destination,
        version,
        permission,
        reciverId,
        tagged_users,
        phase
      );
    },
    onSuccess: (data) => {
      if (data && "data" in data) {
        const resp = data as FileResponse;
        console.log("File uploaded successfully:", resp.data?.ID);
        console.log("File URL:", resp.data?.HashFile);
      } else {
        const errorResponse = data as ErrorResponse;
        error(
          errorResponse.message || "Network error occurred during upload",
          "colored"
        );
      }
    },
    onError: (err: unknown) => {
      console.error("Upload error:", err);
      error(
        "An error occurred during the upload. Please try again.",
        "colored"
      );
    },
  });

  const {
    mutate: getFiles,
    data: filesMetadata,
    isPending: isFetchingFiles,
    isSuccess: isFetchSuccess,
  } = useMutation({
    mutationFn: async ({
      permissions,
      folder,
    }: {
      permissions: string;
      folder: string;
    }) => {
      const storedToken = GetAuthToken(navigate);
      return fileUseCase.GetFiles(storedToken, permissions, folder);
    },
    onSuccess: (data) => {
      if (data && "data" in data) {
        const resp = data as FilesResponse;
        setFilesList(resp.data);
      } else {
        const errorResponse = data as ErrorResponse;
        setFilesList([]);
        error(
          errorResponse.message ||
            "Network error occurred while fetching files",
          "colored"
        );
      }
    },
    onError: (err: unknown) => {
      console.error("Fetch error:", err);
      error(
        "An error occurred while retrieving files. Please try again.",
        "colored"
      );
    },
  });

  const {
    mutate: downloadFiles,
    data: downloadMetadata,
    isPending: isDownloading,
    isSuccess: downloadSuccess,
    isError: downloadError,
  } = useMutation({
    mutationFn: async ({
      files: files,
      permission,
    }: {
      files: Data[];
      permission: string;
    }) => {
      const storedToken = GetAuthToken(navigate);
      return fileUseCase.DownloadFiles(files, storedToken, permission);
    },
    onSuccess: (data) => {
      if (data) success("Files downloaded successfully!", "colored");
      else {
        error(
          "An error occurred during download. Please try again.",
          "colored"
        );
      }
    },
    onError: (err: unknown) => {
      console.error("Download error:", err);
      error("An error occurred during download. Please try again.", "colored");
    },
  });

  const uploadFileAsync = (
    file: File,
    parent: string,
    folder: string,
    description: string,
    organisation: string,
    destination: string,
    version: number,
    permission: string,
    reciverId: string,
    tagged_users: string[],
    phase: string
  ): Promise<FileResponse> => {
    return new Promise((resolve, reject) => {
      uploadFile(
        {
          file,
          parent,
          folder,
          description,
          organisation,
          destination,
          version,
          permission,
          reciverId,
          tagged_users,
          phase,
        },
        {
          onSuccess: (data) => resolve(data as FileResponse),
          onError: (err) => reject(err),
        }
      );
    });
  };

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

    uploadFileAsync,

    downloadFiles,
    downloadMetadata,
    isDownloading,
    downloadSuccess,
    downloadError,
  };
}
