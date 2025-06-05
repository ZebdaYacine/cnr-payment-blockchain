import { useState } from "react";
import { VersionData } from "../../../data/dtos/VersionsDtos";
import VersionUploadModal from "./VersionUploadModal";
import { FileDataSourceImpl } from "../../../../file/data/dataSource/FileAPIDataSource";
import { FileRepositoryImpl } from "../../../../file/data/repository/FileRepositoryImpl";
import { FileUseCase } from "../../../../file/domain/usecase/FileUseCase";
import { useFileViewModel } from "../../../../file/viewmodel/FileViewModel";
import { useUser } from "../../../../../core/state/UserContext";
// import { Data } from "../../../../file/data/dtos/FileDtos";
import { useTypeTransaction } from "../../../../../core/state/TypeTransactionContext";
import { Data } from "../../../../file/data/dtos/FileDtos";

interface ListOfVersionProps {
  version: VersionData[];
}

function ListOfVersion({ version: versions }: ListOfVersionProps) {
  const ITEMS_PER_PAGE = 5;

  const [currentPage, setCurrentPage] = useState(1);
  const safeFolders = versions ?? [];
  const { targetType } = useTypeTransaction();
  const totalPages = Math.ceil(safeFolders.length / ITEMS_PER_PAGE);
  const paginatedVersions = safeFolders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const [checkedFiles, setCheckedFiles] = useState<VersionData[]>([]);

  const handleCheckboxChange = (file: VersionData, checked: boolean) => {
    if (checked) {
      setCheckedFiles([...checkedFiles, file]);
    } else setCheckedFiles(checkedFiles.filter((f) => f.ID !== file.ID));
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const newFiles = versions.filter(
        (file) => !checkedFiles.some((f) => f.ID === file.ID)
      );
      const d = newFiles.filter(
        (file) => !checkedFiles.some(() => file.Status === "Invalid")
      );
      setCheckedFiles([...checkedFiles, ...d]);
    } else {
      const remaining = checkedFiles.filter(
        (f) => !versions.some((version) => version.ID === f.ID)
      );
      setCheckedFiles(remaining);
    }
  };

  const fileDataSource = new FileDataSourceImpl();
  const fileRepository = new FileRepositoryImpl(fileDataSource);
  const fileUseCase = new FileUseCase(fileRepository);
  const { downloadFiles, isDownloading } = useFileViewModel(fileUseCase);
  const { userSaved } = useUser();
  const userPermission = userSaved.permission;
  const displayVersionModal = () => {
    const modal = document.getElementById("version") as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
  };
  // const convertVersionToData = (versions: VersionData[]): Data[] => {
  //   return versions.map((v) => ({
  //     ID: v.ID,
  //     FileName: v.FileName,
  //     HashFile: v.HashFile,
  //     Time: v.Time,
  //     Status: v.Status,
  //     Version: Number(v.Version),
  //     LastVersion: Number(v.LastVersion),
  //     reciverId: v.UserID,
  //     Organisation: v.Organisation,
  //     path: v.Path,
  //   }));
  // };

  const downloadVerions = () => {
    const convertedFiles = checkedFiles.map((file) => ({
      ID: file.ID,
      FileName: file.FileName,
      HashFile: file.HashFile,
      Time: file.Time,
      Status: file.Status,
      Version: file.Version,
      LastVersion: file.LastVersion,
      reciverId: file.UserID,
      Organisation: file.Organisation,
      path: file.Path,
      TaggedUsers: [],
    }));

    downloadFiles({
      files: convertedFiles as Data[],
      permission: userPermission.toLowerCase(),
    });
  };

  function handleDateTime(dateTime: Date): string {
    const formattedTime = dateTime.toLocaleString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    return formattedTime;
  }

  return (
    <>
      <div className="card bg-base-100 m-2 h-full">
        <div className="card-body p-4 sm:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <h2 className="card-title text-lg sm:text-xl text-center sm:text-left">
                List des Versions :{" "}
                <span className="text-wrap badge badge-primary">
                  {versions[0]?.LastVersion}
                </span>
              </h2>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {checkedFiles.length > 0 && (
                <label className="flex items-center gap-2 cursor-pointer hover:bg-base-200 p-2 rounded-lg transition-all duration-200">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary"
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                  <span className="text-sm font-medium whitespace-nowrap">
                    Selectionner Tous
                  </span>
                </label>
              )}
              {targetType === "IN" && (
                <button
                  className="btn btn-accent gap-2 w-full sm:w-auto"
                  onClick={
                    checkedFiles.length > 0
                      ? downloadVerions
                      : displayVersionModal
                  }
                >
                  {checkedFiles.length > 0 ? (
                    <>
                      {isDownloading ? (
                        <span className="loading loading-spinner loading-sm"></span>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                          />
                        </svg>
                      )}
                      <span className="whitespace-nowrap">
                        {isDownloading
                          ? `Téléchargement de ${checkedFiles.length} fichier${
                              checkedFiles.length > 1 ? "s" : ""
                            }...`
                          : `Télécharger ${checkedFiles.length} fichier${
                              checkedFiles.length > 1 ? "s" : ""
                            }`}
                      </span>
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      <span className="whitespace-nowrap">
                        Ajouter une version
                      </span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Table container with horizontal scroll on small screens */}
          <div className="overflow-x-auto mt-4 rounded-lg border border-base-200">
            <table className="table table-zebra w-full text-sm">
              <thead className="bg-base-200/50">
                <tr>
                  <th className="text-center"></th>
                  <th className="text-center hidden sm:table-cell">ID</th>
                  <th className="text-center">Fichier</th>
                  <th className="text-center hidden sm:table-cell">
                    Utilisateur
                  </th>
                  <th className="text-center">Temps</th>
                  <th className="text-center">Status</th>
                  <th className="text-center">Version</th>
                </tr>
              </thead>
              <tbody>
                {paginatedVersions.map((version) => (
                  <tr
                    key={version.ID}
                    className="cursor-pointer hover:bg-base-200/50 transition-colors duration-200"
                  >
                    <td className="text-center">
                      {version.Status === "Valid" ? (
                        <input
                          id={version.ID}
                          type="checkbox"
                          className="checkbox checkbox-primary"
                          checked={checkedFiles.some(
                            (f) => f.ID === version.ID
                          )}
                          onChange={(e) =>
                            handleCheckboxChange(version, e.target.checked)
                          }
                        />
                      ) : (
                        ""
                      )}
                    </td>
                    <td className="text-center hidden sm:table-cell font-mono text-xs">
                      {version.ID}
                    </td>
                    <td className="text-center break-all hover:text-primary transition-colors duration-200">
                      {version.FileName}
                    </td>
                    <td className="text-center hidden sm:table-cell">
                      {version.UserID}
                    </td>
                    <td className="text-center">
                      <div className="badge badge-primary whitespace-nowrap">
                        {handleDateTime(new Date(version.Time))}
                      </div>
                    </td>
                    <td className="text-center">
                      <div
                        className={`badge ${
                          version.Status === "Valid"
                            ? "bg-green-100 text-green-950"
                            : "bg-red-100 text-red-950"
                        }`}
                      >
                        {version.Status}
                      </div>
                    </td>
                    <td className="text-center">
                      <div className="badge badge-primary">
                        <b>V{version.Version}</b>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-4">
            <div className="join">
              <button
                className="join-item btn btn-sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                «
              </button>
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  className={`join-item btn btn-sm ${
                    currentPage === index + 1 ? "btn-active" : ""
                  }`}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
              <button
                className="join-item btn btn-sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                »
              </button>
            </div>
          </div>
        </div>
      </div>

      <VersionUploadModal />
    </>
  );
}

export default ListOfVersion;
