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
  const { username, email, permission, workAt, idInstituion, type } =
    useUserId();
  const userPermission = permission || localStorage.getItem("permission");

  useEffect(() => {
    if (userPermission)
      getProfile({ permission: userPermission.toLowerCase() });
  }, [getProfile, userPermission]);

  useEffect(() => {
    // if (["DIO", "CCR", "POST"].includes(workAt)) {
    if (userPermission) GetUsers({ permissions: userPermission.toLowerCase() });
    // }
  }, [GetUsers, workAt, userPermission]);

  useEffect(() => {
    if (workAt && idInstituion) {
      if (userPermission)
        GetChildInstituations({
          name: workAt,
          id: idInstituion,
          permissions: userPermission.toLowerCase(),
        });
    }
  }, [workAt, idInstituion, GetChildInstituations, userPermission]);

  return (
    <>
      <NavBarComponent
        user={{ username, email, permission, workAt, idInstituion, type }}
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
