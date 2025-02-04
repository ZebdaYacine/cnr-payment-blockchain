import { useEffect, useRef, useState } from "react";
import { useThme } from "../../../../../core/state/ThemeContext";
import { FaUpload } from "react-icons/fa";
import { PofileUseCase } from "../../../domain/usecase/ProfileUseCase";
import { ProfileRepositoryImpl } from "../../../data/repository/ProfileRepositoryImpl";
import { ProfileDataSourceImpl } from "../../../data/dataSource/ProfileAPIDataSource";
import LoadingBar, { LoadingBarRef } from "react-top-loading-bar";
import { ToastContainer } from "react-toastify";
import { useUploadViewModel } from "../../../viewmodel/UploadViewModel";
import { FilesResponse } from "../../../data/dtos/ProfileDtos";
import { useFileMetaData } from "../../../../../core/state/FileContext";

const dataSource = new ProfileDataSourceImpl();
const repository = new ProfileRepositoryImpl(dataSource);
const profileUseCase = new PofileUseCase(repository);

function UploadFileComponet() {
  const ref = useRef<LoadingBarRef>(null);
  const { isDarkMode } = useThme();
  const { setFilesList } = useFileMetaData();
  const [file, setFileName] = useState("No file selected");
  const [badgecolor, setBadge] = useState("badge badge-warning");
  const [meta, setMeta] = useState("");

  const { upload, metadata, isPending, isSuccess } =
    useUploadViewModel(profileUseCase);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      upload({ file: selectedFile, parent: "root", version: 2 });
    } else {
      setFileName("No file selected");
    }
  };

  useEffect(() => {
    if (isPending) {
      ref.current?.continuousStart();
      setBadge("badge badge-warning");
      setFileName("Uploading...");
    } else {
      ref.current?.complete();
      if (isSuccess) {
        const d = metadata as FilesResponse;
        const file = d.data;
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
  }, [isPending, isSuccess, metadata]);

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
        <div className="modal-box p-8  shadow-lg">
          <h3 className="font-bold text-lg">File MetaData!</h3>
          <p className="mt-8 text-center text-xl text-fuchsia-700">
            <span className="font-bold text-lg">checksum</span>:{meta}
          </p>
          <div className="modal-action mt-6">
            {/* Form with method="dialog" automatically closes the modal */}
            <form method="dialog">
              <button className="btn btn-primary">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}

export default UploadFileComponet;
