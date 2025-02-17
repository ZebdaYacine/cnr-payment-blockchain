import { FormEvent, useEffect, useRef, useState } from "react";
import { BsXLg } from "react-icons/bs";
import { FaUpload } from "react-icons/fa6";
import LoadingBar, { LoadingBarRef } from "react-top-loading-bar";
import { ProfileDataSourceImpl } from "../../../data/dataSource/ProfileAPIDataSource";
import { ProfileRepositoryImpl } from "../../../data/repository/ProfileRepositoryImpl";
import { PofileUseCase } from "../../../domain/usecase/ProfileUseCase";
import { useProfileViewModel } from "../../../viewmodel/ProfileViewModel";
import { FileResponse } from "../../../data/dtos/ProfileDtos";

const dataSource = new ProfileDataSourceImpl();
const repository = new ProfileRepositoryImpl(dataSource);
const profileUseCase = new PofileUseCase(repository);
function FileUploadModal() {
  const ref = useRef<LoadingBarRef>(null);
  // const [versionName, setVersionName] = useState("");
  const [commitSize, setCommitSize] = useState(100);
  const [commitText, setCommitText] = useState("");
  const [listFiles, setListFiles] = useState<FileList>();
  const [groupInFOlder, setGroupInFOlder] = useState<boolean>(false);

  const { uploadFile, uploadMetadata, isUploading, uploadSuccess } =
    useProfileViewModel(profileUseCase);

  useEffect(() => {
    if (isUploading) {
      ref.current?.continuousStart();
    } else {
      ref.current?.complete();
      if (uploadSuccess) {
        const d = uploadMetadata as FileResponse;
        const file = d?.data;
        const div = document.getElementById(file.FileName) as HTMLDialogElement;
        console.log(div);
        if (div) {
          div.classList.remove("badge-secondary");
          div.classList.add("badge-accent");
        }
      }
    }
  }, [isUploading, uploadSuccess, uploadMetadata]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setListFiles(undefined);
      setGroupInFOlder(false);
      const list = event.target.files;
      setListFiles(list);
      // if (file) {
      //   setVersionName(file.name);
      // }
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setListFiles(undefined);
    setGroupInFOlder(false);

    // if (event.dataTransfer.files.length > 0) {
    //   setVersionName(event.dataTransfer.files[0].name);
    // }
  };

  const handleCommitSizeChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const newText = event.target.value;
    const size = newText.length;
    if (size <= 100) {
      setCommitText(newText);
      setCommitSize(100 - size);
    } else {
      const limitedText = newText.slice(0, 100);
      setCommitText(limitedText);
      setCommitSize(0);
    }
  };

  const uploadFiles = async (event: FormEvent) => {
    event.preventDefault();
    if (listFiles) {
      for (let i = 0; i < listFiles.length; i++) {
        // console.log(listFiles[i]);
        const file = listFiles[i];
        uploadFile({ file, parent: "", version: 1 });
      }
    }
  };

  const close = () => {
    const modal = document.getElementById("files") as HTMLDialogElement;
    if (modal) {
      modal.close();
      setListFiles(undefined);
    }
  };

  const handleDeleteFile = (fileName: string) => {
    if (listFiles) {
      const filteredFiles = Array.from(listFiles).filter(
        (file) => file.name !== fileName
      );
      const dataTransfer = new DataTransfer();
      filteredFiles.forEach((file) => dataTransfer.items.add(file));

      setListFiles(dataTransfer.files);
    }
  };

  return (
    <dialog id="files" className="modal">
      <LoadingBar color="#f11946" ref={ref} shadow={true} />
      <div className="modal-box p-8 shadow-lg">
        <LoadingBar color="#f11946" ref={ref} shadow={true} />
        <div className="flex flex-row justify-between">
          <h3 className="font-bold text-lg">Insert new Version:</h3>
          <BsXLg className="cursor-pointer" onClick={close} />
        </div>
        <div className="flex flex-col items-center justify-center">
          <form className="flex flex-col form-control mt-4 w-full max-w-md text-center space-y-3">
            <label
              className="mt-5 flex flex-col items-center justify-center w-full h-20 border-2  border-dashed border-primary rounded-lg cursor-pointer hover:bg-gray-100"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              <div className="flex flex-col items-center justify-center">
                <p className="mt-2 text-sm text-gray-600">
                  Drag & Drop File or Click to Upload
                </p>
              </div>
              <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
                multiple
              />
            </label>
            {listFiles && listFiles.length > 0 && (
              <>
                <div className="divider" />
                <div className="flex flex-col space-y-1">
                  <p className="text-start font-bold">List of Files:</p>
                  <div className="flex flex-wrap gap-2 bg-gray-200 p-3 rounded-lg max-h-40 overflow-y-auto">
                    {listFiles &&
                      Array.from(listFiles).map((file) => (
                        <div
                          id={file.name}
                          key={file.name}
                          className="badge badge-secondary flex items-center gap-2 p-2"
                        >
                          {file.name}
                          <BsXLg
                            className="cursor-pointer text-white"
                            onClick={() => handleDeleteFile(file.name)}
                          />
                        </div>
                      ))}
                  </div>
                </div>
                <div className="divider" />

                <label className="flex flex-row space-x-2 items-center">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary"
                    checked={groupInFOlder}
                    onChange={() => setGroupInFOlder(!groupInFOlder)}
                  />
                  <span className="label-text font-bold text-lg">
                    Group files on single folder
                  </span>
                </label>
                {groupInFOlder && (
                  <input
                    type="text"
                    className="mt-3 input input-bordered w-full"
                    placeholder="name folder..."
                  />
                )}
                <div className="flex flex-col mt-3">
                  <textarea
                    className="textarea textarea-bordered"
                    placeholder="Details about transactions..."
                    onChange={handleCommitSizeChange}
                    value={commitText}
                  />
                  <div className="mt-2 flex flex-row-reverse">
                    <div
                      className={`badge badge-lg ${
                        commitText.length == 100
                          ? "badge-secondary"
                          : "badge-accent"
                      }`}
                    >
                      {commitSize}
                    </div>
                  </div>
                </div>
              </>
            )}
            {listFiles && listFiles.length > 0 && (
              <label className="btn btn-primary flex items-center gap-2 cursor-pointer ">
                <FaUpload />
                Upload Files
                <input type="button" onClick={uploadFiles} className="hidden" />
              </label>
            )}
          </form>
        </div>
      </div>
    </dialog>
  );
}

export default FileUploadModal;
