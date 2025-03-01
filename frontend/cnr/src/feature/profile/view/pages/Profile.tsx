import { useEffect } from "react";
import NavBarComponent from "../../../../core/components/NavBar";
// import { useFileMetaData } from "../../../../../core/state/FileContext";
import { ProfileDataSourceImpl } from "../../data/dataSource/ProfileAPIDataSource";
import { ProfileRepositoryImpl } from "../../data/repository/ProfileRepositoryImpl";
import { PofileUseCase } from "../../domain/usecase/ProfileUseCase";
import { useProfileViewModel } from "../../viewmodel/ProfileViewModel";
// import ListOfFiles from "../components/ListOfFiles";
import { useUserId } from "../../../../core/state/UserContext";
import ListOfPeers from "../components/ListOfPeers";
// import FolderPage from "../../../../folder/view/home/pages/Folder";
import FilesPage from "../../../file/view/home/pages/Files";
import FolderPage from "../../../folder/view/home/pages/Folder";

function ProfilePage() {
  const profileUseCase = new PofileUseCase(
    new ProfileRepositoryImpl(new ProfileDataSourceImpl())
  );

  const { getProfile, GetChildInstituations } =
    useProfileViewModel(profileUseCase);
  const { username, email, permission, workAt, idInstituion } = useUserId();

  useEffect(() => {
    getProfile();
  }, [getProfile]);

  // Fetch institutions only when workAt and idInstituion are available
  useEffect(() => {
    if (workAt && idInstituion) {
      console.log("Fetching institutions with:", {
        name: workAt,
        id: idInstituion,
      });
      GetChildInstituations({ name: workAt, id: idInstituion });
    } else {
      console.warn("Skipping API request: Missing workAt or idInstituion.");
    }
  }, [workAt, idInstituion, GetChildInstituations]);

  return (
    <>
      <NavBarComponent
        user={{ username, email, permission, workAt, idInstituion }}
      />

      <div className=" flex flex-col p-10">
        <ListOfPeers />
        <div className="flex flex-col md:flex-row   m-2 p-2 space-y-4 md:space-y-0 md:space-x-4">
          <div className="w-full ">
            <FolderPage />
            {/* <FilesPage /> */}
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfilePage;
