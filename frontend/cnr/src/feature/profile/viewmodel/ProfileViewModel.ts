import {
  FileResponse,
  PhaseResponse,
  // FolderResponse,
  UsersResponse,
} from "./../data/dtos/ProfileDtos";
import { useMutation } from "@tanstack/react-query";
import { ErrorResponse } from "../../../services/model/commun";
import { useNotification } from "../../../services/useNotification";
import { PofileUseCase } from "../domain/usecase/ProfileUseCase";
import { FilesResponse, ProfileResponse } from "../data/dtos/ProfileDtos";
import { useFileMetaData } from "../../../core/state/FileContext";
import { useNavigate } from "react-router";
import { User } from "../../../core/dtos/data";
import { useUserId } from "../../../core/state/UserContext";

import { useListUsers } from "../../../core/state/ListOfUsersContext";
import { IsTokenExpired } from "../../../services/Http";
import { usePhaseId } from "../../../core/state/PhaseContext";

function convertFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
function getAuthToken(navigate: Function): string {
  const token = localStorage.getItem("authToken");
  if (!token) {
    navigate("/");
    throw new Error("Authentication token not found");
  }
  if (IsTokenExpired(token)) {
    localStorage.removeItem("authToken");
    navigate("/");
    throw new Error("Session expired. Please log in again.");
  }
  return token;
}

export function useProfileViewModel(profileUseCase: PofileUseCase) {
  // const { isAuthentificated, Userlogout } = useAuth();
  const navigate = useNavigate();
  const { error } = useNotification();
  const { setFilesList } = useFileMetaData();
  const { setUsersList } = useListUsers();
  const { SetCurrentPhase } = usePhaseId();
  // const { setFoldersList } = useFoldersMetaData();

  const {
    SetWilaya,
    SetUserId,
    SetUsername,
    SetEmail,
    SetPermission,
    SetType,
    SetWorkAt,
    SetidInstituion,
    SetPhases,
    permission,
  } = useUserId();

  const {
    mutate: getProfile,
    data: Profile,
    isPending: isProfileLoading,
    isSuccess: isProfileSuccess,
  } = useMutation({
    mutationFn: async ({ permission: permission }: { permission: string }) => {
      const storedToken = getAuthToken(navigate);
      return profileUseCase.GetProfile(storedToken, permission.toLowerCase());
    },
    onSuccess: (data) => {
      if (data && "data" in data) {
        const resp = data as ProfileResponse;
        const userData = resp.data as User;
        if (userData) {
          console.log("Profile fetched:", userData);
          SetUsername(userData.username);
          SetUserId(userData.id);
          SetWilaya(userData.wilaya);
          SetEmail(userData.email);
          SetPermission(userData.permission);
          SetWorkAt(userData.workAt);
          SetType(userData.type);
          SetidInstituion(userData.idInstituion);
          SetPhases(userData.phases);
        }
      }
    },
    onError: (err: unknown) => {
      console.error("GET PROFILE error:", err);
      navigate("/error-page");
      error(
        "An error occurred during the upload. Please try again.",
        "colored"
      );
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
      permission: permission,
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
      const storedToken = getAuthToken(navigate);
      return profileUseCase.UploadFile(
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
      permissions: permissions,
    }: {
      permissions: string;
    }) => {
      const storedToken = getAuthToken(navigate);
      return profileUseCase.GetFiles(storedToken, permissions);
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
    mutate: GetUsers,
    data: users,
    isPending: isUserLoading,
    isSuccess: isUsersSuccss,
    isError: isError,
  } = useMutation({
    mutationFn: async ({
      permissions: permissions,
    }: {
      permissions: string;
    }) => {
      const storedToken = getAuthToken(navigate);
      return await profileUseCase.GetUsers(storedToken, permissions);
    },

    onSuccess: (data) => {
      if (data && "data" in data) {
        const resp = data as UsersResponse;
        const users = resp.data as User[];
        console.log(users);
        setUsersList(users);
      }
    },
    onError: (err) => {
      const errorMessage =
        err instanceof Error
          ? err.message.includes("Error unknown: Unknown error")
            ? "Cannot connect to the server. Please check your internet or try again later."
            : err.message
          : "An unknown error occurred while fetching users.";

      error(errorMessage, "colored");
    },
  });

  const {
    mutate: getCurrentPhase,
    data: currentPhase,
    isPending: isPhaseLoading,
    isSuccess: isPhaseSuccess,
  } = useMutation({
    mutationFn: async () => {
      const storedToken = getAuthToken(navigate);
      return profileUseCase.GetCurrentPhase(
        storedToken,
        permission.toLowerCase()
      );
    },
    onSuccess: (data) => {
      if (data && "data" in data) {
        const phase = data.data as PhaseResponse;
        if (phase) {
          SetCurrentPhase(phase);
        }
      }
    },
    onError: (err: unknown) => {
      console.error("GET CURRENT PHASE error:", err);
      error(
        "An error occurred while fetching the current phase. Please try again.",
        "colored"
      );
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

    getProfile,
    isProfileLoading,
    isProfileSuccess,
    Profile,

    GetUsers,
    users,
    isUserLoading,
    isUsersSuccss,
    isError,

    uploadFileAsync,

    getCurrentPhase,
    currentPhase,
    isPhaseLoading,
    isPhaseSuccess,
  };
}
