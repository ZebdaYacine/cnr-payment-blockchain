import { ChildResponse, Elements, Institution, InstitutionResponse, Peer } from './../data/dtos/ProfileDtos';
import { useMutation } from "@tanstack/react-query";
import { ErrorResponse } from "../../../services/model/commun";
import { useNotification } from "../../../services/useNotification";
import { PofileUseCase } from "../domain/usecase/ProfileUseCase";
import { FilesResponse, ProfileResponse } from "../data/dtos/ProfileDtos";
import { useFileMetaData } from "../../../core/state/FileContext";
import { useNavigate } from "react-router";
import { useAuth } from "../../../core/state/AuthContext";
import { User } from "../../../core/dtos/data";
import { useUserId } from '../../../core/state/UserContext';

function convertFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

export function useProfileViewModel(profileUseCase: PofileUseCase) {
  const { isAuthentificated, Userlogout } = useAuth();
  const navigate = useNavigate();
  const { error } = useNotification();
  const { setFilesList } = useFileMetaData();
  const {SetUsername,SetEmail,SetPermission ,SetWorkAt,SetidInstituion} = useUserId();
  
  const { mutate: getProfile, data: Profile, isPending: isProfileLoading, isSuccess: isProfileSuccess} = useMutation({
    mutationFn: async () => {
      const storedToken = localStorage.getItem("authToken");
      if (!storedToken) {
        throw new Error("Authentication token not found");
      }
      return profileUseCase.GetProfile(storedToken);
    },
    onSuccess: (data) => {
      if (data && "data" in data) {
        const resp = data as ProfileResponse;
        const userData = resp.data as User;
        if (userData) {
          console.log("Profile fetched:", userData);
           SetUsername(userData?.username)
           SetEmail(userData?.email)
           SetPermission(userData?.permission)
           SetWorkAt(userData?.WorkAt)
           SetidInstituion(userData?.idInstituion)
        }
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

  const { mutate: uploadFile, data: uploadMetadata, isPending: isUploading, isSuccess: uploadSuccess, isError: uploadError } = useMutation({
    mutationFn: async ({ file, parent, version }: { file: File; parent: string; version: number }) => {
      const base64File = await convertFileToBase64(file);
      const filename = file.name;
      const action = "upload";
      const storedToken = localStorage.getItem("authToken");
      if (!storedToken) {
        throw new Error("Authentication token not found");
      }
      return profileUseCase.UploadFile(filename, base64File, storedToken, action, parent, version);
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

  const { mutate: getFiles, data: filesMetadata, isPending: isFetchingFiles, isSuccess: isFetchSuccess } = useMutation({
    mutationFn: async () => {
      const storedToken = localStorage.getItem("authToken");
      if (!storedToken) {
        throw new Error("Authentication token not found");
      }
      return profileUseCase.GetFiles(storedToken);
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

  const { mutate: GetInstituations, data: institutionData, isPending: isInstituaionsLoading, isSuccess: isInstituaionsSuccss} = useMutation({
    mutationFn: async () => {
      const storedToken = localStorage.getItem("authToken");
      if (!storedToken) {
        throw new Error("Authentication token not found");
      }
      return profileUseCase.GetInstitutions(storedToken);
    },
    onSuccess: (data) => {
      if (data && "data" in data) {
        const resp = data as InstitutionResponse;
        console.log("Get Institutions successfully:", resp.data.at(-1)?.ID);
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

   const { mutate: GetChildInstituations, data: childInstitutionData, isPending: isChildInstituaionsLoading, isSuccess: isChildInstituaionsSuccss} = useMutation({
    mutationFn: async ({id,name}: { id: string,name: string}) => {
      const storedToken = localStorage.getItem("authToken");
      if (!storedToken) {
        throw new Error("Authentication token not found");
      }
      return profileUseCase.GetChildOfInstitutions(id,name,storedToken);
    },
    onSuccess: (data) => {
      if (data && "data" in data) {
        const resp = data as ChildResponse;
        const element = resp.data as Elements;
        const p=element.institutiont as Peer
        if (!resp.data) {
          console.error("Error: resp.data is undefined");
          } else {
          const element = resp.data as Elements;
          console.log("Elements after casting:", element);
          if (!element.institutiont) {
              console.error("Error: element.institutiont is undefined");
          } else {
              const p = element.institutiont as Peer;
              console.log("Get Institutions successfully:", p);
          }
        }
        if(p.type==="CCR"){
          const ele=element.institutiont.obj as Institution
          console.log("Get Institutions successfully:", ele);
        }
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

    GetInstituations,
    institutionData,
    isInstituaionsLoading,
    isInstituaionsSuccss,

    GetChildInstituations,
    childInstitutionData,
    isChildInstituaionsLoading,
    isChildInstituaionsSuccss,

  };
}
