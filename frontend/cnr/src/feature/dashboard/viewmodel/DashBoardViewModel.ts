/* eslint-disable @typescript-eslint/no-unused-vars */
import { GetAuthToken } from "../../../services/Http";
import { useNavigate } from "react-router";

import { DashBoardUseCase } from "../domain/usecase/DashBoardUseCase";
import { useNotification } from "../../../services/useNotification";
import { useMutation } from "@tanstack/react-query";

export const useDashBoardViewModel = (dashboardUseCase: DashBoardUseCase) => {
  const { error } = useNotification();
  const navigate = useNavigate();
  const {
    mutate: getUploadinfFilesPKI,
    data: PKI1Metadata,
    isPending: isPendingPKI1,
    isSuccess: isSuccessPKI1,
    isError: isErrorPKI1,
  } = useMutation({
    mutationFn: async ({ permission }: { permission: string }) => {
      const storedToken = GetAuthToken(navigate);
      return dashboardUseCase.GetUplaodFilesPKI(storedToken, permission);
    },
    onSuccess: (data) => {
      if (data) console.log("PKI1 LOADED SUCCEFULY...");
    },
    onError: (err: unknown) => {
      console.error("Download error:", err);
      error("An error occurred during download. Please try again.", "colored");
    },
  });

  const {
    mutate: getHackingTryPKI,
    data: hackingData,
    isPending: isHackingPending,
    isSuccess: isHackingSuccess,
    isError: isHackingError,
  } = useMutation({
    mutationFn: async ({ permission }: { permission: string }) => {
      const storedToken = GetAuthToken(navigate);
      return dashboardUseCase.HackingTryPKI(storedToken, permission);
    },
    onSuccess: (data) => {
      if (data) console.log("HACKING DATA LOADED SUCCESSFULLY...");
    },
    onError: (err: unknown) => {
      console.error("Hacking data error:", err);
    },
  });

  const {
    mutate: getWorkersErrorRatePKI,
    data: workersErrorRateData,
    isPending: isWorkersErrorRatePending,
    isSuccess: isWorkersErrorRateSuccess,
    isError: isWorkersErrorRateError,
  } = useMutation({
    mutationFn: async ({ permission }: { permission: string }) => {
      const storedToken = GetAuthToken(navigate);
      return dashboardUseCase.GetWorkersErrorRatePKI(storedToken, permission);
    },
    onSuccess: (data) => {
      if (data) console.log("WORKERS ERROR RATE DATA LOADED SUCCESSFULLY...");
    },
    onError: (err: unknown) => {
      console.error("Workers error rate data error:", err);
    },
  });

  return {
    getUploadinfFilesPKI,
    getHackingTryPKI,
    getWorkersErrorRatePKI,
    PKI1Metadata,
    hackingData,
    workersErrorRateData,
    isPending: isPendingPKI1 || isHackingPending || isWorkersErrorRatePending,
    isError: isErrorPKI1 && isHackingError && isWorkersErrorRateError,
    isSuccess: isSuccessPKI1 || isHackingSuccess || isWorkersErrorRateSuccess,
    errors: {
      uploadFilesError: isErrorPKI1,
      hackingError: isHackingError,
      workersErrorRateError: isWorkersErrorRateError,
    },
  };
};
