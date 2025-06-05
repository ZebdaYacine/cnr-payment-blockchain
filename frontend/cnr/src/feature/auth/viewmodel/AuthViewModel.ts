import { LoginResponse, ErrorResponse } from "../../../services/model/auth";
import { useMutation } from "@tanstack/react-query";
import { AuthUseCase } from "../domain/UseCases/AuthUseCase";
import { useAuth } from "../../../core/state/AuthContext";
import { useUser } from "../../../core/state/UserContext";
import { useNotification } from "../../../services/useNotification";

export function useAuthViewModel(useCase: AuthUseCase) {
  const { Userlogged } = useAuth();
  const { SetUser } = useUser();
  const { success, error: showError } = useNotification();

  const login = useMutation({
    mutationFn: async ({
      username,
      password,
    }: {
      username: string;
      password: string;
    }) => {
      return await useCase.login(username, password);
    },
    onSuccess: (data: LoginResponse | ErrorResponse) => {
      if ("data" in data && data.data.token) {
        const token = data.data.token;
        Userlogged(token);
        const userData = data.data.userdata;
        SetUser({
          id: userData.id,
          username: userData.username,
          email: userData.email,
          permission: userData.permission,
          workAt: userData.workAt,
          idInstituion: userData.idInstituion,
        });
        success("Connexion réussie", "colored");
      } else {
        showError(data.message || "Une erreur est survenue", "colored");
      }
    },
    onError: (error: Error) => {
      showError(error.message || "Une erreur est survenue", "colored");
    },
  });

  const register = useMutation({
    mutationFn: async ({
      fname,
      lname,
      email,
      password,
      org,
      wilaya,
    }: {
      fname: string;
      lname: string;
      email: string;
      password: string;
      org: string;
      wilaya: string;
    }) => {
      if (org === "dio" || org === "dof" || org === "post") {
        wilaya = "Alger";
      }
      return await useCase.register(
        fname,
        lname,
        email,
        password,
        org.toUpperCase(),
        wilaya
      );
    },
    onSuccess: (data: LoginResponse | ErrorResponse) => {
      if ("data" in data) {
        // const token = data.data.token;
        // Userlogged(token);
        // const userData = data.data.userdata;
        // SetUser({
        //   id: userData.id,
        //   username: userData.username,
        //   email: userData.email,
        //   permission: userData.permission,
        //   workAt: userData.workAt,
        //   idInstituion: userData.idInstituion,
        // });
        success("Inscription réussie verifier votre boit mail", "colored");
      } else {
        showError(data.message || "Une erreur est survenue", "colored");
      }
    },
    onError: (error: Error) => {
      showError(error.message || "Une erreur est survenue", "colored");
    },
  });

  const forgetPassword = useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      return await useCase.forgetPassword(email);
    },
    onSuccess: (data: LoginResponse | ErrorResponse) => {
      if (data.message) {
        success(data.message, "colored");
      } else {
        showError("Une erreur est survenue", "colored");
      }
    },
    onError: (error: Error) => {
      showError(error.message || "Une erreur est survenue", "colored");
    },
  });

  return {
    login,
    register,
    forgetPassword,
    isPending:
      login.isPending || register.isPending || forgetPassword.isPending,
    isSuccess:
      login.isSuccess || register.isSuccess || forgetPassword.isSuccess,
    isError: login.isError || register.isError || forgetPassword.isError,
  };
}
