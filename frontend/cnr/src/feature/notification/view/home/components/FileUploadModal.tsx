import { FormEvent, useEffect, useRef, useState } from "react";
import { BsXLg } from "react-icons/bs";
import { FaUpload } from "react-icons/fa6";
import LoadingBar, { LoadingBarRef } from "react-top-loading-bar";
import { useNotificationViewModel } from "../../../viewmodel/NotificationViewModel";
import { motion } from "framer-motion"; // Import animation library
import { MdCheckCircle } from "react-icons/md";
import { FileResponse } from "../../../../profile/data/dtos/ProfileDtos";
import { useProfileViewModel } from "../../../../profile/viewmodel/ProfileViewModel";
import { PofileUseCase } from "../../../../profile/domain/usecase/ProfileUseCase";
import { ProfileRepositoryImpl } from "../../../../profile/data/repository/ProfileRepositoryImpl";
import { ProfileDataSourceImpl } from "../../../../profile/data/dataSource/ProfileAPIDataSource";
import { useUserId } from "../../../../../core/state/UserContext";
import { useListUsers } from "../../../../../core/state/ListOfUsersContext";
import { User } from "../../../../../core/dtos/data";
import TagInput from "../../../../profile/view/components/TagInput";
import { NotificationUseCase } from "../../../domain/usecase/NotificationUseCase";
import { NotificationRepositoryImpl } from "../../../data/repository/NotificationRepositoryImpl";
import { NotificationDataSourceImpl } from "../../../data/dataSource/NotificationAPIDataSource";

const dataSource = new ProfileDataSourceImpl();
const repository = new ProfileRepositoryImpl(dataSource);
const profileUseCase = new PofileUseCase(repository);

