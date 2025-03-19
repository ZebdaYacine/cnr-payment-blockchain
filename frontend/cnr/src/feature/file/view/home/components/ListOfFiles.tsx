import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { MdErrorOutline } from "react-icons/md";
import SelectFilesComponent from "../../../../../core/components/SelectFilesComponet";
import { FaFolderTree } from "react-icons/fa6";
import { useVersion } from "../../../../../core/state/versionContext";
import { Data } from "../../../data/dtos/FileDtos";

interface ListOfFilesProps {
  files: Data[];
}

const ITEMS_PER_PAGE = 5;

function ListOfFiles({ files: files }: ListOfFilesProps) {
  const navigate = useNavigate();
  const { folderName } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRadio] = useState("");
  const { SetLastVersion, SetHashParent } = useVersion();

  const totalPages = Math.ceil(files.length / ITEMS_PER_PAGE);
  const paginatedFiles = files.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [files, totalPages, currentPage]);

  const handleRowClick = (
    fileName: string,
    last_version: number,
    hashPrent: string
  ) => {
    console.log("Navigating to file version:", fileName);
    navigate(`/home/${folderName}/${fileName}`);
    SetHashParent(hashPrent);
    SetLastVersion(last_version);
  };

  return (
    <>
      {/* {peer?.name && workAt && (
        <FileUploadModal
          destination={`${peer.org.name} - ${peer.wilaya}`}
          organisation={`${workAt} - ${wilaya}`}
          reciverId={peer.id}
        />
      )} */}
      {/* <FileUploadModal destination="" organisation="" /> */}

      <div className="card shadow-2xl w-full">
        <div className="card-body">
          <div className="flex flex-col">
            <div className="flex flex-wrap justify-between">
              <div className="flex flex-col space-y-3">
                <div className="flex items-center gap-3">
                  <FaFolderTree className="text-3xl" />
                  <span className="font-medium text-3xl">
                    {folderName ?? "Unknown"}
                  </span>
                </div>
              </div>
              {selectedRadio === "OUT" && (
                <div className="flex flex-row justify-center items-center">
                  <SelectFilesComponent />
                </div>
              )}
            </div>
          </div>
          <div className="divider"></div>

          {files.length === 0 ? (
            <div className="flex flex-col justify-center items-center p-4 bg-red-100 rounded-lg shadow-md">
              <MdErrorOutline className="text-red-500 w-12 h-12 mb-2" />
              <p className="font-bold text-red-600 text-lg">No file found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-auto">
                <thead>
                  <tr>
                    <th className="text-center">ID</th>
                    <th className="text-center">File</th>
                    <th className="text-center">User</th>
                    <th className="text-center">Time</th>
                    <th className="text-center">Status</th>
                    <th className="text-center">Version actuelle</th>
                    <th className="text-center">Nomber de version</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedFiles.map((file) => (
                    <tr
                      key={file.ID}
                      className="cursor-pointer hover"
                      onClick={() =>
                        handleRowClick(
                          file.FileName,
                          file.LasteVersion,
                          file.HashFile
                        )
                      }
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
                        {file.LasteVersion}
                        {file.LasteVersion > 0 ? (
                          <select
                            defaultValue="Pick a Runtime"
                            className="select select-xs select-success"
                          >
                            {[...Array(file.LasteVersion)].map((_, index) => (
                              <option key={index + 1}>
                                Version {index + 1}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <div className=" badge badge-primary font-bold">
                            v - {file.Version}
                          </div>
                        )}
                      </td>
                      <td className="text-center">
                        <div
                          className={`badge ${
                            file.Version > 1
                              ? "badge-secondary"
                              : "badge-accent"
                          }`}
                        >
                          <b>{file.LasteVersion - 1}</b> autres versions
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center mt-4">
              <div className="join">
                <button
                  className="join-item btn"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
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
          )}
        </div>
      </div>
    </>
  );
}

export default ListOfFiles;

// const ListOfFiles = () => {
//   const { lastVersion, SetLastVersion } = useVersion();

//   return (
//     <div>
//       <p>Current Version: {lastVersion}</p>
//       <button onClick={() => SetLastVersion(lastVersion + 1)}>
//         Increment Version
//       </button>
//       <p>Stored Version in LocalStorage: {lastVersion}</p>
//     </div>
//   );
// };

// export default ListOfFiles;
