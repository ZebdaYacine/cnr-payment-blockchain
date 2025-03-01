import { useEffect } from "react";
import NavBarComponent from "../../../../../core/components/NavBar";
// import { useFileMetaData } from "../../../../../core/state/FileContext";
import { ProfileDataSourceImpl } from "../../../data/dataSource/ProfileAPIDataSource";
import { ProfileRepositoryImpl } from "../../../data/repository/ProfileRepositoryImpl";
import { PofileUseCase } from "../../../domain/usecase/ProfileUseCase";
import { useProfileViewModel } from "../../../viewmodel/ProfileViewModel";
// import ListOfFiles from "../components/ListOfFiles";
import { useUserId } from "../../../../../core/state/UserContext";
import ListOfPeers from "../components/ListOfPeers";
import { usePeer } from "../../../../../core/state/PeerContext";
import ListOfFolders from "../components/ListOfFolders";
import { useFoldersMetaData } from "../../../../../core/state/FolderContext";

function HomePage() {
  const profileUseCase = new PofileUseCase(
    new ProfileRepositoryImpl(new ProfileDataSourceImpl())
  );

  const { getFoldersList } = useFoldersMetaData();
  const { getFiles, getProfile, getFolders, GetChildInstituations } =
    useProfileViewModel(profileUseCase);
  const { username, email, permission, workAt, idInstituion } = useUserId();

  useEffect(() => {
    // getFiles();
    getFolders();
    // getProfile();
    GetChildInstituations({ name: workAt, id: idInstituion });
  }, [getFiles, getProfile]);
  useEffect(() => {
    const interval = setInterval(() => getFiles(), 10000);
    return () => clearInterval(interval);
  }, [getFiles]);

  const { Peer } = usePeer();

  return (
    <>
      <NavBarComponent
        user={{ username, email, permission, workAt, idInstituion }}
      />

      {/* <div className="flex items-center justify-center  m-10 p-4">
        <UploadFileComponent />
      </div> */}

      <div className=" flex flex-col p-10">
        {/* <div className="divider divider-primary" /> */}
        <ListOfPeers />
        {/* <div className="divider divider-primary" /> */}
        <div className="flex flex-col md:flex-row   m-2 p-2 space-y-4 md:space-y-0 md:space-x-4">
          <div className="w-full ">
            {/* <ListOfFiles files={getFilesList()} peer={Peer} /> */}
            <ListOfFolders folders={getFoldersList()} peer={Peer} />
          </div>
          {/* <div className="w-full md:w-1/2 ">
            <ListOfFiles files={getFilesList()} type="IN" />
          </div> */}
        </div>
      </div>
    </>
  );
}

export default HomePage;
