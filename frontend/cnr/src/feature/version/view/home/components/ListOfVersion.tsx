import { VersionData } from "../../../data/dtos/VersionsDtos";
import VersionUploadModal from "./VersionUploadModal";

interface ListOfVersionProps {
  version: VersionData[];
}
function ListOfVersion({ version: version }: ListOfVersionProps) {
  const displayVersionModal = () => {
    const modal = document.getElementById("version") as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
  };
  return (
    <>
      <div className="card bg-base-300 shadow-xl m-2">
        <div className="card-body">
          <div className="flex flex-row justify-between">
            <h2 className="card-title text-center">List of Versions:</h2>
            <button className="btn btn-accent" onClick={displayVersionModal}>
              Add new Version
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="table  sm:table-sm">
              <thead>
                <tr>
                  <th className="text-center">ID</th>
                  <th className="text-center">File</th>
                  <th className="text-center">User</th>
                  <th className="text-center">Time</th>
                  <th className="text-center">Status</th>
                  <th className="text-center">Version</th>
                </tr>
              </thead>
              <tbody>
                {version.map((version) => (
                  <tr key={version.ID} className="cursor-pointer hover">
                    <td className="text-center">{version.ID}</td>
                    <td className="text-center">{version.FileName}</td>
                    <td className="text-center">{version.UserID}</td>
                    <td className="text-center">{version.Time}</td>
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
                    <td className="text-center">{version.Note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <VersionUploadModal />
    </>
  );
}

export default ListOfVersion;
