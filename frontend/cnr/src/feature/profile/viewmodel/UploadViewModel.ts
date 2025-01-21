import { useMutation } from "@tanstack/react-query";
import { PofileUseCase } from "../domain/usecase/ProfileUseCase";
import { UploadResponse } from "../../../services/model/auth";
import { ErrorResponse } from "../../../services/model/commun";
import { useNotification } from "../../../services/useNotification";

function convertFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

export function useUplaodViewModel(pofileUseCase: PofileUseCase) {
  const { error } = useNotification();
  const { mutate, isPending, isSuccess, isError } = useMutation({
    mutationFn: async ({ file }: { file: File }) => {
      const base64File = await convertFileToBase64(file);
      const filename=file.name
      const storedToken = localStorage.getItem("authToken");
      if(storedToken)
      return pofileUseCase.execute(filename,base64File,storedToken);
    },
    onSuccess: (data) => {
          if (data) {
            if ('data' in data) {
              const resp = data as UploadResponse;
              console.log("file:", resp.filename);
              console.log("url:", resp.url);
            } else {
              const d=data as ErrorResponse
              if(d.message==""){
                error("Network error", "colored");
              }else
              error(d.message, "colored");
            }
          }
        },
        onError: (error) => {
          console.error("Network Error:", error);
        },
  });

  return {
    upload: mutate, 
    isPending,
    isSuccess,
    isError,
  };
}
