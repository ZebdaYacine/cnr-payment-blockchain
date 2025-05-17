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
      Version: Number(file.Version),
      LastVersion: Number(file.LastVersion),
      reciverId: file.UserID,
      Organisation: file.Organisation,
      path: file.Path,
      TaggedUsers: [],
    }));

    downloadFiles({
      files: convertedFiles,
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
        <div className="card-body">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="card-title text-lg sm:text-xl text-center sm:text-left">
              List des Versions :{" "}
              <span className="text-wrap">{versions[0]?.LastVersion}</span>
            </h2>
            <div className="flex space-x-4">
              <>
                {checkedFiles.length > 0 ? (
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="checkbox"
                      onChange={(e) => handleSelectAll(e.target.checked)}
                    />
                    <span>Selectionner Tous</span>
                  </label>
                ) : (
                  ""
                )}
                {targetType === "IN" && (
                  <button
                    className="btn btn-accent self-center sm:self-auto"
                    onClick={
                      checkedFiles.length > 0
                        ? downloadVerions
                        : displayVersionModal
                    }
                  >
                    {checkedFiles.length > 0
                      ? isDownloading
                        ? `Téléchargement de ${checkedFiles.length} fichier${
                            checkedFiles.length > 1 ? "s" : ""
                          }...`
                        : `Téléchargement ${checkedFiles.length} fichier${
                            checkedFiles.length > 1 ? "s" : ""
                          }`
                      : "Ajouter une version"}
                  </button>
                )}
              </>
            </div>
          </div>

          {/* Table container with horizontal scroll on small screens */}
          <div className="overflow-x-auto mt-4">
            <table className="table table-zebra w-full text-sm">
              <thead>
                <tr>
                  <th className="text-center"></th>
                  <th className="text-center">ID</th>
                  <th className="text-center">Fichier</th>
                  <th className="text-center">Utilisateur</th>
                  <th className="text-center">Temps</th>
                  <th className="text-center">Status</th>
                  <th className="text-center">Version actuelle</th>
                </tr>
              </thead>
              <tbody>
                {paginatedVersions.map((version) => (
                  <tr key={version.ID} className="cursor-pointer hover">
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
                    <td className="text-center">{version.ID}</td>
                    <td className="text-center break-all">
                      {version.FileName}
                    </td>
                    <td className="text-center">{version.UserID}</td>
                    <td className="text-center">
                      <div className="badge  badge-primary ">
                        {handleDateTime(new Date(version.Time))}
                      </div>
                    </td>
                    <td className="text-center">
                      <div
                        className={`badge ${
                          version.Status === "Valid"
                            ? "badge-accent"
                            : "badge-secondary"
                        }`}
                      >
                        {version.Status}
                      </div>
                    </td>
                    <td className="text-center">
                      <div className="badge badge-accent">
                        <b>Version - {version.Version}</b>
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
                className="join-item btn"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                «
              </button>
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  className={`join-item btn ${
                    currentPage === index + 1 ? "btn-active" : ""
                  }`}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
              <button
                className="join-item btn"
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
