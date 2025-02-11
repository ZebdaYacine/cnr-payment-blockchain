import { useEffect, useRef, useState } from "react";
import { FaUpload } from "react-icons/fa";
import { PofileUseCase } from "../../../domain/usecase/ProfileUseCase";
import { ProfileRepositoryImpl } from "../../../data/repository/ProfileRepositoryImpl";
import { ProfileDataSourceImpl } from "../../../data/dataSource/ProfileAPIDataSource";
import LoadingBar, { LoadingBarRef } from "react-top-loading-bar";
import { ToastContainer } from "react-toastify";
import { useProfileViewModel } from "../../../viewmodel/ProfileViewModel";
import { FilesResponse } from "../../../data/dtos/ProfileDtos";
import { useFileMetaData } from "../../../../../core/state/FileContext";
import { useTheme } from "../../../../../core/state/ThemeContext";

const dataSource = new ProfileDataSourceImpl();
const repository = new ProfileRepositoryImpl(dataSource);
const profileUseCase = new PofileUseCase(repository);

function UploadFileComponent() {
  const ref = useRef<LoadingBarRef>(null);
  const { isDarkMode } = useTheme();
  const { setFilesList } = useFileMetaData();
  const [file, setFileName] = useState("No file selected");
  const [badgecolor, setBadge] = useState("badge badge-warning");
  const [meta, setMeta] = useState("");

  const { uploadFile, uploadMetadata, isUploading, uploadSuccess } =
    useProfileViewModel(profileUseCase);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      uploadFile({ file: selectedFile, parent: "", version: 1 });
    } else {
      setFileName("No file selected");
    }
  };

  const close = () => {
    setFileName("No file selected");
    setBadge("badge badge-warning");
  };

  useEffect(() => {
    if (isUploading) {
      ref.current?.continuousStart();
      setBadge("badge badge-warning");
      setFileName("Uploading...");
    } else {
      ref.current?.complete();
      if (uploadSuccess) {
        const d = uploadMetadata as FilesResponse;
        const file = d?.data;
        if (file) {
          setFilesList(file);
          const str = file.at(-1)?.HashFile;
          if (str) setMeta(str);
          setFileName("File upload success");
          setBadge("badge badge-accent");

          const modal = document.getElementById("modal") as HTMLDialogElement;
          if (modal) {
            modal.showModal();
          }
        } else {
          setFileName("Error occurred during upload");
          setBadge("badge badge-danger");
        }
      }
    }
  }, [isUploading, uploadSuccess, uploadMetadata]);

  return (
    <>
      <LoadingBar color="#f11946" ref={ref} shadow={true} />
      <div
        className={
          isDarkMode
            ? "card w-96 shadow-xl text-white"
            : "card bg-base-300 w-96 shadow-xl"
        }
      >
        <div className="card-body items-center text-center">
          <h2 className="card-title">
            <div className={badgecolor}>{file}</div>
          </h2>
          <div className="card-actions flex flex-col items-center gap-4">
            <label className="btn btn-primary flex items-center gap-2 cursor-pointer">
              <FaUpload />
              Upload File
              <input
                type="file"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>
      <ToastContainer />
      <dialog id="modal" className="modal">
        <div className="modal-box p-8 shadow-lg">
          <h3 className="font-bold text-lg">File MetaData!</h3>
          <p className="mt-8 text-center text-xl text-blue-700 break-words font-bold">
            Checksum: <span className="block">{meta}</span>
          </p>
          <div className="modal-action mt-6">
            <form method="dialog">
              <button className="btn btn-primary" onClick={close}>
                Close
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}

export default UploadFileComponent;
