import React, { Suspense, useMemo, useState } from "react";
import ChartLoader from "./ChartLoader";

const RadarProfileChart = React.lazy(() => import("./RadarProfileChart"));

interface FileDetail {
  nom: string;
  date: string;
  institution: string;
}

interface HackingData {
  phase: string;
  version: number;
  fichiers: number;
  fichiersInvalides: number;
  dossiers: number;
  institutions: string[];
  fichiersDetails: FileDetail[];
}

interface InvalidFilesCardProps {
  data: HackingData[];
}

export default function InvalidFilesCard({ data }: InvalidFilesCardProps) {
  const [selectedPhase, setSelectedPhase] = useState(data[0]?.phase || "");
  const [showModal, setShowModal] = useState(false);

  const phaseOptions = useMemo(() => {
    return [...new Set(data.map((item) => item.phase))];
  }, [data]);

  const filteredData = useMemo(() => {
    if (!data || data.length === 0) return [];
    return data.filter((item) => item.phase === selectedPhase);
  }, [selectedPhase, data]);

  const chartData = useMemo(() => {
    if (filteredData.length === 1) {
      const item = filteredData[0];
      return [
        { metric: "Version", value: item.version },
        { metric: "Fichiers", value: item.fichiers },
        { metric: "Invalides", value: item.fichiersInvalides },
        {
          metric: "Erreur (%)",
          value: parseFloat(((item.version / item.fichiers) * 100).toFixed(2)),
        },
        { metric: "Dossier", value: item.dossiers },
      ];
    }

    // Default data when no specific phase is selected
    return [
      { metric: "Version", value: 0 },
      { metric: "Fichiers", value: 0 },
      { metric: "Invalides", value: 0 },
      { metric: "Erreur (%)", value: 0 },
      { metric: "Dossier", value: 0 },
    ];
  }, [filteredData]);

  if (!data || data.length === 0) {
    return (
      <div className="card w-full max-w-sm shadow-xl mx-auto">
        <div className="card-body p-4">
          <p className="text-center text-gray-500">Aucune donnée disponible</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="card w-full max-w-sm shadow-xl hover:shadow-2xl hover:scale-105 transition-transform duration-300 cursor-pointer mx-auto">
        <div className="card-body p-4 space-y-4">
          <div className="form-control">
            <label className="label text-sm font-medium text-gray-600">
              Filtrer par phase
            </label>
            <select
              className="select select-bordered select-sm"
              value={selectedPhase}
              onChange={(e) => setSelectedPhase(e.target.value)}
            >
              {phaseOptions.map((phase) => (
                <option key={phase} value={phase}>
                  {phase}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full">
            <Suspense fallback={<ChartLoader />}>
              <RadarProfileChart data={chartData} />
            </Suspense>
          </div>

          {filteredData.length === 1 &&
            filteredData[0].fichiersInvalides > 0 && (
              <button
                onClick={() => setShowModal(true)}
                className="btn btn-error btn-sm w-full"
              >
                Voir fichiers invalides ({filteredData[0].fichiersInvalides})
              </button>
            )}
        </div>
      </div>

      {showModal && filteredData.length === 1 && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">
              Fichiers invalides - {filteredData[0].phase}
            </h2>
            <ul className="space-y-2 max-h-60 overflow-y-auto">
              {filteredData[0].fichiersDetails.map((file, index) => (
                <li
                  key={index}
                  className="border p-2 rounded bg-gray-50 text-sm"
                >
                  <strong>Nom :</strong> {file.nom} <br />
                  <strong>Heure :</strong> {file.date} <br />
                  <strong>Institution :</strong> {file.institution}
                </li>
              ))}
            </ul>
            <button
              onClick={() => setShowModal(false)}
              className="btn btn-sm btn-primary mt-4 w-full"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </>
  );
}
