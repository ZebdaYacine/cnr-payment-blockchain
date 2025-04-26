import { useNavigate, useParams } from "react-router";
import { useEffect, useState, useCallback } from "react";
import FileUploadModal from "./FileUploadModal";
import { Child } from "../../../../profile/data/dtos/ProfileDtos";
import Warning from "../../../../../core/components/Warning";
import SelectFilesComponent from "../../../../../core/components/SelectFilesComponet";
import { useUser } from "../../../../../core/state/UserContext";
import FolderTable from "./FolderTable";
import { FolderUseCase } from "../../../domain/usecase/FolderUseCase";
import { FolderDataSourceImpl } from "../../../data/dataSource/FolderAPIDataSource";
import { FolderRepositoryImpl } from "../../../data/repository/FolderRepositoryImpl";
import { useFoldersMetaData } from "../../../../../core/state/FolderContext";
import { useFolderViewModel } from "../../../viewmodel/FolderViewModel";
import { GetAgentLabel } from "../../../../../services/Utils";
import { ToastContainer } from "react-toastify";
// import { useKeys } from "../../../../../core/state/KeyContext";

interface ListOfFoldersProps {
  peer: Child;
}

function ListOfFolders({ peer }: ListOfFoldersProps) {
  const folderUseCase = new FolderUseCase(
    new FolderRepositoryImpl(new FolderDataSourceImpl())
  );

  const { getFoldersList } = useFoldersMetaData();
  const { getFolders } = useFolderViewModel(folderUseCase);

  const navigate = useNavigate();
  const [selectedRadio, setSelectedRadio] = useState("");

  const { userSaved } = useUser();

  const userPermission = userSaved.permission;
  // const { isDigitalSignatureConfirmed } = useKeys();
  // useEffect(() => {
  //   if (!isDigitalSignatureConfirmed) {
  //     navigate(`/home/reglementaion/COM-003`);
  //   }
  // }, [isDigitalSignatureConfirmed]);
  const fetchFolders = useCallback(() => {
    console.log("Fetching folders with:", { peer, userSaved, selectedRadio });

    if (
      !peer?.id ||
      !userSaved.id ||
      !peer?.org.name ||
      !userSaved.workAt ||
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
          senderId = userSaved.id;
          break;
        case "OUT":
          receiverId = userSaved.id;
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
  }, [getFolders, selectedRadio, peer?.id, userSaved, userPermission]);

  useEffect(() => {
    if (!selectedRadio || !userSaved.id || !peer?.id) {
      console.warn("🚨 Not calling fetchFolders - missing values:", {
        selectedRadio,
        userSaved,
        peer,
      });
      return;
    }
    console.log("✅ Calling fetchFolders on useEffect...");
    fetchFolders();
  }, [fetchFolders, selectedRadio, userSaved.id, peer?.id]);

  useEffect(() => {
    if (!selectedRadio || !userSaved.id || !peer?.id) {
      console.warn("🚨 Skipping interval - missing values.");
      return;
    }
    const interval = setInterval(() => fetchFolders(), 10000);
    return () => clearInterval(interval);
  }, [fetchFolders, selectedRadio, userSaved, peer?.id]);
  const { userId } = useParams();
  const handleRowClick = (folderName: string) => {
    console.log("Navigating to folder:", folderName);
    const folderNameEncoded = encodeURIComponent(folderName);
    navigate(`/home/peer/${userId}/${folderNameEncoded}`);
  };

  const foldersList = getFoldersList();

  return (
    <>
      {peer?.name && userSaved.workAt && (
        <FileUploadModal
          destination={`${peer.org.name} - ${peer.wilaya}`}
          organisation={`${userSaved.workAt} - ${userSaved.wilaya}`}
          reciverId={peer.id}
        />
      )}
      <div className="card shadow-2xl w-full ">
        <div className="card-body">
          <div className="flex flex-col">
            <div className="flex flex-wrap justify-between">
              <div className="flex flex-col  w-full">
                {peer ? (
                  <div className="flex flex-col justify-between  p-2">
                    <p className="text-3xl font-extrabold text-gray-500 ">
                      {peer.name} - {GetAgentLabel(peer.type)}
                    </p>
                    <p className="text-xl font-bold text-gray-400 mt-2 ">
                      {peer.org.name} - {peer.wilaya}
                    </p>
                  </div>
                ) : (
                  "Aucune organisation sélectionnée."
                )}
                {peer && (
                  <div className="  flex flex-wrap items-center justify-between ">
                    <div className=" flex flex-row ">
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
                    {selectedRadio === "IN" && (
                      <div>
                        <SelectFilesComponent />
                      </div>
                    )}
                    {/* {selectedRadio === "OUT" && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">
                          Accepter les conditions
                        </span>
                        <input
                          type="checkbox"
                          defaultChecked
                          className="checkbox checkbox-primary"
                        />
                      </div>
                    )} */}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="divider"></div>

          {peer ? (
            selectedRadio === "" ? (
              <Warning message="Selectionner IN or OUT" />
            ) : foldersList.length === 0 ? (
              <Warning
                message="Aucun dossier trouvé"
                notification={selectedRadio === "OUT"}
                userId={peer.id}
                senderName={peer.name}
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
      <ToastContainer />
    </>
  );
}

export default ListOfFolders;
