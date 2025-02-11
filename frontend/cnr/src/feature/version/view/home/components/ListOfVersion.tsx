import { Data } from "../../../data/dtos/ProfileDtos";
import FileUpload from "./FileUpload";

interface ListOfFilesProps {
  files: Data[];
}
function ListOfVersion({ files }: ListOfFilesProps) {
  const displayVersionModal = () => {
    const modal = document.getElementById("version") as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
  };
  return (
    <>
      <div className="card bg-base-200 shadow-xl w-3/5">
        <div className="card-body">
          <div className="flex flex-row justify-between">
            <h2 className="card-title text-center">List of Uploaded Files</h2>
            <button className="btn btn-accent" onClick={displayVersionModal}>
              Add new Version
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="table w-full">
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
                {files.map((file) => (
                  <tr key={file.ID} className="cursor-pointer hover">
                    <td className="text-center">{file.ID}</td>
                    <td className="text-center">{file.FileName}</td>
                    <td className="text-center">{file.UserID}</td>
                    <td className="text-center">{file.Time}</td>
                    <td className="text-center">
                      <div
                        className={`badge ${
                          file.Status === "Valid"
                            ? "badge-accent"
                            : "badge-secondary"
                        }`}
                      >
                        {file.Status}
                      </div>
                    </td>
                    <td className="text-center">
                      <div
                        className={`badge ${
                          file.Version > 1 ? "badge-secondary" : "badge-accent"
                        }`}
                      >
                        {file.Version} version
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <FileUpload />
    </>
  );
}

export default ListOfVersion;
