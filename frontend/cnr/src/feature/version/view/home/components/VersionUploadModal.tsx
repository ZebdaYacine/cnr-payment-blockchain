import { FormEvent, useEffect, useRef, useState } from "react";
import { BsXLg } from "react-icons/bs";
import LoadingBar, { LoadingBarRef } from "react-top-loading-bar";
import { useVersionViewModel } from "../../../viewmodel/VersionViewModel";
import { VersionDataSourceImpl } from "../../../data/dataSource/VersionsDataSource";
import { VersionRepositoryImpl } from "../../../data/repository/VersionRepositoryImpl";
import { VersionUseCase } from "../../../domain/usecase/VersionUseCase";
import { VersionsResponse } from "../../../data/dtos/VersionsDtos";
import { useParams } from "react-router";
import { useVersion } from "../../../../../core/state/versionContext";

const dataSource = new VersionDataSourceImpl();
const repository = new VersionRepositoryImpl(dataSource);
const versionUseCase = new VersionUseCase(repository);

function VersionUploadModal() {
  const ref = useRef<LoadingBarRef>(null);
  const [versionName, setVersionName] = useState("");
  const [descriptionSize, setDescrpitionSize] = useState(100);
  const [Descrpition, setDescription] = useState("");
  const [commit, setCommit] = useState("");
  const [selectedVersion, setSelectedVersion] = useState<File | null>(null);
  const { fileName } = useParams();
  const { folderName } = useParams();
  const { lastVersion, hashParent } = useVersion();

  const { uploadVersion, uploadMetadata, isUploading, uploadSuccess } =
    useVersionViewModel(versionUseCase);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      if (file) {
        setVersionName(file.name);
        setSelectedVersion(file);
      }
    }
  };

  useEffect(() => {
    if (isUploading) {
      ref.current?.continuousStart();
    } else {
      ref.current?.complete();
      if (uploadSuccess) {
        const d = uploadMetadata as VersionsResponse;
        const file = d?.data;
        if (file) {
          close();
        } else {
          // setFileName("Error occurred during upload");
          // setBadge("badge badge-danger");
        }
      } else {
        console.log("Error occurred during upload");
      }
    }
  }, [isUploading, uploadSuccess, uploadMetadata]);

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files.length > 0) {
      setVersionName(event.dataTransfer.files[0].name);
    }
  };

  const handleDescriptionSizeChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const newText = event.target.value;
    const size = newText.length;
    if (size <= 100) {
      setDescription(newText);
      setDescrpitionSize(100 - size);
    } else {
      const limitedText = newText.slice(0, 100);
      setDescription(limitedText);
      setDescrpitionSize(0);
    }
  };

  const handleCommitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newText = event.target.value;
    const size = newText.length;
    if (size <= 100) {
      setCommit(newText);
    }
  };

  const close = () => {
    const modal = document.getElementById("version") as HTMLDialogElement;
    if (modal) {
      modal.close();
    }
  };

  const addNewVersion = async (event: FormEvent) => {
    event.preventDefault();
    if (selectedVersion) {
      const new_version = Number(lastVersion) + 1;
      uploadVersion({
        version: selectedVersion,
        parent: fileName || "",
        version_seq: new_version,
        commit: commit,
        description: Descrpition,
        folderName: folderName || "",
        hash_parent: hashParent,
      });
    }
  };

  return (
    <dialog id="version" className="modal">
      <div className="modal-box p-8 shadow-lg">
        <LoadingBar color="#f11946" ref={ref} shadow={true} />
        <div className="flex flex-row justify-between">
          <h3 className="font-bold text-lg">Inserer nouvelle Version: {}</h3>
          <BsXLg className="cursor-pointer" onClick={close} />
        </div>
        <div className="flex flex-col items-center justify-center">
          <form className="form-control mt-4 w-full max-w-md text-center">
            <label
              className="mt-5 flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-accent rounded-lg cursor-pointer hover:bg-gray-100"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <p className="mt-2 text-sm text-gray-600">
                  {versionName || "Drag & Drop File or Click to Upload"}
                </p>
              </div>
              <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
            <input
              type="text"
              className="mt-3 input input-bordered w-full"
              placeholder="Commiter la transactions..."
              onChange={handleCommitChange}
              value={commit}
            />
            <div className="flex flex-col mt-3">
              <textarea
                className="textarea textarea-bordered"
                placeholder="Details sur la  transactions..."
                onChange={handleDescriptionSizeChange}
                value={Descrpition}
              />
              <div className="mt-2 flex flex-row-reverse">
                <div
                  className={`badge badge-lg ${
                    Descrpition.length == 100
                      ? "badge-secondary"
                      : "badge-accent"
                  }`}
                >
                  {descriptionSize}
                </div>
              </div>
            </div>

            <div className="mt-5 flex justify-center">
              <button
                className="btn btn-accent flex items-center"
                disabled={Descrpition.length === 0}
                onClick={addNewVersion}
              >
                Ajouter la Version
              </button>
            </div>
          </form>
        </div>
      </div>
    </dialog>
  );
}

export default VersionUploadModal;
