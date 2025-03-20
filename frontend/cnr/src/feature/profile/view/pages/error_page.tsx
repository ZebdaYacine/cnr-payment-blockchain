import { useEffect } from "react";
import { ProfileDataSourceImpl } from "../../data/dataSource/ProfileAPIDataSource";
import { ProfileRepositoryImpl } from "../../data/repository/ProfileRepositoryImpl";
import { PofileUseCase } from "../../domain/usecase/ProfileUseCase";
import { useProfileViewModel } from "../../viewmodel/ProfileViewModel";
import { useUserId } from "../../../../core/state/UserContext";
import Neterr from "../../../../assets/404.png";
import { useNavigate } from "react-router";

function ErrorPage() {
  const profileUseCase = new PofileUseCase(
    new ProfileRepositoryImpl(new ProfileDataSourceImpl())
  );

  const { getProfile, isProfileSuccess } = useProfileViewModel(profileUseCase);
  const { permission } = useUserId();
  const userPermission = permission || localStorage.getItem("permission");
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      if (userPermission)
        getProfile({ permission: userPermission.toLowerCase() });
    }, 10000);
    return () => clearInterval(interval);
  }, [getProfile, userPermission]);

  useEffect(() => {
    if (isProfileSuccess) {
      navigate("/home");
    }
  }, [isProfileSuccess]);

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-10">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <div className="w-30" style={{ width: "60%" }}>
            <img src={Neterr} alt="Logo" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">
            Oops! Un problème est survenu.
          </h1>
          <p className="text-gray-600 mt-2 font-bold">
            Le serveur est en panne{" "}
          </p>
        </div>
      </div>
    </>
  );
}

export default ErrorPage;
