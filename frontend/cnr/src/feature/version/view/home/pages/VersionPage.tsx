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

      <div className="flex mt-10">
        <div className="flex flex-none   justify-center items-center w-1/4   ">
          <div className="flex w-full flex-col border-opacity-50 m-3">
            <h1 className="text-3xl font-bold">Commits:</h1>
            <div className="divider divider-primary" />
            <div className="mt-1 card border border-gray-500 h-50 p-1">
              <div className="flex flex-col">
                <p className="text-black text-lg font-bold">
                  Adding new version for CCR Tipaza
                </p>
                <div className="flex flex-row">
                  <div className="avatar">
                    <div className="w-8 rounded-full">
                      <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                    </div>
                  </div>
                  <div className="flex flex-grow  p-1">
                    <p className="text-black text-sm">
                      <span className="font-bold">ZebdaYacine </span>
                      committed on
                      <span className="font-bold"> 24-12-2024</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-none justify-center w-3/4 ">
          <ListOfVersion version={[]} />
        </div>
      </div>
    </>
  );
}

export default VersionPage;
