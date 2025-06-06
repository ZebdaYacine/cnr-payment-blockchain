import { FaDownload, FaFolder } from "react-icons/fa";
import ByUser from "./ByUser"; // Assuming ByUser is a separate component
import AtTime from "./AtTime"; // Assuming AtTime is a separate component
import { useState } from "react";
import { Folder } from "../../../../../core/dtos/data";
import { useFileViewModel } from "../../../../file/viewmodel/FileViewModel";
import { FileUseCase } from "../../../../file/domain/usecase/FileUseCase";
import { FileRepositoryImpl } from "../../../../file/data/repository/FileRepositoryImpl";
import { FileDataSourceImpl } from "../../../../file/data/dataSource/FileAPIDataSource";
import { useUser } from "../../../../../core/state/UserContext";
import { HandleDateTime } from "../../../../../services/Utils";
import { useKeys } from "../../../../../core/state/KeyContext";
import { useNotification } from "../../../../../services/useNotification";

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

  // Initialize FileViewModel
  const fileDataSource = new FileDataSourceImpl();
  const fileRepository = new FileRepositoryImpl(fileDataSource);
  const fileUseCase = new FileUseCase(fileRepository);
  const { downloadFilesOfFolder, isDownloadingFolder } =
    useFileViewModel(fileUseCase);

  const { userSaved } = useUser();
  const { error } = useNotification();
  const { isDigitalSignatureConfirmed } = useKeys();

  const handleDownloadFolder = (folderName: string) => {
    if (isDigitalSignatureConfirmed) {
      downloadFilesOfFolder({
        folder: folderName,
        permission: userSaved.permission.toLowerCase(),
      });
    } else {
      alert(
        "voter signature electronique pas encore confirmé svp uploadr votre cle privee"
      );
      error(
        "voter signature electronique pas encore confirmé svp uploadr votre cle privee",
        "colored"
      );
    }
  };

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
                  <span className="font-medium text-md">{folder.name}</span>
                </div>
              </td>

              <td className="text-center text-gray-600 p-4">
                <ByUser name={folder.user} avatar={userSaved.avatar} />
              </td>

              <td className="text-center p-4">
                <span className="font-bold text-gray-500">
                  {`il y a ${folder.nbrItems} Fichiers`}
                </span>
              </td>

              <td className="text-center p-4">
                <AtTime value={HandleDateTime(new Date(folder.createAt))} />
              </td>
              <td
                className="text-xl hover:text-3xl cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownloadFolder(folder.name);
                }}
              >
                <FaDownload
                  className={isDownloadingFolder ? "animate-pulse" : ""}
                />
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