const folderdataSource = new NotificationDataSourceImpl();
const folderdataRepository = new NotificationRepositoryImpl(folderdataSource);
const folderUseCase = new NotificationUseCase(folderdataRepository);
interface FileUploadModalProps {
  organisation: string;
  destination: string;
  reciverId: string;
}
function FileUploadModal({
  organisation: organisation,
  destination: destination,
  reciverId: reciverId,
}: FileUploadModalProps) {
  const ref = useRef<LoadingBarRef>(null);
  const [commitText, setCommitText] = useState("");
  const [folder, setFolder] = useState("");
  const [commitSize, setCommitSize] = useState(100);
  const [listFiles, setListFiles] = useState<File[]>([]);
  const [listUsers, setListUsers] = useState<User[]>([]);
  const [groupInFOlder, setGroupInFOlder] = useState(false);
  const [countUploadedFiles, setCountUploadedFiles] = useState(0);
  const [isFinishUploading, SetFinishUploading] = useState(false);
  const { getFolders } = useNotificationViewModel(folderUseCase);
  const { permission, userId } = useUserId();
  const userPermission = permission || localStorage.getItem("permission");
  const { users } = useListUsers();

  const [taggedUsers, setTaggedUsers] = useState<string[]>([]);
  const { uploadFileAsync, uploadMetadata, isUploading, uploadSuccess } =
    useProfileViewModel(profileUseCase);

  useEffect(() => {
    if (isUploading) {
      ref.current?.continuousStart();
    } else if (uploadSuccess && uploadMetadata) {
      ref.current?.complete();
      const fileData = (uploadMetadata as FileResponse)?.data;
      if (fileData) {
        console.log(">>>>>>>>>>>>>>>>>>>>>", fileData);
        SetFinishUploading(true);
      } else {
        SetFinishUploading(false);
      }
    }
  }, [isUploading, uploadSuccess, uploadMetadata]);

  useEffect(() => {
    if (listUsers.length === 0) setListUsers(users);
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setListFiles(Array.from(event.target.files));
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files) {
      setListFiles(Array.from(event.dataTransfer.files));
    }
  };

  const handleCommitSizeChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const newText = event.target.value.slice(0, 100);
    setCommitText(newText);
    setCommitSize(100 - newText.length);
  };

  const uploadFiles = async (event: FormEvent) => {
    event.preventDefault();
    if (listFiles.length === 0) return;
    let i = 0;
    if (userPermission)
      for (const file of listFiles) {
        try {
          await uploadFileAsync(
            file,
            "",
            folder,
            commitText,
            organisation,
            destination,
            1,
            userPermission.toLocaleLowerCase(),
            reciverId,
            taggedUsers
          );
          const fileElement = document.getElementById(file.name);
          const btn = document.getElementById(i.toString());
          if (fileElement) {
            fileElement.classList.replace("badge-secondary", "badge-accent");
            setCountUploadedFiles(i + 1);
          }
          if (btn && isFinishUploading) {
            btn.remove();
            if (userPermission && reciverId != "" && userId != "")
              getFolders({
                permission: userPermission.toLocaleLowerCase(),
                receiverId: reciverId,
                senderId: userId,
              });
          }
        } catch (error) {
          console.error(`Error uploading file ${file.name}:`, error);
        }
        i = i + 1;
      }
    // SetFinishUploading(true);
  };

  const close = () => {
    const modal = document.getElementById("files") as HTMLDialogElement;
    if (modal) modal.close();
    setListFiles([]);
    setCountUploadedFiles(0);
    setCommitText("");
    SetFinishUploading(false);
    setListUsers([]);
  };

  const handleDeleteFile = (fileName: string) => {
    setListFiles((prevFiles) =>
      prevFiles.filter((file) => file.name !== fileName)
    );
  };

  return (
    <dialog id="files" className="modal">
      <div className="modal-box p-8 shadow-lg">
        <LoadingBar color="#f11946" ref={ref} shadow={true} />

        <div className="flex justify-between">
          <h3 className="font-bold text-lg">Insérer un nouveau fichier:</h3>
          <BsXLg className="cursor-pointer" onClick={close} />
        </div>
        <form
          onSubmit={uploadFiles}
          className="flex flex-col form-control mt-4 w-full max-w-md text-center space-y-3"
        >
          <label
            className="mt-5 flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-primary rounded-lg cursor-pointer hover:bg-gray-100"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <div className="flex flex-col items-center">
              <p className="mt-2 text-sm text-gray-600">
                {listFiles.length > 0 ? "Files Ready" : "Drag & Drop or Select"}
              </p>
            </div>
            <input
              type="file"
              className="hidden"
              onChange={handleFileChange}
              multiple
            />
          </label>
          <TagInput userList={listUsers} onTagsChange={setTaggedUsers} />

          {listFiles.length > 0 && (
            <>
              <div className="divider" />
              <p className="text-start font-bold ">
                {countUploadedFiles > 0
                  ? `Fichier téléchargé : ${countUploadedFiles}/${listFiles.length}`
                  : `List des Fichiers : ${listFiles.length}`}
              </p>
              <div className="flex flex-wrap gap-2 bg-gray-200 p-3 rounded-lg max-h-40 overflow-y-auto">
                {listFiles.map((file, index) => (
                  <div
                    id={file.name}
                    key={file.name}
                    className="badge badge-secondary flex items-center gap-2 p-2"
                  >
                    {file.name}
                    <BsXLg
                      id={index.toString()}
                      key={index.toString()}
                      className="cursor-pointer text-white"
                      onClick={() => handleDeleteFile(file.name)}
                    />
                  </div>
                ))}
              </div>
              <div className="divider" />
              <label className="flex flex-row space-x-2 items-center">
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary"
                  checked={groupInFOlder}
                  onChange={() => setGroupInFOlder((prev) => !prev)}
                />
                <span className="label-text font-bold text-lg">
                  Regrouper les fichiers dans un seul dossier
                </span>
              </label>
              {groupInFOlder && (
                <input
                  type="text"
                  className="mt-3 input input-bordered w-full"
                  placeholder="Le nom de dossier..."
                  onChange={(event) => {
                    setFolder(event.target.value);
                  }}
                />
              )}
              <div className="flex flex-col mt-3">
                <textarea
                  className="textarea textarea-bordered"
                  placeholder="Détails sur la transaction..."
                  onChange={handleCommitSizeChange}
                  value={commitText}
                />
                <div className="mt-2 flex flex-row-reverse">
                  <div
                    className={`badge badge-lg ${
                      commitText.length === 100
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

          {listFiles.length > 0 &&
            (isFinishUploading ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring", stiffness: 150 }}
                className="flex items-center gap-2 text-green-600 font-bold"
              >
                <MdCheckCircle className="w-8 h-8 text-green-500 animate-pulse" />
                Téléchargement réussi !{" "}
              </motion.div>
            ) : (
              <button
                type="submit"
                className="btn btn-primary flex items-center gap-2 cursor-pointer"
              >
                <FaUpload className="animate-bounce" />
                Charger Les Fichiers
              </button>
            ))}
        </form>
      </div>
    </dialog>
  );
}

export default FileUploadModal;
