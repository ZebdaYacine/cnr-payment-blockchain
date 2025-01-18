import {  ErrorResponse, LoginResponse } from '../../../services/model/login';
import { useMutation } from "@tanstack/react-query";
import { LoginUseCase } from "../domain/UseCases/AuthUseCase";
import { useAuth } from '../../../core/state/AuthContext';



export function useAuthViewModel(loginUseCase: LoginUseCase) {
  const { Userlogged } = useAuth();
  
  const { mutate, data, isPending, isError, isSuccess } = useMutation({
    mutationFn: ({ username, password }: { username: string; password: string }) =>
      loginUseCase.execute(username, password),

    onError:()=>{
      const errorResponse = data as ErrorResponse;
      console.error("Server response (LoginResponse):", errorResponse.message);
    },

    onSuccess: (data) => {
      const resp=data as LoginResponse;
      console.log("Token:", resp.data.token);
      console.log("User Data:", resp.data.userdata);
      Userlogged(resp.data.token)
    },
    
  });
  return {
    login: mutate,
    token: data,
    isPending:isPending,
    isError:isError,
    isSuccess:isSuccess,
  };
}
