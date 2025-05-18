/* eslint-disable @typescript-eslint/no-unused-vars */
import { GetAuthToken } from "../../../services/Http";
import { useNavigate } from "react-router";
import { useState } from "react";

import { DashBoardUseCase } from "../domain/usecase/DashBoardUseCase";
import { useNotification } from "../../../services/useNotification";
import { useMutation } from "@tanstack/react-query";

export const useDashBoardViewModel = (dashboardUseCase: DashBoardUseCase) => {
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
      else {
        error(
          "An error occurred while loading hacking data. Please try again.",
          "colored"
        );
      }
    },
    onError: (err: unknown) => {
      console.error("Hacking data error:", err);
      error(
        "An error occurred while loading hacking data. Please try again.",
        "colored"
      );
    },
  });

  return {
    getUploadinfFilesPKI,
    getHackingTryPKI,
    PKI1Metadata,
    hackingData,
    isPending: isPending || isHackingPending,
    isError: isError || isHackingError,
    isSuccess: isSuccess || isHackingSuccess,
  };
};
