import { useState } from "react";
import { VersionData } from "../../../data/dtos/VersionsDtos";
import VersionUploadModal from "./VersionUploadModal";

interface ListOfVersionProps {
  version: VersionData[];
}
function ListOfVersion({ version: version }: ListOfVersionProps) {
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
  return (
    <>
      <div className="card bg-base-100  m-2 h-full">
        <div className="card-body">
          <div className="flex flex-wrap justify-between">
            <h2 className="card-title text-center">List of Versions:</h2>
            <button className="btn btn-accent" onClick={displayVersionModal}>
              Ajouter une version
            </button>
          </div>
          <table className="table  sm:overflow-x-auto sm:table-sm w-full">
            <thead>
              <tr>
                <th className="text-center">ID</th>
                <th className="text-center">Fichier</th>
                <th className="text-center">Utilisateur</th>
                <th className="text-center">Temps</th>
                <th className="text-center">Version</th>
              </tr>
            </thead>
            <tbody>
              {paginatedVersions.map((version) => (
                <tr key={version.ID} className="cursor-pointer hover">
                  <td className="text-center">{version.ID}</td>
                  <td className="text-center">{version.FileName}</td>
                  <td className="text-center">{version.UserID}</td>
                  <td className="text-center">
                    <div className="badge badge-primary">{version.Time}</div>
                  </td>
                  <td className="flex justify-center">
                    <div className="badge badge-accent">
                      Veriosn -{version.Note}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
