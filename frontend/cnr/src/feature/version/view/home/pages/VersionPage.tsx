import { useEffect } from "react";
import { ProfileDataSourceImpl } from "../../../data/dataSource/ProfileAPIDataSource";
import { ProfileRepositoryImpl } from "../../../data/repository/ProfileRepositoryImpl";
import { PofileUseCase } from "../../../domain/usecase/ProfileUseCase";
import { useProfileViewModel } from "../../../viewmodel/ProfileViewModel";
import NavBarComponent from "../../../../../core/components/NavBar";
import { useUserId } from "../../../../../core/state/UserContext";
import ListOfVersion from "../components/ListOfVersion";

function VersionPage() {
  const dataSource = new ProfileDataSourceImpl();
  const repository = new ProfileRepositoryImpl(dataSource);
  const profileUseCase = new PofileUseCase(repository);

  const { getProfile } = useProfileViewModel(profileUseCase);
  const { username, email, permission } = useUserId();

  useEffect(() => {
    getProfile();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {}, 10000);
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
      <div className="flex flex-col items-center  m-10">
        <ListOfVersion files={[]} />
      </div>
    </>
  );
}

export default VersionPage;
