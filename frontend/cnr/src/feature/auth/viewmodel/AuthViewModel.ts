import { LoginResponse } from "../../../services/model/auth";
import { useMutation } from "@tanstack/react-query";
import { LoginUseCase } from "../domain/UseCases/AuthUseCase";
import { useAuth } from "../../../core/state/AuthContext";
import { useUser } from "../../../core/state/UserContext";
import { useNotification } from "../../../services/useNotification";

export function useAuthViewModel(loginUseCase: LoginUseCase) {
  const { Userlogged } = useAuth();
  const { SetUser } = useUser();
  const { success, error } = useNotification();

  const { mutate, isPending, isSuccess, isError } = useMutation({
    mutationFn: ({
      username: email,
      password,
    }: {
      username: string;
      password: string;
    }) => loginUseCase.execute(email, password),

    onSuccess: (data) => {
      if (data && "data" in data) {
        const resp = data as LoginResponse;
        Userlogged(resp.data.token);
        const userData = resp.data.userdata;

        SetUser({
          id: userData?.id,
          username: userData?.username,
          email: userData?.email,
          permission: userData?.permission,
          workAt: userData?.WorkAt,
          idInstituion: userData?.idInstituion,
        });
        success("Connexion réussie", "colored");
      } else if (data && "message" in data) {
        error(data.message, "colored");
      } else {
        error("server  deconnecter", "colored");
      }
    },

    onError: (err) => {
      console.error("Network Error:", err);
      error("Erreur réseau ou serveur injoignable.", "colored");
    },
  });

  return {
    login: mutate,
    isPending,
    isSuccess,
    isError,
  };
}
