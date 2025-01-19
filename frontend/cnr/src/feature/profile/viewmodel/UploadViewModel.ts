import { useMutation } from "@tanstack/react-query";
import { PofileUseCase } from "../domain/usecase/ProfileUseCase";

function convertFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

export function useUplaodViewModel(pofileUseCase: PofileUseCase) {
  const { mutate, isPending, isSuccess, isError } = useMutation({
    mutationFn: async ({ file }: { file: File }) => {
      const base64File = await convertFileToBase64(file);
      return pofileUseCase.execute(base64File);
    },
  });

  return {
    upload: mutate, 
    isPending,
    isSuccess,
    isError,
  };
}
