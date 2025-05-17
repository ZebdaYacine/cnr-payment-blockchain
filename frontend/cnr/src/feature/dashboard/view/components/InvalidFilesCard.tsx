import React, { Suspense, useMemo, useState } from "react";
import ChartLoader from "./ChartLoader";

const RadarProfileChart = React.lazy(() => import("./RadarProfileChart"));

const sampleData = [
  {
    phase: "Phase 1",
    version: 12,
    files_number: 10,
    invalid_files: 2,
    folder: 5,
    institutions: ["CNAS Laghouat", "CNAS Algiers"],
    files: [
      {
        file: "doc1.pdf",
        time: "2025-05-01 10:00",
        institution: "CNAS Laghouat",
      },
      {
        file: "doc2.pdf",
        time: "2025-05-01 10:05",
        institution: "CNAS Algiers",
      },
    ],
  },
  {
    phase: "Phase 2",
    version: 8,
    files_number: 8,
    invalid_files: 1,
    folder: 4,
    institutions: ["CNAS Tlemcen"],
    files: [
      {
        file: "doc3.pdf",
        time: "2025-05-02 09:30",
        institution: "CNAS Tlemcen",
      },
    ],
  },
];

const phaseOptions = ["All", ...new Set(sampleData.map((item) => item.phase))];

export default function InvalidFilesCard() {
  const [selectedPhase, setSelectedPhase] = useState("All");
  const [showModal, setShowModal] = useState(false);

  const filteredData = useMemo(() => {
    return selectedPhase === "All"
      ? sampleData
      : sampleData.filter((item) => item.phase === selectedPhase);
  }, [selectedPhase]);

  const chartData = useMemo(() => {
    if (filteredData.length === 1) {
      const item = filteredData[0];
      return [
        { metric: "Version", value: item.version },
        { metric: "Fichiers", value: item.files_number },
        { metric: "Invalides", value: item.invalid_files },
        {
          metric: "Erreur (%)",
          value: parseFloat(
            ((item.invalid_files / item.files_number) * 100).toFixed(2)
          ),
        },
        { metric: "Dossier", value: item.folder },
      ];
    }

    return [
      { metric: "Version", value: 3 },
      { metric: "Fichiers", value: 5 },
      { metric: "Invalides", value: 11 },
      { metric: "Erreur (%)", value: 8 },
      { metric: "Dossier", value: 11 },
    ];
  }, [filteredData]);

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

          {filteredData.length === 1 && filteredData[0].invalid_files > 0 && (
            <button
              onClick={() => setShowModal(true)}
              className="btn btn-error btn-sm w-full"
            >
              Voir fichiers invalides ({filteredData[0].invalid_files})
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
              {filteredData[0].files.map((file, index) => (
                <li
                  key={index}
                  className="border p-2 rounded bg-gray-50 text-sm"
                >
                  <strong>Nom :</strong> {file.file} <br />
                  <strong>Heure :</strong> {file.time} <br />
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
