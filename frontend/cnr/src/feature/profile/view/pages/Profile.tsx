import { useEffect } from "react";
import NavBarComponent from "../../../../core/components/NavBar";
import { ProfileDataSourceImpl } from "../../data/dataSource/ProfileAPIDataSource";
import { ProfileRepositoryImpl } from "../../data/repository/ProfileRepositoryImpl";
import { PofileUseCase } from "../../domain/usecase/ProfileUseCase";
import { useProfileViewModel } from "../../viewmodel/ProfileViewModel";
import { useUserId } from "../../../../core/state/UserContext";
import ListOfPeers from "../components/ListOfPeers";
import FolderPage from "../../../folder/view/home/pages/Folder";
import { Outlet, useParams } from "react-router";

function ProfilePage() {
  const profileUseCase = new PofileUseCase(
    new ProfileRepositoryImpl(new ProfileDataSourceImpl())
  );
  const { folderName } = useParams();
  const { fileName } = useParams();

  const { getProfile, GetChildInstituations } =
    useProfileViewModel(profileUseCase);
  const { username, email, permission, workAt, idInstituion } = useUserId();

  useEffect(() => {
    console.log(folderName);
    getProfile();
  }, [getProfile]);

  useEffect(() => {
    console.log(workAt, idInstituion);
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
      {/* <NavBarComponent
        user={{ username, email, permission, workAt, idInstituion }}
      /> */}

      <div className=" flex flex-col">
        <div className="m-5">{!fileName && <ListOfPeers />}</div>
        {/* <div className="flex flex-col md:flex-row  space-y-4 md:space-y-0 md:space-x-4 p-6 bg-black"> */}
        {/* <div className="m-5">
          {!folderName && <FolderPage />} <Outlet />
        </div> */}
        {/* </div> */}
      </div>
    </>
  );
}

export default ProfilePage;
