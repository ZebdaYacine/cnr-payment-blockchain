import { useNavigate } from "react-router";
import { useEffect, useState, useCallback } from "react";
import FileUploadModal from "./FileUploadModal";
import { Child } from "../../../../profile/data/dtos/ProfileDtos";
import Warning from "../../../../../core/components/Warning";
import SelectFilesComponent from "../../../../../core/components/SelectFilesComponet";
import { useUserId } from "../../../../../core/state/UserContext";
import FolderTable from "./FolderTable";
import { FolderUseCase } from "../../../domain/usecase/FolderUseCase";
import { FolderDataSourceImpl } from "../../../data/dataSource/FolderAPIDataSource";
import { FolderRepositoryImpl } from "../../../data/repository/FolderRepositoryImpl";
import { useFoldersMetaData } from "../../../../../core/state/FolderContext";
import { useFolderViewModel } from "../../../viewmodel/FolderViewModel";

interface ListOfFoldersProps {
  peer: Child;
}

function ListOfFolders({ peer }: ListOfFoldersProps) {
  const profileUseCase = new FolderUseCase(
    new FolderRepositoryImpl(new FolderDataSourceImpl())
  );

  const { getFoldersList } = useFoldersMetaData();
  const { getFolders } = useFolderViewModel(profileUseCase);

  const navigate = useNavigate();
  const [selectedRadio, setSelectedRadio] = useState("");

  const { workAt, wilaya, permission, userId } = useUserId();

  const userPermission = permission || localStorage.getItem("permission");

  const fetchFolders = useCallback(() => {
    console.log("Fetching folders with:", { peer, userId, selectedRadio });

    if (
      !peer?.id ||
      !userId ||
      !peer?.org.name ||
      !workAt ||
      selectedRadio === ""
    ) {
      console.warn(
        "🚨 Missing required parameters for getFolders. Aborting fetch."
      );
      return;
    }

    if (userPermission) {
      let receiverId, senderId;

      switch (selectedRadio) {
        case "IN":
          receiverId = peer.id;
          senderId = userId;
          break;
        case "OUT":
          receiverId = userId;
          senderId = peer.id;
          break;
        default:
          console.warn("🚨 Invalid selectedRadio value:", selectedRadio);
          return;
      }

      console.log("✅ Calling getFolders with:", {
        receiverId,
        senderId,
        userPermission,
      });

      getFolders({
        receiverId,
        senderId,
        permission: userPermission.toLowerCase(),
      });
    }
  }, [getFolders, selectedRadio, peer?.id, userId, userPermission]);

  useEffect(() => {
    if (!selectedRadio || !userId || !peer?.id) {
      console.warn("🚨 Not calling fetchFolders - missing values:", {
        selectedRadio,
        userId,
        peer,
      });
      return;
    }

    console.log("✅ Calling fetchFolders on useEffect...");
    fetchFolders();
  }, [fetchFolders, selectedRadio, userId, peer?.id]);

  useEffect(() => {
    if (!selectedRadio || !userId || !peer?.id) {
      console.warn("🚨 Skipping interval - missing values.");
      return;
    }

    const interval = setInterval(() => fetchFolders(), 10000);
    return () => clearInterval(interval);
  }, [fetchFolders, selectedRadio, userId, peer?.id]);

  const handleRowClick = (folderName: string) => {
    console.log("Navigating to folder:", folderName);
    navigate(`/home/${folderName}`);
  };

  const foldersList = getFoldersList();

  return (
    <>
      {peer?.name && workAt && (
        <FileUploadModal
          destination={`${peer.org.name} - ${peer.wilaya}`}
          organisation={`${workAt} - ${wilaya}`}
          reciverId={peer.id}
        />
      )}
      <div className="card shadow-2xl w-full ">
        <div className="card-body">
          <div className="flex flex-col">
            <div className="flex flex-wrap justify-between">
              <div className="flex flex-col space-y-3">
                {peer ? (
                  <div className="flex flex-col justify-between  p-6 ">
                    <p className="text-3xl font-extrabold text-gray-500 ">
                      {peer.org.name} - {peer.wilaya}
                    </p>
                    <p className="text-xl font-bold text-gray-400 mt-2 ">
                      {peer.name} - {peer.type}
                    </p>
                  </div>
                ) : (
                  "Aucune organisation sélectionnée."
                )}
                {peer && (
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center cursor-pointer gap-2 p-2">
                      <input
                        type="radio"
                        name="radio-2"
                        className="radio radio-primary"
                        onChange={() => setSelectedRadio("OUT")}
                      />
                      <span className="font-semibold">OUT</span>
                    </label>

                    <label className="flex items-center cursor-pointer gap-2 p-2">
                      <input
                        type="radio"
                        name="radio-2"
                        className="radio radio-primary"
                        onChange={() => setSelectedRadio("IN")}
                      />
                      <span className="font-semibold">IN</span>
                    </label>
                  </div>
                )}
              </div>
              {selectedRadio === "IN" && (
                <div className="flex flex-row justify-center items-center">
                  <SelectFilesComponent />
                </div>
              )}
            </div>
          </div>
          <div className="divider"></div>

          {peer ? (
            selectedRadio === "" ? (
              <Warning message="Selectionner IN or OUT" user={"jjjjlmalad"} />
            ) : foldersList.length === 0 ? (
              <Warning
                message="Aucun dossier trouvé"
                notification={selectedRadio === "OUT"}
                user={peer.name}
              />
            ) : (
              <div className="overflow-x-auto">
                <FolderTable
                  listOfFolders={foldersList}
                  onRowClick={handleRowClick}
                />
              </div>
            )
          ) : (
            <Warning message="Aucun Participant  Selecetione" />
          )}
        </div>
      </div>
    </>
  );
}

export default ListOfFolders;
