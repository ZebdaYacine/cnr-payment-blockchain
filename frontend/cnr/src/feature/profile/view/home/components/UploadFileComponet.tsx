import { useRef, useState } from "react";
import { useThme } from "../../../../../core/state/ThemeContext";
import { FaUpload } from "react-icons/fa"; // Import the upload icon
import { useUplaodViewModel } from "../../../viewmodel/UploadViewModel";
import { PofileUseCase } from "../../../domain/usecase/ProfileUseCase";
import { ProfileRepositoryImpl } from "../../../data/repository/ProfileRepositoryImpl";
import { ProfileDataSourceImpl } from "../../../data/dataSource/ProfileAPIDataSource";
import LoadingBar, { LoadingBarRef } from "react-top-loading-bar";
import { ToastContainer } from "react-toastify";

const dataSource = new ProfileDataSourceImpl();
const repository = new ProfileRepositoryImpl(dataSource);
const profileUseCase = new PofileUseCase(repository);
function UploadFileComponet() {
  const ref = useRef<LoadingBarRef>(null);

  const { isDarkMode } = useThme();
  const [file, setFileName] = useState("");
  const { upload, isPending, isSuccess } = useUplaodViewModel(profileUseCase);
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      upload({ file: selectedFile });
      if (isPending) {
        ref.current?.continuousStart();
      } else {
        ref.current?.complete();
        if (isSuccess) {
          setFileName(selectedFile.name);
        }
      }
    } else {
      setFileName("No file selected");
    }
  };

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
            <div
              className={
                file === "" ? "badge badge-warning" : "badge badge-primary"
              }
            >
              {file === "" ? "No File Selected..." : file}
            </div>
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
    </>
  );
}

export default UploadFileComponet;
