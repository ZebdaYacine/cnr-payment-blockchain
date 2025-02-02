import { LoginResponse } from '../../../services/model/auth';
import { useMutation } from "@tanstack/react-query";
import { LoginUseCase } from "../domain/UseCases/AuthUseCase";
import { useAuth } from '../../../core/state/AuthContext';
import { useNotification } from '../../../services/useNotification';
import { ErrorResponse } from '../../../services/model/commun';
import { useUserId } from '../../../core/state/UserContext';

export function useAuthViewModel(loginUseCase: LoginUseCase) {
  const { Userlogged } = useAuth();
  const { error } = useNotification();
  const {SetUsername,SetEmail,SetPermission } = useUserId();
  

  const { mutate,isPending, isSuccess, isError } = useMutation({
    mutationFn: ({ username, password }: { username: string; password: string }) =>
      loginUseCase.execute(username, password),

    onSuccess: (data) => {
      if (data) {
        if (data && "data" in data) {
          const resp = data as LoginResponse;
          console.log("Token:", resp.data.token);
          console.log("User Data:", resp.data.userdata);
          Userlogged(resp.data.token);
          const userData=resp.data.userdata
          if(userData){
           SetUsername(userData?.username)
           SetEmail(userData?.email)
           SetPermission(userData?.permission)
          }
        } else {
          const errorResponse = data as ErrorResponse;
          error(errorResponse.message || "Network error occurred during login", "colored");
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
