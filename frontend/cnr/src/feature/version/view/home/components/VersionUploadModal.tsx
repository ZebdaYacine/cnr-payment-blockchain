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
// import { useNotification } from "../../../../../services/useNotification";
import { ToastContainer } from "react-toastify";

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
  const { fileName, folderName } = useParams();
  // const { success, error } = useNotification();
  const {
    lastVersion,
    hashParent,
    receiverId,
    taggedUsers,
    organization,
    destination,
  } = useVersion();

  const { uploadVersion, uploadMetadata, isUploading, uploadSuccess } =
    useVersionViewModel(versionUseCase);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setVersionName(file.name);
      setSelectedVersion(file);
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
        }
        // success("version est chargee", "colored");
      } else {
        // error("version est chargee", "colored");
        console.log("Error occurred during upload");
      }
    }
  }, [isUploading, uploadSuccess, uploadMetadata]);

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files.length > 0) {
      setVersionName(event.dataTransfer.files[0].name);
      setSelectedVersion(event.dataTransfer.files[0]);
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
      setDescription(newText.slice(0, 100));
      setDescrpitionSize(0);
    }
  };

  const handleCommitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newText = event.target.value;
    if (newText.length <= 100) {
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
        receiverId: receiverId || "",
        taggedUsers: taggedUsers || [],
        organization: organization || "",
        destination: destination || "",
      });
    }
  };

  return (
    <>
      <ToastContainer />
      <dialog id="version" className="modal">
        <div className="modal-box w-screen max-w-2xl p-4 md:p-8 rounded-xl">
          <LoadingBar color="#f11946" ref={ref} shadow={true} />

          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg md:text-xl font-bold">
              📁 Insérer une nouvelle version
            </h3>
            <BsXLg className="text-xl cursor-pointer" onClick={close} />
          </div>

          {/* Form */}
          <form
            className="form-control w-full space-y-4"
            onSubmit={addNewVersion}
          >
            {/* Drop File Area */}
            <label
              className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-accent rounded-lg cursor-pointer hover:bg-gray-100 transition"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              <div className="flex flex-col items-center justify-center">
                <p className="text-sm text-gray-600">
                  {versionName || "📤 Glissez & déposez un fichier ou cliquez"}
                </p>
              </div>
              <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>

            {/* Commit Input */}
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="Commentaire de version (Commit)..."
              onChange={handleCommitChange}
              value={commit}
            />

            {/* Description Textarea */}
            <div>
              <textarea
                className="textarea textarea-bordered w-full"
                placeholder="Détails de la transaction..."
                onChange={handleDescriptionSizeChange}
                value={Descrpition}
              />
              <div className="mt-1 flex justify-end">
                <span
                  className={`badge ${
                    Descrpition.length === 100
                      ? "badge-secondary"
                      : "badge-accent"
                  }`}
                >
                  {descriptionSize}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="btn btn-accent px-6"
                disabled={Descrpition.length === 0 || isUploading}
              >
                {isUploading ? "Chargement..." : "Ajouter la version"}
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
}

export default VersionUploadModal;
