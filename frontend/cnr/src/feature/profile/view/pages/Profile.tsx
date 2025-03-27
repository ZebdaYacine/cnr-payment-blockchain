import { useEffect } from "react";
import NavBarComponent from "../../../../core/components/NavBar";
import { ProfileDataSourceImpl } from "../../data/dataSource/ProfileAPIDataSource";
import { ProfileRepositoryImpl } from "../../data/repository/ProfileRepositoryImpl";
import { PofileUseCase } from "../../domain/usecase/ProfileUseCase";
import { useProfileViewModel } from "../../viewmodel/ProfileViewModel";
import ListOfPeers from "../components/ListOfPeers";
import FolderPage from "../../../folder/view/home/pages/Folder";
import { Outlet, useParams } from "react-router";
import { ToastContainer } from "react-toastify";
import { useUser } from "../../../../core/state/UserContext";
import FooterComponent from "../../../../core/components/FooterComponent";
// import Phase from "../components/Phase";
function ProfilePage() {
  const { folderName, fileName } = useParams();
  const profileUseCase = new PofileUseCase(
    new ProfileRepositoryImpl(new ProfileDataSourceImpl())
  );

  const { getProfile, GetUsers, getCurrentPhase } =
    useProfileViewModel(profileUseCase);
  const { userSaved } = useUser();

  useEffect(() => {
    if (userSaved.permission)
      getProfile({ permission: userSaved.permission.toLowerCase() });
  }, []);

  useEffect(() => {
    if (userSaved.permission)
      GetUsers({ permissions: userSaved.permission.toLowerCase() });
  }, []);

  useEffect(() => {
    getCurrentPhase();
  }, [getCurrentPhase]);

  return (
    <>
      <NavBarComponent user={userSaved} />
      <ToastContainer />
      <div className="flex flex-col">
        {!folderName || !fileName ? (
          <div className="m-5">
            {!folderName && !fileName && <ListOfPeers />}
            {!folderName && <FolderPage />}
            <Outlet />
          </div>
        ) : (
          <Outlet />
        )}
      </div>
      {/* <FooterComponent /> */}
    </>
  );
}

export default ProfilePage;
