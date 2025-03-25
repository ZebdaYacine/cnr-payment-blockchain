import { FaDownload, FaFolder } from "react-icons/fa";
import ByUser from "./ByUser"; // Assuming ByUser is a separate component
import AtTime from "./AtTime"; // Assuming AtTime is a separate component
import { useState } from "react";
import { Folder } from "../../../../../core/dtos/data";

interface FolderTableProps {
  listOfFolders: Folder[];
  onRowClick: (folderName: string) => void;
}

function FolderTable({ listOfFolders, onRowClick }: FolderTableProps) {
  const ITEMS_PER_PAGE = 5;

  const [currentPage, setCurrentPage] = useState(1);
  const safeFolders = listOfFolders ?? [];
  const totalPages = Math.ceil(safeFolders.length / ITEMS_PER_PAGE);
  const paginatedFiles = safeFolders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
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
      <table className="table table-auto w-full">
        <tbody>
          {paginatedFiles.map((folder) => (
            <tr
              key={folder.id}
              className="cursor-pointer hover:bg-gray-100 transition-all duration-200"
              onDoubleClick={() => onRowClick(folder.name)}
            >
              <td className="text-left p-4">
                <div className="flex items-center gap-3">
                  <FaFolder className="text-xl" />
                  <span className="font-medium text-lg">{folder.name}</span>
                </div>
              </td>

              <td className="text-center text-gray-600 p-4">
                <ByUser
                  name={folder.user}
                  avatar="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                />
              </td>

              <td className="text-center p-4">
                <span className="font-bold text-gray-500">
                  {`il y a ${folder.nbrItems} Fichiers`}
                </span>
              </td>

              <td className="text-center p-4">
                <AtTime value={handleDateTime(new Date(folder.createAt))} />
              </td>
              <td
                className="text-xl hover:text-3xl"
                onClick={() => onRowClick(folder.name)}
              >
                <FaDownload />{" "}
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
    </>
  );
}

export default FolderTable;
