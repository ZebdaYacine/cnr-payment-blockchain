import { useEffect } from "react";
import NavBarComponent from "../../../../../core/components/NavBar";
import { useFileMetaData } from "../../../../../core/state/FileContext";
import { ProfileDataSourceImpl } from "../../../data/dataSource/ProfileAPIDataSource";
import { ProfileRepositoryImpl } from "../../../data/repository/ProfileRepositoryImpl";
import { PofileUseCase } from "../../../domain/usecase/ProfileUseCase";
import { useProfileViewModel } from "../../../viewmodel/ProfileViewModel";
import ListOfFiles from "../components/ListOfFiles";
import UploadFileComponet from "../components/UploadFileComponet";
import { useUserId } from "../../../../../core/state/UserContext";

function HomePage() {
  const dataSource = new ProfileDataSourceImpl();
  const repository = new ProfileRepositoryImpl(dataSource);
  const profileUseCase = new PofileUseCase(repository);

  const { getFilesList } = useFileMetaData();
  const { getFiles, getProfile } = useProfileViewModel(profileUseCase);
  const { username, email, permission } = useUserId();

  useEffect(() => {
    getFiles();
    getProfile();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      getFiles();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <NavBarComponent
        user={{
          username: username,
          email: email,
          permission: permission,
        }}
      />
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <UploadFileComponet />
        <ListOfFiles files={getFilesList()} />
      </div>
    </>
  );
}

export default HomePage;
