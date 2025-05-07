import { useEffect, useCallback } from "react";
import { ProfileDataSourceImpl } from "../../data/dataSource/ProfileAPIDataSource";
import { ProfileRepositoryImpl } from "../../data/repository/ProfileRepositoryImpl";
import { PofileUseCase } from "../../domain/usecase/ProfileUseCase";
import { useProfileViewModel } from "../../viewmodel/ProfileViewModel";

import { useUser } from "../../../../core/state/UserContext";
import ResponsiveDrawer from "../../../../core/components/ResponsiveDrawer";
import { useKeys } from "../../../../core/state/KeyContext";

function ProfilePage() {
  const profileUseCase = new PofileUseCase(
    new ProfileRepositoryImpl(new ProfileDataSourceImpl())
  );

  const { getProfile, GetUsers, getCurrentPhase } =
    useProfileViewModel(profileUseCase);
  const { userSaved } = useUser();
  const { setIsDigitalSignatureConfirmed, isDigitalSignatureConfirmed } =
    useKeys();

  const initializeProfileData = useCallback(() => {
    if (userSaved.permission) {
      const permission = userSaved.permission.toLowerCase();
      getProfile({ permission });
      GetUsers({ permissions: permission });
    }

    if (!userSaved.publicKey) {
      setIsDigitalSignatureConfirmed(false);
    } else {
      console.log(isDigitalSignatureConfirmed);
    }

    getCurrentPhase();
  }, [
    userSaved.permission,
    userSaved.publicKey,
    getProfile,
    GetUsers,
    getCurrentPhase,
    setIsDigitalSignatureConfirmed,
    isDigitalSignatureConfirmed,
  ]);

  useEffect(() => {
    initializeProfileData();
  }, [initializeProfileData]);

  return (
    <>
      <ResponsiveDrawer />
    </>
  );
}

export default ProfilePage;
