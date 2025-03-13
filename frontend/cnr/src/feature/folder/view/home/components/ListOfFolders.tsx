import { useNavigate } from "react-router";
import { useState } from "react";
import { Folder } from "../../../data/dtos/FolderDtos";
import FileUploadModal from "./FileUploadModal";
import { FaFolder } from "react-icons/fa6";
import { Child } from "../../../../profile/data/dtos/ProfileDtos";
import Warning from "../../../../../core/components/Warning";
import ByUser from "./ByUser";
import AtTime from "./AtTime";
import SelectFilesComponent from "../../../../../core/components/SelectFilesComponet";

interface ListOfFoldersProps {
  folders: Folder[];
  peer: Child;
}

const ITEMS_PER_PAGE = 5;

function ListOfFolders({ folders: folders, peer: peer }: ListOfFoldersProps) {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRadio, setSelectedRadio] = useState("");

  const safeFolders = Array.isArray(folders) ? folders : [];
  const totalPages = Math.ceil(safeFolders.length / ITEMS_PER_PAGE);
  const paginatedFiles = safeFolders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleRowClick = (folderName: string) => {
    console.log("Navigating to folder:", folderName);
    navigate(`/home/${folderName}`);
  };
  return (
    <>
      <FileUploadModal />
      <div className="card shadow-2xl w-full">
        <div className="card-body">
          <div className="flex flex-col">
            <div className="flex flex-wrap justify-between">
              <div className="flex flex-col space-y-3">
                <h2 className="card-title text-center text-3xl">
                  {peer ? peer.name : "No Peer Selected"}
                </h2>
                {peer && (
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center cursor-pointer gap-2 p-2   ">
                      <input
                        type="radio"
                        name="radio-2"
                        className="radio radio-primary"
                        onClick={() => setSelectedRadio("OUT")}
                      />
                      <span className="font-semibold">OUT</span>
                    </label>

                    <label className="flex items-center cursor-pointer gap-2 p-2  ">
                      <input
                        type="radio"
                        name="radio-2"
                        className="radio radio-primary"
                        onClick={() => setSelectedRadio("IN")}
                      />
                      <span className="font-semibold">IN</span>
                    </label>
                  </div>
                )}
              </div>
              {selectedRadio === "IN" && (
                <div className="flex flex-row justify-center items-center">
                  <SelectFilesComponent />
                </div>
              )}
            </div>
          </div>
          <div className="divider"></div>

          {folders.length === 0 ? (
            Warning({ message: "No Folder Found" })
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-auto">
                <tbody>
                  {paginatedFiles.map((folder) => (
                    <tr
                      key={folder.name}
                      className="cursor-pointer hover:bg-gray-100 transition-all duration-200"
                      onClick={() => handleRowClick(folder.name)}
                    >
                      <td className="text-left p-4">
                        <div className="flex items-center gap-3">
                          <FaFolder className=" text-xl" />
                          <span className="font-medium text-lg ">
                            {folder.name}
                          </span>
                        </div>
                      </td>

                      <td className="text-center text-gray-600 p-4">
                        <ByUser
                          name="Zebda Yassine"
                          avatar="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                        />
                      </td>
                      <td className="text-center p-4">
                        <span className=" font-bold text-wrap text-gray-500 ">
                          {`il y a ${folder.nbrItems.toString()} Fichiers`}{" "}
                        </span>
                      </td>
                      <td className="text-center p-4">
                        <AtTime value={folder.createAt} />
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
    </>
  );
}

export default ListOfFolders;
