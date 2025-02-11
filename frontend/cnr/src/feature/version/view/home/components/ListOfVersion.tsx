import LoadingBar, { LoadingBarRef } from "react-top-loading-bar";
import { Data } from "../../../data/dtos/ProfileDtos";
import { useRef } from "react";
import { FaUpload } from "react-icons/fa6";

interface ListOfFilesProps {
  files: Data[];
}

function handleRowClick(file: Data) {
  console.log("File clicked:", file);
}

function ListOfVersion({ files }: ListOfFilesProps) {
  const displayVersionModal = () => {
    const modal = document.getElementById("version") as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
  };
  const ref = useRef<LoadingBarRef>(null);
  return (
    <>
      <>
        <div className="card bg-base-300 shadow-xl w-3/5">
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
                    <tr
                      key={file.ID}
                      className="cursor-pointer hover"
                      onClick={() => handleRowClick(file)}
                    >
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
                            file.Version > 1
                              ? "badge-secondary"
                              : "badge-accent"
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
        <dialog id="version" className="modal">
          <div className="modal-box p-8 shadow-lg">
            <h3 className="font-bold text-lg">Insert new Verion:</h3>
            <LoadingBar color="#f11946" ref={ref} shadow={true} />
            <div className="flex flex-col items-center justify-center">
              <form className="form-control mt-4 w-full max-w-md text-center">
                <input
                  type="file"
                  className="mt-5 file-input file-input-bordered file-input-primary "
                />
                <textarea
                  className="mt-5 textarea textarea-bordered"
                  placeholder="Description of transactions..."
                />
                <div className="mt-5 card-actions flex flex-col items-center gap-4">
                  <label className="btn btn-primary flex items-center gap-2 cursor-pointer">
                    <FaUpload />
                    Upload File
                    <input type="input" className="hidden" />
                  </label>
                </div>
              </form>
            </div>
          </div>
        </dialog>
      </>
    </>
  );
}

export default ListOfVersion;
