import { useNavigate } from "react-router";
import { useState } from "react";
import { Child, Data } from "../../../data/dtos/ProfileDtos";

// import SelectFilesComponent from "./SelectFilesComponet";
import { MdErrorOutline } from "react-icons/md";
import FileUploadModal from "../../../../folder/view/home/components/FileUploadModal";
import SelectFilesComponent from "../../../../../core/components/SelectFilesComponet";

interface ListOfFilesProps {
  files: Data[];
  peer: Child;
}

const ITEMS_PER_PAGE = 5; // Adjust this value as needed

function ListOfFiles({ files, peer: peer }: ListOfFilesProps) {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRadio, setSelectedRadio] = useState("");

  const totalPages = Math.ceil(files.length / ITEMS_PER_PAGE);
  const paginatedFiles = files.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleRowClick = (file: Data) => {
    console.log("File clicked:", file);
    navigate("/versions-file");
  };

  return (
    <>
      <FileUploadModal />
      <div className="mt-4 w-full">
        <div className="card  shadow-xl w-full">
          <div className="card-body">
            <div className="flex flex-col">
              <div className="flex flex-wrap justify-between">
                <div className="flex flex-col space-y-3">
                  <h2 className="card-title text-center text-3xl">
                    {peer ? peer.name : "No Peer Selected"}
                  </h2>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center cursor-pointer gap-2 p-2   ">
                      <input
                        type="radio"
                        name="radio-2"
                        className="radio radio-primary"
                        onClick={() => setSelectedRadio("IN")}
                      />
                      <span className="font-semibold">IN</span>
                    </label>

                    <label className="flex items-center cursor-pointer gap-2 p-2  ">
                      <input
                        type="radio"
                        name="radio-2"
                        className="radio radio-primary"
                        onClick={() => setSelectedRadio("OUT")}
                      />
                      <span className="font-semibold">OUT</span>
                    </label>
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
                      <th className="text-center">Version</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedFiles.map((file) => (
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
            )}
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
          </div>
        </div>
      </div>
    </>
  );
}

export default ListOfFiles;
