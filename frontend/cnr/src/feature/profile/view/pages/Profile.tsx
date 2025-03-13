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
  const { folderName, fileName } = useParams();

  const profileUseCase = new PofileUseCase(
    new ProfileRepositoryImpl(new ProfileDataSourceImpl())
  );

  const { getProfile, GetChildInstituations, GetUsers } =
    useProfileViewModel(profileUseCase);
  const { username, email, permission, workAt, idInstituion } = useUserId();

  useEffect(() => {
    getProfile();
  }, [getProfile]);

  useEffect(() => {
    if (["DIO", "CCR", "POST"].includes(workAt)) {
      GetUsers();
    }
  }, [GetUsers, workAt]);

  useEffect(() => {
    if (workAt && idInstituion) {
      GetChildInstituations({ name: workAt, id: idInstituion });
    }
  }, [workAt, idInstituion, GetChildInstituations]);

  return (
    <>
      <NavBarComponent
        user={{ username, email, permission, workAt, idInstituion }}
      />

      <div className="flex flex-col">
        <div className="m-5">{!folderName && !fileName && <ListOfPeers />}</div>

        <div className="m-5">
          {!folderName && <FolderPage />}
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default ProfilePage;
