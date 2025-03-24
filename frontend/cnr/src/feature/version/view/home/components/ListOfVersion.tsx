import { useState } from "react";
import { VersionData } from "../../../data/dtos/VersionsDtos";
import VersionUploadModal from "./VersionUploadModal";

interface ListOfVersionProps {
  version: VersionData[];
}

function ListOfVersion({ version }: ListOfVersionProps) {
  const ITEMS_PER_PAGE = 5;

  const [currentPage, setCurrentPage] = useState(1);
  const safeFolders = version ?? [];
  const totalPages = Math.ceil(safeFolders.length / ITEMS_PER_PAGE);
  const paginatedVersions = safeFolders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const displayVersionModal = () => {
    const modal = document.getElementById("version") as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
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
              List of Versions :{" "}
              <span className="text-wrap">{version[0]?.LastVersion}</span>
            </h2>
            <button
              className="btn btn-accent self-center sm:self-auto"
              onClick={displayVersionModal}
            >
              Ajouter une version
            </button>
          </div>

          {/* Table container with horizontal scroll on small screens */}
          <div className="overflow-x-auto mt-4">
            <table className="table table-zebra w-full text-sm">
              <thead>
                <tr>
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
                    <td className="text-center">{version.ID}</td>
                    <td className="text-center break-all">
                      {version.FileName}
                    </td>
                    <td className="text-center">{version.UserID}</td>
                    <td className="text-center">
                      <div className="badge  badge-primary">
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
