import React, { Suspense, useEffect, useMemo } from "react";
import ChartLoader from "../components/ChartLoader";
import { useDashBoardViewModel } from "../../viewmodel/DashBoardViewModel";
import { DashBoardUseCase } from "../../domain/usecase/DashBoardUseCase";
import { DashBoardRepositoryImpl } from "../../data/repository/DashBoardRepositoryImpl";
import { DashBoardDataSourceImpl } from "../../data/dataSource/DashBoardAPIDataSource";
import CarteChargementFichiers from "../components/CarteLoadingFiles";
import {
  PKI1Response,
  HackingTryPKIResponse,
} from "../../data/dtos/DashBoardDtos";
import { useUser } from "../../../../core/state/UserContext";

const InvalidFilesCard = React.lazy(
  () => import("../components/InvalidFilesCard")
);
const Users = React.lazy(() => import("../components/Users"));

export default function DashboardPage() {
  const { userSaved } = useUser();
  const dashboardUseCase = useMemo(
    () =>
      new DashBoardUseCase(
        new DashBoardRepositoryImpl(new DashBoardDataSourceImpl())
      ),
    []
  );

  const {
    getUploadinfFilesPKI,
    getHackingTryPKI,
    PKI1Metadata,
    hackingData,
    isPending,
    isError,
    isSuccess,
  } = useDashBoardViewModel(dashboardUseCase);

  useEffect(() => {
    const permission = userSaved.permission.toLowerCase();
    getUploadinfFilesPKI({ permission });
    getHackingTryPKI({ permission });
  }, [getUploadinfFilesPKI, getHackingTryPKI, userSaved.permission]);

  const monthMap: Record<string, string> = {
    January: "Janvier",
    February: "Février",
    March: "Mars",
    April: "Avril",
    May: "Mai",
    June: "Juin",
    July: "Juillet",
    August: "Août",
    September: "Septembre",
    October: "Octobre",
    November: "Novembre",
    December: "Décembre",
  };

  const formattedData = useMemo(() => {
    if (!isSuccess || !PKI1Metadata || typeof PKI1Metadata !== "object")
      return [];

    const response = PKI1Metadata as PKI1Response;

    if (!Array.isArray(response.data)) return [];

    return response.data.map((item) => ({
      jour: item.day,
      mois: monthMap[item.month] || item.month,
      fichiers: item.file,
      versions: item.version,
      institution: item.institutions.map((inst) => ({
        nom: inst.name,
        fichiers: inst.file,
        versions: inst.version,
      })),
    }));
  }, [PKI1Metadata, isSuccess, monthMap]);

  const formattedHackingData = useMemo(() => {
    if (!isSuccess || !hackingData || typeof hackingData !== "object")
      return [];

    const response = hackingData as HackingTryPKIResponse;

    if (!Array.isArray(response.data)) return [];

    return response.data.map((item) => ({
      phase: item.phase,
      version: item.version,
      fichiers: item.files_number,
      fichiersInvalides: item.invalid_files,
      dossiers: item.folder,
      institutions: item.institutions,
      fichiersDetails: item.files.map((file) => ({
        nom: file.file,
        date: file.time,
        institution: file.institution,
      })),
    }));
  }, [hackingData, isSuccess]);

  return (
    <div className="flex flex-col space-y-4">
      <div className="relative min-h-[250px]">
        <Suspense fallback={<ChartLoader />}>
          {isPending ? (
            <ChartLoader />
          ) : isError ? (
            <div className="text-red-600 text-center p-4 bg-red-100 rounded shadow">
              ❌ Une erreur est survenue lors du chargement des fichiers.
            </div>
          ) : formattedData.length > 0 ? (
            <CarteChargementFichiers data={formattedData} />
          ) : (
            <div className="text-gray-600 text-center p-4 bg-gray-100 rounded shadow">
              Aucune donnée disponible.
            </div>
          )}
        </Suspense>
      </div>

      <div className="flex flex-col lg:flex-row lg:space-x-4 space-y-4 lg:space-y-0">
        <Suspense fallback={<ChartLoader />}>
          <Users />
        </Suspense>
        <div className="flex flex-col space-y-4 w-full">
          <Suspense fallback={<ChartLoader />}>
            <InvalidFilesCard data={formattedHackingData} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
