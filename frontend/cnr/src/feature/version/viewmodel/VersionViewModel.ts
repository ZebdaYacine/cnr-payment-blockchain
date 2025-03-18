import { useMutation } from "@tanstack/react-query";
import { ErrorResponse } from "../../../services/model/commun";
import { useNotification } from "../../../services/useNotification";
import { VersionUseCase } from "../domain/usecase/VersionUseCase";
import { VersionsResponse } from "../data/dtos/VersionsDtos";
import { useUserId } from "../../../core/state/UserContext";

function convertFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

export function useVersionViewModel(profileUseCase: VersionUseCase) {
  // const { isAuthentificated, Userlogout } = useAuth();
  // const navigate = useNavigate();
  const { error } = useNotification();
  const {permission}=useUserId()
  // const { setFilesList } = useFileMetaData();
  // const {SetUsername,SetEmail,SetPermission } = useUserId();
  
  // const { mutate: getProfile, data: Profile, isPending: isProfileLoading, isSuccess: isProfileSuccess} = useMutation({
  //   mutationFn: async () => {
  //     const storedToken = localStorage.getItem("authToken");
  //     if (!storedToken) {
  //       throw new Error("Authentication token not found");
  //     }
  //     return profileUseCase.GetProfile(storedToken);
  //   },
  //   onSuccess: (data) => {
  //     if (data && "data" in data) {
  //       const resp = data as ProfileResponse;
  //       console.log("Get Profile successfully:", resp.data);
  //       const userData = resp.data as User;
  //       if (userData) {
  //         console.log("Profile fetched:", userData);
  //          SetUsername(userData?.username)
  //          SetEmail(userData?.email)
  //          SetPermission(userData?.permission)
  //       }
  //     } else {
  //        const errorResponse = data as ErrorResponse;
  //        error(errorResponse.message || "Network error occurred during upload", "colored");
  //        Userlogout();
  //       if (!isAuthentificated) navigate("/");
  //     }
  //   },
  //   onError: (err: unknown) => {
  //     console.error("Upload error:", err);
  //     error("An error occurred during the upload. Please try again.", "colored");
  //   },
  // });

  const { mutate: uploadVersion, data: uploadMetadata, isPending: isUploading, isSuccess: uploadSuccess, isError: uploadError } = useMutation({
    mutationFn: async ({ version: version, parent, version_seq: version_seq,commit,description,folderName }: { version: File; parent: string; version_seq: number;commit: string;description: string,folderName:string }) => {
      const base64File = await convertFileToBase64(version);
      const filename = version.name;
      const action = "upload";
      const storedToken = localStorage.getItem("authToken");
      if (!storedToken) {
        throw new Error("Authentication token not found");
      }
      return profileUseCase.UploadVersion(filename, base64File, storedToken, action, parent, version_seq,permission.toLowerCase(),commit,description,folderName);
    },
    onSuccess: (data) => {
      if (data && "data" in data) {
        const resp = data as VersionsResponse;
        console.log("Version uploaded successfully:", resp.data.at(-1)?.ID);
        console.log("Version URL:", resp.data.at(-1)?.HashFile);
        //setFilesList(resp.data);
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

  // const { mutate: getVersion, data: filesMetadata, isPending: isFetchingFiles, isSuccess: isFetchSuccess } = useMutation({
  //   mutationFn: async () => {
  //     const storedToken = localStorage.getItem("authToken");
  //     if (!storedToken) {
  //       throw new Error("Authentication token not found");
  //     }
  //     return profileUseCase.GetVersions(storedToken);
  //   },
  //   onSuccess: (data) => {
  //     if (data && "data" in data) {
  //       const resp = data as FilesResponse;
  //       console.log("Files retrieved successfully:", resp.data);
  //       setFilesList(resp.data);
  //     } else {
  //       const errorResponse = data as ErrorResponse;
  //       setFilesList([]);
  //       error(errorResponse.message || "Network error occurred while fetching files", "colored");
  //     }
  //   },
  //   onError: (err: unknown) => {
  //     console.error("Fetch error:", err);
  //     error("An error occurred while retrieving files. Please try again.", "colored");
  //   },
  // });
  

  return {
    uploadVersion: uploadVersion,
    uploadMetadata,
    isUploading,
    uploadSuccess,
    uploadError,

    // getFiles: getVersion,
    // filesMetadata,
    // isFetchingFiles,
    // isFetchSuccess,

    // getProfile,
    // isProfileLoading,
    // isProfileSuccess,
    // Profile,
  };
}
