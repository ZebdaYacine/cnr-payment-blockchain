import { useEffect } from "react";
import { ProfileDataSourceImpl } from "../../data/dataSource/ProfileAPIDataSource";
import { ProfileRepositoryImpl } from "../../data/repository/ProfileRepositoryImpl";
import { PofileUseCase } from "../../domain/usecase/ProfileUseCase";
import { useProfileViewModel } from "../../viewmodel/ProfileViewModel";

import { useUser } from "../../../../core/state/UserContext";
import ResponsiveDrawer from "../../../../core/components/ResponsiveDrawer";
// import Phase from "../components/Phase";
function ProfilePage() {
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
      <ResponsiveDrawer />
    </>
  );
}

export default ProfilePage;
