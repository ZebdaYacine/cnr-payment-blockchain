import { useEffect, useState } from "react";
import NavBarComponent from "../../../../../core/components/NavBar";
import { useFileMetaData } from "../../../../../core/state/FileContext";
import { ProfileDataSourceImpl } from "../../../data/dataSource/ProfileAPIDataSource";
import { ProfileRepositoryImpl } from "../../../data/repository/ProfileRepositoryImpl";
import { PofileUseCase } from "../../../domain/usecase/ProfileUseCase";
import { useProfileViewModel } from "../../../viewmodel/ProfileViewModel";
import ListOfFiles from "../components/ListOfFiles";
import UploadFileComponet from "../components/UploadFileComponet";
import {
  FilesResponse,
  ProfileResponse,
  User,
} from "../../../data/dtos/ProfileDtos";
import { ErrorResponse } from "../../../../../services/model/commun";
import { useNavigate } from "react-router";
import { useAuth } from "../../../../../core/state/AuthContext";

function HomePage() {
  const dataSource = new ProfileDataSourceImpl();
  const repository = new ProfileRepositoryImpl(dataSource);
  const profileUseCase = new PofileUseCase(repository);
  const [user, setUser] = useState<User>({
    username: "",
    email: "",
    permission: "",
  });

  const { getFilesList, setFilesList } = useFileMetaData();
  const {
    getFiles,
    filesMetadata,
    isFetchingFiles,
    isFetchSuccess,

    getProfile,
    isProfileLoading,
    isProfileSuccess,
    Profile,
  } = useProfileViewModel(profileUseCase);

  const navigate = useNavigate();
  const { isAuthentificated, Userlogout } = useAuth();

  useEffect(() => {
    getFiles();
    getProfile();
  }, []);

  useEffect(() => {
    console.log(">>> Fetch profile status:", isProfileSuccess);
    console.log(">>> Fetch file status:", isFetchSuccess);
    if (isFetchingFiles) {
      console.log("Fetching files...");
    } else if (isFetchSuccess && filesMetadata) {
      console.log("Files fetched successfully!");
      const filesData = filesMetadata as FilesResponse;
      if (filesData?.data) {
        setFilesList(filesData.data);
      }
    } else {
      console.log("Error fetching files!");
      console.log(
        "Error message:",
        (filesMetadata as ErrorResponse)?.message || "No error message"
      );
    }
    if (isProfileLoading) {
      console.log("Fetching profile...");
    } else if (isProfileSuccess && Profile) {
      console.log("Profile fetched successfully!");
      if ("data" in Profile) {
        const profileData = Profile as ProfileResponse;
        const userData = profileData?.data as User;
        if (userData) {
          console.log("Profile fetched:", userData);
          setUser({
            username: userData.username,
            email: userData.email,
            permission: userData.permission,
          });
        }
      } else {
        const errorProfile = Profile as ErrorResponse;
        console.log(errorProfile?.message || "Unknown error");
        Userlogout();
        if (!isAuthentificated) navigate("/");
      }
    }
  }, [
    Profile,
    isProfileSuccess,
    isProfileLoading,
    isFetchSuccess,
    filesMetadata,
  ]);

  return (
    <>
      <NavBarComponent user={user} />
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <UploadFileComponet />
        <ListOfFiles files={getFilesList()} />
      </div>
    </>
  );
}

export default HomePage;
