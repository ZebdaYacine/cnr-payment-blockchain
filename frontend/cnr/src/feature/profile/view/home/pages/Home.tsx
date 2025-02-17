import { useEffect } from "react";
import NavBarComponent from "../../../../../core/components/NavBar";
import { useFileMetaData } from "../../../../../core/state/FileContext";
import { ProfileDataSourceImpl } from "../../../data/dataSource/ProfileAPIDataSource";
import { ProfileRepositoryImpl } from "../../../data/repository/ProfileRepositoryImpl";
import { PofileUseCase } from "../../../domain/usecase/ProfileUseCase";
import { useProfileViewModel } from "../../../viewmodel/ProfileViewModel";
import ListOfFiles from "../components/ListOfFiles";
import { useUserId } from "../../../../../core/state/UserContext";
import ListOfPeers from "../components/ListOfPeers";

function HomePage() {
  // Dependency Injection
  const profileUseCase = new PofileUseCase(
    new ProfileRepositoryImpl(new ProfileDataSourceImpl())
  );

  const { getFilesList } = useFileMetaData();
  const { getFiles, getProfile, GetChildInstituations } =
    useProfileViewModel(profileUseCase);
  const { username, email, permission, workAt, idInstituion } = useUserId();

  useEffect(() => {
    getFiles();
    getProfile();
    GetChildInstituations({ name: workAt, id: idInstituion });
  }, [getFiles, getProfile]);
  useEffect(() => {
    const interval = setInterval(() => getFiles(), 10000);
    return () => clearInterval(interval);
  }, [getFiles]);

  return (
    <>
      <NavBarComponent user={{ username, email, permission }} />

      {/* <div className="flex items-center justify-center  m-10 p-4">
        <UploadFileComponent />
      </div> */}

      <div className=" flex flex-col p-10">
        <div className="divider divider-primary" />
        <ListOfPeers />
        <div className="divider divider-primary" />
        <div className="flex flex-col md:flex-row   m-2 p-2 space-y-4 md:space-y-0 md:space-x-4">
          <div className="w-full md:w-1/2 ">
            <ListOfFiles files={getFilesList()} type="OUT" />
          </div>
          <div className="w-full md:w-1/2 ">
            <ListOfFiles files={getFilesList()} type="IN" />
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage;
