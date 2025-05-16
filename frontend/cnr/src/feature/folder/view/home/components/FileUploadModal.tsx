import { FormEvent, useEffect, useRef, useState } from "react";
import { BsXLg } from "react-icons/bs";
import { FaUpload } from "react-icons/fa6";
import { MdCheckCircle } from "react-icons/md";
import LoadingBar, { LoadingBarRef } from "react-top-loading-bar";
import { useFolderViewModel } from "../../../viewmodel/FolderViewModel";
import { useUser } from "../../../../../core/state/UserContext";
import { useListUsers } from "../../../../../core/state/ListOfUsersContext";
import { usePhaseId } from "../../../../../core/state/PhaseContext";
import { useNotificationViewModel } from "../../../../notification/viewmodel/NotificationViewModel";
import { useFileViewModel } from "../../../../file/viewmodel/FileViewModel";
import { motion } from "framer-motion";

import { FileDataSourceImpl } from "../../../../file/data/dataSource/FileAPIDataSource";
import { FileRepositoryImpl } from "../../../../file/data/repository/FileRepositoryImpl";
import { FileUseCase } from "../../../../file/domain/usecase/FileUseCase";
import { FileResponse } from "../../../../file/data/dtos/FileDtos";

import { FolderRepositoryImpl } from "../../../data/repository/FolderRepositoryImpl";
import { FolderDataSourceImpl } from "../../../data/dataSource/FolderAPIDataSource";
import { FolderUseCase } from "../../../domain/usecase/FolderUseCase";

import { NotificationDataSourceImpl } from "../../../../notification/data/dataSource/NotificationAPIDataSource";
import { NotificationRepositoryImpl } from "../../../../notification/data/repository/NotificationRepositoryImpl";
import { NotificationUseCase } from "../../../../notification/domain/usecase/NotificationUseCase";

import TagInput from "../../../../profile/view/components/TagInput";
import { User } from "../../../../../core/dtos/data";

const fileUseCase = new FileUseCase(
  new FileRepositoryImpl(new FileDataSourceImpl())
);

const folderUseCase = new FolderUseCase(
  new FolderRepositoryImpl(new FolderDataSourceImpl())
);

const notificationUseCase = new NotificationUseCase(
  new NotificationRepositoryImpl(new NotificationDataSourceImpl())
);

interface FileUploadModalProps {
  organisation: string;
  destination: string;
  reciverId: string;
}

export default function FileUploadModal({
  organisation,
  destination,
  reciverId,
}: FileUploadModalProps) {
  const ref = useRef<LoadingBarRef>(null);
  const [commitText, setCommitText] = useState("");
  const [commitSize, setCommitSize] = useState(100);
  const [listFiles, setListFiles] = useState<File[]>([]);
  const [listUsers, setListUsers] = useState<User[]>([]);
  const [countUploadedFiles, setCountUploadedFiles] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<Set<string>>(new Set());

  const { getFolders } = useFolderViewModel(folderUseCase);
  const { userSaved } = useUser();
  const { users } = useListUsers();
  const { phase } = usePhaseId();
  const { addNotification } = useNotificationViewModel(notificationUseCase);
  const {
    uploadFileAsync,
    uploadMetadata,
    isUploading,
    uploadSuccess,
    uploadError,
  } = useFileViewModel(fileUseCase);

  const [taggedUsers, setTaggedUsers] = useState<string[]>([]);

  const generateFolderName = () => {
    const now = new Date();
    const date = now.toISOString().split("T")[0];
    return `${organisation}_${reciverId}_${date}`;
  };

  const folderName = generateFolderName();

  useEffect(() => {
    if (isUploading) {
      ref.current?.continuousStart();
    } else if (uploadSuccess && uploadMetadata) {
      ref.current?.complete();
      const fileData = (uploadMetadata as FileResponse)?.data;
      if (fileData) {
        setTimeout(() => close(), 5000);
      }
    } else if (uploadError) {
      ref.current?.complete();
    }
  }, [isUploading, uploadSuccess, uploadMetadata, uploadError]);

  useEffect(() => {
    if (listUsers.length === 0) setListUsers(users);
  }, [users]);

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

  const handleDeleteFile = (fileName: string) => {
    setListFiles((prev) => prev.filter((file) => file.name !== fileName));
  };

  const close = () => {
    const modal = document.getElementById("files") as HTMLDialogElement;
    if (modal) modal.close();
    setListFiles([]);
    setCountUploadedFiles(0);
    setCommitText("");
    setUploadedFiles(new Set());
  };

  const uploadFiles = async (event: FormEvent) => {
    event.preventDefault();
    if (listFiles.length === 0) return;

    let uploadedCount = 0;
    for (const file of listFiles) {
      try {
        await uploadFileAsync(
          file,
          "",
          folderName,
          commitText,
          organisation,
          destination,
          1,
          userSaved.permission.toLowerCase(),
          reciverId,
          taggedUsers,
          phase?.id || ""
        );
        setUploadedFiles((prev) => new Set(prev).add(file.name));
        setCountUploadedFiles((prev) => prev + 1);
        uploadedCount++;
      } catch (err) {
        console.error(`Upload failed for ${file.name}`, err);
      }
    }

    addNotification({
      permission: userSaved.permission.toLowerCase(),
      receiverId: [reciverId, ...taggedUsers],
      senderId: userSaved.id,
      message: `Il ya ${uploadedCount} nouveaux fichiers ont été téléchargés dans le dossier "${folderName}"`,
      title: "Nouveaux fichiers téléchargés",
      time: new Date(),
      path: `peer/${userSaved.id}/${folderName}`,
    });

    getFolders({
      permission: userSaved.permission.toLowerCase(),
      receiverId: reciverId,
      senderId: userSaved.id,
    });
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
            <p className="text-sm text-gray-600">
              {listFiles.length > 0 ? "Files Ready" : "Drag & Drop or Select"}
            </p>
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
              <p className="text-start font-bold">
                {countUploadedFiles > 0
                  ? `Fichier téléchargé : ${countUploadedFiles}/${listFiles.length}`
                  : `List des Fichiers : ${listFiles.length}`}
              </p>

              <div className="flex flex-wrap gap-2 bg-gray-200 p-3 rounded-lg max-h-40 overflow-y-auto">
                {listFiles.map((file) => {
                  const isUploaded = uploadedFiles.has(file.name);
                  return (
                    <div
                      key={file.name}
                      className={`badge ${
                        isUploaded ? "badge-accent" : "badge-secondary"
                      } flex items-center gap-2 p-2`}
                    >
                      {file.name}
                      {isUploaded ? (
                        <MdCheckCircle className="text-white" />
                      ) : (
                        <BsXLg
                          className="cursor-pointer text-white"
                          onClick={() => handleDeleteFile(file.name)}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="divider" />
              <label className="text-start font-bold mb-2">
                Nom du dossier:
              </label>
              <input
                type="text"
                className="input input-bordered w-full bg-gray-100"
                value={folderName}
                readOnly
              />

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
            (uploadedFiles.size === listFiles.length ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring", stiffness: 150 }}
                className="flex items-center gap-2 text-green-600 font-bold"
              >
                <MdCheckCircle className="w-8 h-8 text-green-500 animate-pulse" />
                Téléchargement réussi !
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
