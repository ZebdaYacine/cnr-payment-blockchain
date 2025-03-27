import { useEffect } from "react";
import NavBarComponent from "../../../../core/components/NavBar";
import { ProfileDataSourceImpl } from "../../data/dataSource/ProfileAPIDataSource";
import { ProfileRepositoryImpl } from "../../data/repository/ProfileRepositoryImpl";
import { PofileUseCase } from "../../domain/usecase/ProfileUseCase";
import { useProfileViewModel } from "../../viewmodel/ProfileViewModel";
import { useUser } from "../../../../core/state/UserContext";
function SettingsPage() {
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
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <textarea placeholder="Success" className="textarea textarea-success" />
        <button className="btn btn-outline btn-success">Success</button>
      </div>
      {""}
    </>
  );
}

export default SettingsPage;
