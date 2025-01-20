import { LoginResponse } from '../../../services/model/auth';
import { useMutation } from "@tanstack/react-query";
import { LoginUseCase } from "../domain/UseCases/AuthUseCase";
import { useAuth } from '../../../core/state/AuthContext';
import { useNotification } from '../../../services/useNotification';

export function useAuthViewModel(loginUseCase: LoginUseCase) {
  const { Userlogged } = useAuth();
  const { error } = useNotification();

  const { mutate,isPending, isSuccess, isError } = useMutation({
    mutationFn: ({ username, password }: { username: string; password: string }) =>
      loginUseCase.execute(username, password),

    onSuccess: (data) => {
      if (data) {
        if ('data' in data) {
          const resp = data as LoginResponse;
          console.log("Token:", resp.data.token);
          console.log("User Data:", resp.data.userdata);
          Userlogged(resp.data.token);
        } else {
          if(data.message==""){
            error("Network error", "colored");
          }else
          error(data.message, "colored");
        }
      }
    },
    onError: (error) => {
      console.error("Network Error:", error);
    },
  });



  return {
    login: mutate,
    isPending: isPending,
    isSuccess: isSuccess,
    isError: isError,
  };
}
