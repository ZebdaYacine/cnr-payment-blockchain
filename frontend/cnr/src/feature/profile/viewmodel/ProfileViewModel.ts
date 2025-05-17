/* eslint-disable @typescript-eslint/no-explicit-any */
import { PhaseResponse, UsersResponse } from "./../data/dtos/ProfileDtos";
import { useMutation } from "@tanstack/react-query";
import { useNotification } from "../../../services/useNotification";
import { PofileUseCase } from "../domain/usecase/ProfileUseCase";
import { ProfileResponse } from "../data/dtos/ProfileDtos";
import { useNavigate } from "react-router";
import { User } from "../../../core/dtos/data";
import { useUser } from "../../../core/state/UserContext";

import { useListUsers } from "../../../core/state/ListOfUsersContext";
import { usePhaseId } from "../../../core/state/PhaseContext";
import { GetAuthToken } from "../../../services/Http";
import { useOTP } from "../../../core/state/OTPContext";
import { useKeys } from "../../../core/state/KeyContext";

export function useProfileViewModel(profileUseCase: PofileUseCase) {
  const navigate = useNavigate();
  const { error, success } = useNotification();
  const { setUsersList } = useListUsers();
  const { SetCurrentPhase } = usePhaseId();
  const { setOTPSent, setOTPConfirmed } = useOTP();

  const { userSaved, SetUser } = useUser();
  const { setIsDigitalSignatureConfirmed, setDigitalSignature } = useKeys();

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
          SetUser(userData);
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
        userSaved.permission.toLowerCase()
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
      // error(
      //   "An error occurred while fetching the current phase. Please try again.",
      //   "colored"
      // );
    },
  });

  const {
    mutate: addPk,
    data: rslt,
    isPending: isPKLoading,
    isSuccess: isPKSuccess,
    isError: isPKError,
  } = useMutation({
    mutationFn: async ({ pk }: { pk: string }) => {
      const storedToken = GetAuthToken(navigate);
      return profileUseCase.AddPk(
        storedToken,
        userSaved.permission.toLowerCase(),
        pk
      );
    },
    onSuccess: (data) => {
      if (
        typeof data === "object" &&
        "data" in data &&
        typeof data.data === "boolean" &&
        data.data === true
      ) {
        getProfile({ permission: userSaved.permission.toLowerCase() });
        success("Votre clé publique a été ajoutée avec succès.", "colored");
      } else {
        error("Clé invalide ou rejetée par le serveur.", "colored");
      }
    },
  });

  const {
    mutate: updateFirstLastName,
    isPending: isUpdatingName,
    isSuccess: isNameUpdateSuccess,
    isError: isNameUpdateError,
  } = useMutation({
    mutationFn: async ({
      firstName,
      lastName,
      avatar,
    }: {
      firstName: string;
      lastName: string;
      avatar: string | undefined;
    }) => {
      const storedToken = GetAuthToken(navigate);
      return profileUseCase.UpdateFirstLastName(
        storedToken,
        userSaved.permission.toLowerCase(),
        firstName,
        lastName,
        avatar
      );
    },
    onSuccess: (data) => {
      if (
        typeof data === "object" &&
        "data" in data &&
        typeof data.data === "boolean" &&
        data.data === true
      ) {
        getProfile({ permission: userSaved.permission.toLowerCase() });
        success("Votre nom a été mis à jour avec succès.", "colored");
      } else {
        error("Erreur lors de la mise à jour du nom.", "colored");
      }
    },
    onError: (err) => {
      const errorMessage =
        err instanceof Error
          ? err.message.includes("Error unknown: Unknown error")
            ? "Impossible de se connecter au serveur. Vérifiez votre connexion internet ou réessayez plus tard."
            : err.message
          : "Une erreur inconnue s'est produite lors de la mise à jour du nom.";

      error(errorMessage, "colored");
    },
  });

  const {
    mutate: updatePassword,
    isPending: isUpdatingPassword,
    isSuccess: isPasswordUpdateSuccess,
    isError: isPasswordUpdateError,
  } = useMutation({
    mutationFn: async ({
      oldPassword,
      newPassword,
    }: {
      oldPassword: string;
      newPassword: string;
    }) => {
      const storedToken = GetAuthToken(navigate);
      return profileUseCase.UpdatePassword(
        storedToken,
        userSaved.permission.toLowerCase(),
        oldPassword,
        newPassword
      );
    },
    onSuccess: (data) => {
      if (
        typeof data === "object" &&
        "data" in data &&
        typeof data.data === "boolean" &&
        data.data === true
      ) {
        success("Votre mot de passe a été mis à jour avec succès.", "colored");
      } else {
        error("Erreur lors de la mise à jour du mot de passe.", "colored");
      }
    },
    onError: (err) => {
      const errorMessage =
        err instanceof Error
          ? err.message.includes("Error unknown: Unknown error")
            ? "Impossible de se connecter au serveur. Vérifiez votre connexion internet ou réessayez plus tard."
            : err.message
          : "Une erreur inconnue s'est produite lors de la mise à jour du mot de passe.";

      error(errorMessage, "colored");
    },
  });

  const {
    mutate: sendOTP,
    isPending: isSendingOTP,
    isSuccess: isOTPSentSuccess,
    isError: isOTPSentError,
  } = useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      const storedToken = GetAuthToken(navigate);
      return profileUseCase.SendOTP(
        storedToken,
        // userSaved.permission.toLowerCase(),
        email
      );
    },
    onSuccess: (data) => {
      if (
        typeof data === "object" &&
        "data" in data &&
        typeof data.data === "boolean" &&
        data.data === true
      ) {
        setOTPSent(true);
        success("OTP envoyé avec succès.", "colored");
      } else {
        error("Erreur lors de l'envoi de l'OTP.", "colored");
      }
    },
    onError: (err) => {
      const errorMessage =
        err instanceof Error
          ? err.message.includes("Error unknown: Unknown error")
            ? "Impossible de se connecter au serveur. Vérifiez votre connexion internet ou réessayez plus tard."
            : err.message
          : "Une erreur inconnue s'est produite lors de l'envoi de l'OTP.";

      error(errorMessage, "colored");
    },
  });

  const {
    mutate: ConfirmOTP,
    isPending: isConfirmingOTP,
    isSuccess: isOTPCofirmedSuccess,
    isError: isOTPConfirmedError,
  } = useMutation({
    mutationFn: async ({ otp }: { otp: string }) => {
      const storedToken = GetAuthToken(navigate);
      return profileUseCase.ConfirmOTP(
        storedToken,
        // userSaved.permission.toLowerCase(),
        otp
      );
    },
    onSuccess: (data) => {
      if (
        typeof data === "object" &&
        "data" in data &&
        typeof data.data === "boolean" &&
        data.data === true
      ) {
        setOTPConfirmed(true);
      } else {
        setOTPConfirmed(false);
        error("OTP INCCORECT ", "colored");
      }
    },
    onError: (err) => {
      setOTPSent(false);
      error(err.message, "colored");
    },
  });

  const {
    mutate: verifySignature,
    isPending: isVerifyingSignature,
    isSuccess: isSignatureVerified,
    isError: isSignatureVerificationError,
  } = useMutation({
    mutationFn: async ({
      signature,
      randomValue,
    }: {
      signature: string;
      randomValue: string;
    }) => {
      const storedToken = GetAuthToken(navigate);
      return profileUseCase.VerifySignature(
        storedToken,
        userSaved.permission.toLowerCase(),
        signature,
        randomValue
      );
    },
    onSuccess: (data, variables) => {
      let isVerified = false;

      if (
        typeof data === "object" &&
        data !== null &&
        "data" in data &&
        typeof (data as any).data?.Data === "boolean"
      ) {
        isVerified = (data as any).data.Data === true;
      } else if (typeof data === "boolean") {
        isVerified = data === true;
      }

      console.log(">>>>>>>>>>>>>>>>>>> isVerified:", isVerified);

      if (isVerified) {
        setIsDigitalSignatureConfirmed(true);
        setDigitalSignature(variables.signature);
        success("votre signature est acceptee.", "colored");
      } else {
        setIsDigitalSignatureConfirmed(false);
        setDigitalSignature(variables.signature);
        error("votre signature n'est pas acceptee.", "colored");
      }
    },
    onError: (err) => {
      const errorMessage =
        err instanceof Error
          ? err.message.includes("Error unknown: Unknown error")
            ? "Impossible de se connecter au serveur. Vérifiez votre connexion internet ou réessayez plus tard."
            : err.message
          : "Une erreur inconnue s'est produite lors de la vérification de la signature.";
      setIsDigitalSignatureConfirmed(false);
      error(errorMessage, "colored");
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

    addPk,
    rslt,
    isPKLoading,
    isPKSuccess,
    isPKError,

    updateFirstLastName,
    isUpdatingName,
    isNameUpdateSuccess,
    isNameUpdateError,

    updatePassword,
    isUpdatingPassword,
    isPasswordUpdateSuccess,
    isPasswordUpdateError,

    sendOTP,
    isSendingOTP,
    isOTPSentSuccess,
    isOTPSentError,

    ConfirmOTP,
    isConfirmingOTP,
    isOTPCofirmedSuccess,
    isOTPConfirmedError,

    verifySignature,
    isVerifyingSignature,
    isSignatureVerified,
    isSignatureVerificationError,
  };
}
