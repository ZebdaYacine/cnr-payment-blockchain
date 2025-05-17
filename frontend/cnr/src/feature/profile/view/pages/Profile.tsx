import { useEffect, useMemo, useCallback } from "react";
import { ProfileDataSourceImpl } from "../../data/dataSource/ProfileAPIDataSource";
import { ProfileRepositoryImpl } from "../../data/repository/ProfileRepositoryImpl";
import { PofileUseCase } from "../../domain/usecase/ProfileUseCase";
import { useProfileViewModel } from "../../viewmodel/ProfileViewModel";

import { useUser } from "../../../../core/state/UserContext";
import ResponsiveDrawer from "../../../../core/components/ResponsiveDrawer";
import { useKeys } from "../../../../core/state/KeyContext";

function ProfilePage() {
  const { userSaved } = useUser();
  const { setIsDigitalSignatureConfirmed, isDigitalSignatureConfirmed } =
    useKeys();

  const profileUseCase = useMemo(() => {
    return new PofileUseCase(
      new ProfileRepositoryImpl(new ProfileDataSourceImpl())
    );
  }, []);

  const { getProfile, GetUsers, getCurrentPhase } =
    useProfileViewModel(profileUseCase);

  const initializeProfileData = useCallback(() => {
    const permission = userSaved?.permission?.toLowerCase();

    if (permission) {
      getProfile({ permission });
      GetUsers({ permissions: permission });
    }

    if (!userSaved?.publicKey) {
      setIsDigitalSignatureConfirmed(false);
    } else {
      console.log(isDigitalSignatureConfirmed);
    }

    getCurrentPhase();
  }, [
    userSaved?.permission,
    userSaved?.publicKey,
    getProfile,
    GetUsers,
    getCurrentPhase,
    setIsDigitalSignatureConfirmed,
    isDigitalSignatureConfirmed,
  ]);

  useEffect(() => {
    initializeProfileData();
  }, [initializeProfileData]);

  return <ResponsiveDrawer />;
}

export default ProfilePage;
