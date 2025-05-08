import { useEffect, useCallback } from "react";
import { ProfileDataSourceImpl } from "../../data/dataSource/ProfileAPIDataSource";
import { ProfileRepositoryImpl } from "../../data/repository/ProfileRepositoryImpl";
import { PofileUseCase } from "../../domain/usecase/ProfileUseCase";
import { useProfileViewModel } from "../../viewmodel/ProfileViewModel";
import Neterr from "../../../../assets/server-off.png";
import { useNavigate } from "react-router";
import { useUser } from "../../../../core/state/UserContext";

function ErrorPage() {
  const profileUseCase = new PofileUseCase(
    new ProfileRepositoryImpl(new ProfileDataSourceImpl())
  );

  const { getProfile, isProfileSuccess } = useProfileViewModel(profileUseCase);
  const { userSaved } = useUser();
  const userPermission = userSaved.permission;
  const navigate = useNavigate();

  // ✅ Memoize fetch logic
  const fetchProfile = useCallback(() => {
    if (userPermission) {
      getProfile({ permission: userPermission.toLowerCase() });
    }
  }, [getProfile, userPermission]);

  // ✅ Retry every 10s
  useEffect(() => {
    const interval = setInterval(fetchProfile, 10000);
    return () => clearInterval(interval);
  }, [fetchProfile]);

  // ✅ Initial fetch on mount
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (isProfileSuccess) {
      navigate("/home");
    }
  }, [isProfileSuccess, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-10">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <div className="w-30" style={{ width: "60%" }}>
          <img src={Neterr} alt="Logo" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">
          Oops! Un problème est survenu.
        </h1>
        <p className="text-gray-600 mt-2 font-bold">Le serveur est en panne</p>
      </div>
    </div>
  );
}

export default ErrorPage;
