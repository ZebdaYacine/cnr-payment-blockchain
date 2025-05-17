import { useMutation } from "@tanstack/react-query";
import { ErrorResponse } from "../../../services/model/commun";
import { useNotification } from "../../../services/useNotification";
import { VersionUseCase } from "../domain/usecase/VersionUseCase";
import {
  VersionsResponse,
  VersionsUploadResponse,
} from "../data/dtos/VersionsDtos";
import { useUser } from "../../../core/state/UserContext";
import { useVersionMetaData } from "../../../core/state/versionMetaDataContext";
import { useVersion } from "../../../core/state/versionContext";

function convertFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

export function useVersionViewModel(versioneUseCase: VersionUseCase) {
  const { userSaved } = useUser();
  const { setFilesList } = useVersionMetaData();
  const { success, error } = useNotification();
  const { SetLastVersion } = useVersion();

  const {
    mutate: uploadVersion,
    data: uploadMetadata,
    isPending: isUploading,
    isSuccess: uploadSuccess,
    isError: uploadError,
  } = useMutation({
    mutationFn: async ({
      version: version,
      parent,
      version_seq: version_seq,
      commit,
      description,
      folderName,
      hash_parent,
      receiverId,
      taggedUsers,
      organization,
      destination,
    }: {
      version: File;
      parent: string;
      version_seq: number;
      commit: string;
      description: string;
      folderName: string;
      hash_parent: string;
      receiverId: string;
      taggedUsers: string[];
      organization: string;
      destination: string;
    }) => {
      const base64File = await convertFileToBase64(version);
      const filename = version.name;
      const action = "upload";
      const storedToken = localStorage.getItem("authToken");
      if (!storedToken) {
        throw new Error("Authentication token not found");
      }
      return versioneUseCase.UploadVersion(
        filename,
        base64File,
        storedToken,
        action,
        parent,
        version_seq,
        userSaved.permission.toLowerCase(),
        commit,
        description,
        folderName,
        hash_parent,
        receiverId,
        taggedUsers,
        organization,
        destination
      );
    },
    onSuccess: (data) => {
      if (data && "data" in data) {
        const resp = data as VersionsUploadResponse;
        if (resp) {
          const v = resp.data;
          console.log("Version uploaded successfully:", v);
          success("version est chargee", "colored");
          if (v?.LastVersion) {
            const newVersion = Number(v.LastVersion);
            console.log("Setting new lastVersion:", newVersion);
            SetLastVersion(newVersion);
          } else {
            console.error("Error: LastVersion is undefined in response:", v);
          }
        }
      } else {
        const errorResponse = data as ErrorResponse;
        console.log(errorResponse.message);
        error(errorResponse.message, "colored");

        // error(
        //   errorResponse.message || "Network error occurred during upload",
        //   "colored"
        // );
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
    mutate: getVersion,
    data: filesMetadata,
    isPending: isFetchingFiles,
    isSuccess: isFetchSuccess,
  } = useMutation({
    mutationFn: async ({
      permission,
      parent: parent,
      folder: folder,
    }: {
      permission: string;
      parent: string;
      folder: string;
    }) => {
      const storedToken = localStorage.getItem("authToken");
      if (!storedToken) {
        throw new Error("Authentication token not found");
      }
      return versioneUseCase.GetVersions(
        storedToken,
        permission.toLowerCase(),
        folder,
        parent
      );
    },
    onSuccess: (data) => {
      if (data && "data" in data) {
        const resp = data as VersionsResponse;
        console.log("Files retrieved successfully:", resp.data);
        setFilesList(resp.data);
      }
    },
    onError: (err: ErrorResponse) => {
      setFilesList([]);
      console.error("Fetch error:", err);
      // error(err.message, "colored");
    },
  });

  return {
    uploadVersion: uploadVersion,
    uploadMetadata,
    isUploading,
    uploadSuccess,
    uploadError,

    getVersion: getVersion,
    filesMetadata,
    isFetchingFiles,
    isFetchSuccess,

    // getProfile,
    // isProfileLoading,
    // isProfileSuccess,
    // Profile,
  };
}
