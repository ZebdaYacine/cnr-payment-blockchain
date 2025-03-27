import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { MdErrorOutline } from "react-icons/md";
import { FaFolderTree } from "react-icons/fa6";
import { useVersion } from "../../../../../core/state/versionContext";
import { Data } from "../../../data/dtos/FileDtos";
import DownloaderButton from "../../../../../core/components/DownloaderButton";

interface ListOfFilesProps {
  files: Data[];
}

const ITEMS_PER_PAGE = 5;

function ListOfFiles({ files: files }: ListOfFilesProps) {
  const navigate = useNavigate();
  const { folderName } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [checkedFiles, setCheckedFiles] = useState<Data[]>([]);
  const {
    SetLastVersion,
    SetHashParent,
    SetReceiverId,
    SetTaggedUsers,
    SetOrganization,
    SetDestination,
    ClearTaggedUsers,
  } = useVersion();

  const totalPages = Math.ceil(files.length / ITEMS_PER_PAGE);
  const paginatedFiles = files.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleCheckboxChange = (file: Data, checked: boolean) => {
    if (checked) {
      setCheckedFiles([...checkedFiles, file]);
    } else setCheckedFiles(checkedFiles.filter((f) => f.ID !== file.ID));
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const newFiles = files.filter(
        (file) => !checkedFiles.some((f) => f.ID === file.ID)
      );
      const d = newFiles.filter(
        (file) => !checkedFiles.some(() => file.Status === "Invalid")
      );
      setCheckedFiles([...checkedFiles, ...d]);
    } else {
      const remaining = checkedFiles.filter(
        (f) => !files.some((file) => file.ID === f.ID)
      );
      setCheckedFiles(remaining);
    }
  };

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [files, totalPages, currentPage]);

  const handleRowClick = (
    fileName: string,
    last_version: number,
    hashPrent: string,
    userId: string,
    organization: string,
    destination: string,
    taggedUsers: string[]
  ) => {
    // Reset all states first
    SetHashParent("");
    SetLastVersion(0);
    SetReceiverId("");
    SetTaggedUsers([]);
    SetOrganization("");
    SetDestination("");
    ClearTaggedUsers();

    // Set new values
    SetHashParent(hashPrent);
    SetLastVersion(last_version);
    SetReceiverId(userId);
    SetOrganization(organization);
    SetDestination(destination);
    SetTaggedUsers(taggedUsers);

    console.log("Navigating to file version:", fileName);
    navigate(`/home/${folderName}/${fileName}`);
  };

  return (
    <>
      <div className="card shadow-2xl w-full">
        <div className="card-body">
          <div className="flex flex-col">
            <div className="flex flex-wrap justify-between ">
              <div className="flex items-center gap-3">
                <FaFolderTree className="text-3xl" />
                <span className="font-medium text-3xl">
                  {folderName ?? "Unknown"}
                </span>
              </div>
              <div className="flex">
                {checkedFiles.length > 0 ? (
                  <>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="checkbox"
                        onChange={(e) => handleSelectAll(e.target.checked)}
                      />
                      <span>Selectionner Tous</span>
                    </label>
                    <DownloaderButton checkedFiles={checkedFiles} />
                  </>
                ) : (
                  ""
                )}
              </div>
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
                    <th className="text-center"></th>
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
                      onDoubleClick={() =>
                        handleRowClick(
                          file.FileName,
                          file.LastVersion,
                          file.HashFile,
                          file.reciverId,
                          file.Organisation || "",
                          "",
                          file.TaggedUsers || []
                        )
                      }
                    >
                      <td className="text-center">
                        {file.Status === "Valid" ? (
                          <input
                            id={file.ID}
                            type="checkbox"
                            className="checkbox checkbox-primary"
                            checked={checkedFiles.some((f) => f.ID === file.ID)}
                            onChange={(e) =>
                              handleCheckboxChange(file, e.target.checked)
                            }
                          />
                        ) : (
                          ""
                        )}
                      </td>
                      <td className="text-center">{file.ID}</td>
                      <td className="text-center">{file.FileName}</td>
                      <td className="text-center">{file.reciverId}</td>
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
                        <div className=" badge badge-primary font-bold">
                          version - {file.Version}
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
                          <b>{file.LastVersion - 1}</b> autres versions
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


