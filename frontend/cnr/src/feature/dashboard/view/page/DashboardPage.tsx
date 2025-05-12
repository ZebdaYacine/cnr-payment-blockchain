import React, { Suspense, useEffect, useMemo } from "react";
import ChartLoader from "../components/ChartLoader";
import { useDashBoardViewModel } from "../../viewmodel/DashBoardViewModel";
import { DashBoardUseCase } from "../../domain/usecase/DashBoardUseCase";
import { DashBoardRepositoryImpl } from "../../data/repository/DashBoardRepositoryImpl";
import { DashBoardDataSourceImpl } from "../../data/dataSource/DashBoardAPIDataSource";
import CarteChargementFichiers from "../components/CarteLoadingFiles";
import { PKI1Response } from "../../data/dtos/DashBoardDtos";

const InvalidFilesCard = React.lazy(
  () => import("../components/InvalidFilesCard")
);
const Users = React.lazy(() => import("../components/Users"));

export default function DashboardPage() {
  const dashboardUseCase = useMemo(
    () =>
      new DashBoardUseCase(
        new DashBoardRepositoryImpl(new DashBoardDataSourceImpl())
      ),
    []
  );

  const { getUploadinfFilesPKI, PKI1Metadata, isPending, isError, isSuccess } =
    useDashBoardViewModel(dashboardUseCase);

  useEffect(() => {
    getUploadinfFilesPKI({ permission: "admin" });
  }, [getUploadinfFilesPKI]);

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
      institution: item.institution,
    }));
  }, [PKI1Metadata, isSuccess]);

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
          ) : (
            <CarteChargementFichiers data={formattedData} />
          )}
        </Suspense>
      </div>

      <div className="flex flex-col lg:flex-row lg:space-x-4 space-y-4 lg:space-y-0">
        <Suspense fallback={<ChartLoader />}>
          <Users />
        </Suspense>
        <div className="flex flex-col space-y-4 w-full">
          <Suspense fallback={<ChartLoader />}>
            <InvalidFilesCard />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
