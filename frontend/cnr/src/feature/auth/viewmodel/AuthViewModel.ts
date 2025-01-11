import { useMutation } from "@tanstack/react-query";
import { LoginUseCase } from "../domain/UseCases/AuthUseCase";

export const useAuthViewModel = (loginUseCase: LoginUseCase) => {
  const { mutate, data, isPending, isError, isSuccess } = useMutation({
    mutationFn: ({ username, password }: { username: string; password: string }) =>
      loginUseCase.execute(username, password),
  });

  
 
  return {
    login: mutate,
    token: data,
    isPending,
    isError,
    isSuccess,
  };
};
