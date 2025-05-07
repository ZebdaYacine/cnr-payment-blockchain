import { useEffect, useCallback } from "react";
import { ProfileDataSourceImpl } from "../../../data/dataSource/ProfileAPIDataSource";
import { ProfileRepositoryImpl } from "../../../data/repository/ProfileRepositoryImpl";
import { PofileUseCase } from "../../../domain/usecase/ProfileUseCase";
import { useProfileViewModel } from "../../../viewmodel/ProfileViewModel";

import { useUser } from "../../../../../core/state/UserContext";
import SchedulerGrid from "../../../../../core/components/SchedulerComponent";

function SchedulerPage() {
  const profileUseCase = new PofileUseCase(
    new ProfileRepositoryImpl(new ProfileDataSourceImpl())
  );

  const { getProfile, GetUsers } = useProfileViewModel(profileUseCase);
  const { userSaved } = useUser();

  const initializeScheduler = useCallback(() => {
    if (userSaved.permission) {
      const permission = userSaved.permission.toLowerCase();
      getProfile({ permission });
      GetUsers({ permissions: permission });
    }
  }, [userSaved.permission, getProfile, GetUsers]);

  useEffect(() => {
    initializeScheduler();
  }, [initializeScheduler]);

  return (
    <>
      {/* <NavBarComponent user={userSaved} /> */}
      <SchedulerGrid />
    </>
  );
}

export default SchedulerPage;
