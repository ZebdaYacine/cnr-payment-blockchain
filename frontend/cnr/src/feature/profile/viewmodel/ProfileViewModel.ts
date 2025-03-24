import { PhaseResponse, UsersResponse } from "./../data/dtos/ProfileDtos";
import { useMutation } from "@tanstack/react-query";
import { useNotification } from "../../../services/useNotification";
import { PofileUseCase } from "../domain/usecase/ProfileUseCase";
import { ProfileResponse } from "../data/dtos/ProfileDtos";
import { useNavigate } from "react-router";
import { User } from "../../../core/dtos/data";
import { useUserId } from "../../../core/state/UserContext";

import { useListUsers } from "../../../core/state/ListOfUsersContext";
import { usePhaseId } from "../../../core/state/PhaseContext";
import { GetAuthToken } from "../../../services/Http";

export function useProfileViewModel(profileUseCase: PofileUseCase) {
  const navigate = useNavigate();
  const { error } = useNotification();
  const { setUsersList } = useListUsers();
  const { SetCurrentPhase } = usePhaseId();

  const {
    SetWilaya,
    SetUserId,
    SetUsername,
    SetEmail,
    SetPermission,
    SetType,
    SetWorkAt,
    SetidInstituion,
    SetPhases,
    permission,
  } = useUserId();

  const {
    mutate: getProfile,
    data: Profile,
    isPending: isProfileLoading,
    isSuccess: isProfileSuccess,
  } = useMutation({
    mutationFn: async ({ permission: permission }: { permission: string }) => {
      const storedToken = GetAuthToken(navigate);
      return profileUseCase.GetProfile(storedToken, permission.toLowerCase());
    },
    onSuccess: (data) => {
      if (data && "data" in data) {
        const resp = data as ProfileResponse;
        const userData = resp.data as User;
        if (userData) {
          console.log("Profile fetched:", userData);
          SetUsername(userData.username);
          SetUserId(userData.id);
          SetWilaya(userData.wilaya);
          SetEmail(userData.email);
          SetPermission(userData.permission);
          SetWorkAt(userData.workAt);
          SetType(userData.type);
          SetidInstituion(userData.idInstituion);
          SetPhases(userData.phases);
        }
      }
    },
    onError: (err: unknown) => {
      console.error("GET PROFILE error:", err);
      navigate("/error-page");
      error(
        "An error occurred during the upload. Please try again.",
        "colored"
      );
    },
  });

  const {
    mutate: GetUsers,
    data: users,
    isPending: isUserLoading,
    isSuccess: isUsersSuccss,
    isError: isError,
  } = useMutation({
    mutationFn: async ({
      permissions: permissions,
    }: {
      permissions: string;
    }) => {
      const storedToken = GetAuthToken(navigate);
      return await profileUseCase.GetUsers(storedToken, permissions);
    },

    onSuccess: (data) => {
      if (data && "data" in data) {
        const resp = data as UsersResponse;
        const users = resp.data as User[];
        console.log(users);
        setUsersList(users);
      }
    },
    onError: (err) => {
      const errorMessage =
        err instanceof Error
          ? err.message.includes("Error unknown: Unknown error")
            ? "Cannot connect to the server. Please check your internet or try again later."
            : err.message
          : "An unknown error occurred while fetching users.";

      error(errorMessage, "colored");
    },
  });

  const {
    mutate: getCurrentPhase,
    data: currentPhase,
    isPending: isPhaseLoading,
    isSuccess: isPhaseSuccess,
  } = useMutation({
    mutationFn: async () => {
      const storedToken = GetAuthToken(navigate);
      return profileUseCase.GetCurrentPhase(
        storedToken,
        permission.toLowerCase()
      );
    },
    onSuccess: (data) => {
      if (data && "data" in data) {
        const phase = data.data as PhaseResponse;
        if (phase) {
          SetCurrentPhase(phase);
        }
      }
    },
    onError: (err: unknown) => {
      console.error("GET CURRENT PHASE error:", err);
      error(
        "An error occurred while fetching the current phase. Please try again.",
        "colored"
      );
    },
  });

  return {
    getProfile,
    isProfileLoading,
    isProfileSuccess,
    Profile,

    GetUsers,
    users,
    isUserLoading,
    isUsersSuccss,
    isError,

    getCurrentPhase,
    currentPhase,
    isPhaseLoading,
    isPhaseSuccess,
  };
}
