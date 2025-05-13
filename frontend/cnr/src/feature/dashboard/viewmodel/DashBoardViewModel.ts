import { useMutation } from "@tanstack/react-query";
import { useNotification } from "../../../services/useNotification";
import { GetAuthToken } from "../../../services/Http";
import { useNavigate } from "react-router";

import { DashBoardUseCase } from "../domain/usecase/DashBoardUseCase";

export function useDashBoardViewModel(dashboardUseCase: DashBoardUseCase) {
  const { error } = useNotification();
  const navigate = useNavigate();
  const {
    mutate: getUploadinfFilesPKI,
    data: PKI1Metadata,
    isPending: isPending,
    isSuccess: isSuccess,
    isError: isError,
  } = useMutation({
    mutationFn: async ({ permission }: { permission: string }) => {
      const storedToken = GetAuthToken(navigate);
      return dashboardUseCase.GetUplaodFilesPKI(storedToken, permission);
    },
    onSuccess: (data) => {
      if (data) console.log("PKI1 LOADED SUCCEFULY...");
      else {
        error(
          "An error occurred during download. Please try again.",
          "colored"
        );
      }
    },
    onError: (err: unknown) => {
      console.error("Download error:", err);
      error("An error occurred during download. Please try again.", "colored");
    },
  });
  return {
    getUploadinfFilesPKI: getUploadinfFilesPKI,
    PKI1Metadata: PKI1Metadata,
    isPending: isPending,
    isSuccess: isSuccess,
    isError: isError,
  };
}
