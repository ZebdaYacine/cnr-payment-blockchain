import { FaDownload } from "react-icons/fa6";
import { ToastContainer } from "react-toastify";
import { Data } from "../../feature/file/data/dtos/FileDtos";
import { useFileViewModel } from "../../feature/file/viewmodel/FileViewModel";
import { FileUseCase } from "../../feature/file/domain/usecase/FileUseCase";
import { FileRepositoryImpl } from "../../feature/file/data/repository/FileRepositoryImpl";
import { FileDataSourceImpl } from "../../feature/file/data/dataSource/FileAPIDataSource";
import { useUser } from "../state/UserContext";

const fileDataSource = new FileDataSourceImpl();
const fileRepository = new FileRepositoryImpl(fileDataSource);
const fileUseCase = new FileUseCase(fileRepository);

interface DownloaderButtonProps {
  checkedFiles: Data[];
}

function DownloaderButton({ checkedFiles }: DownloaderButtonProps) {
  const { userSaved } = useUser();
  const userPermission = userSaved.permission;
  const { downloadFiles, isDownloading } = useFileViewModel(fileUseCase);

  const handleDownloadClick = () => {
    if (!userPermission) {
      return;
    }

    // const fileIds = checkedFiles.map((file) => file.path || "");
    downloadFiles({
      files: checkedFiles,
      permission: userPermission.toLowerCase(),
    });
  };

  return (
    <>
      <div className="card-body items-center text-center">
        <div className="card-actions flex flex-col items-center gap-4">
          {checkedFiles.length > 0 && (
            <button
              className={`btn btn-primary flex items-center gap-2 cursor-pointer ${
                isDownloading ? "loading" : ""
              }`}
              onClick={handleDownloadClick}
              disabled={isDownloading}
            >
              {!isDownloading && <FaDownload />}
              {isDownloading
                ? "Downloading..."
                : `Telechargement ${checkedFiles.length} Fichiers${
                    checkedFiles.length > 1 ? "s" : ""
                  }`}
            </button>
          )}
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default DownloaderButton;
