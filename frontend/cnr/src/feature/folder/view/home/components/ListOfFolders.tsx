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

  const { workAt, permission } = useUserId();

  const userPermission = permission || localStorage.getItem("permission");

  const fetchFolders = useCallback(() => {
    if (!peer?.name || !workAt || selectedRadio === "") return;
    if (userPermission)
      switch (selectedRadio) {
        case "IN":
          getFolders({
            organisation: workAt,
            destination: peer.name,
            permission: userPermission.toLowerCase(),
          });
          break;
        case "OUT":
          getFolders({
            organisation: peer.name,
            destination: workAt,
            permission: userPermission.toLowerCase(),
          });
          break;
      }
  }, [getFolders, selectedRadio, peer, workAt]);

  useEffect(() => {
    if (selectedRadio !== "") {
      fetchFolders();
    }
  }, [fetchFolders, selectedRadio]);

  useEffect(() => {
    if (selectedRadio === "") return;
    const interval = setInterval(() => fetchFolders(), 10000);
    return () => clearInterval(interval);
  }, [fetchFolders, selectedRadio]);

  const handleRowClick = (folderName: string) => {
    console.log("Navigating to folder:", folderName);
    navigate(`/home/${folderName}`);
  };

  const foldersList = getFoldersList();

  return (
    <>
      {peer?.name && workAt && (
        <FileUploadModal destination={peer.name} organisation={workAt} />
      )}
      <div className="card shadow-2xl w-full">
        <div className="card-body">
          <div className="flex flex-col">
            <div className="flex flex-wrap justify-between">
              <div className="flex flex-col space-y-3">
                <h2 className="card-title text-center text-3xl">
                  {peer ? peer.name : "Aucune organisation sélectionnée."}
                </h2>
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

          {selectedRadio === "" ? (
            <Warning message="Aucun dossier trouvé" />
          ) : foldersList.length === 0 ? (
            <Warning message="Aucun dossier trouvé" />
          ) : (
            <div className="overflow-x-auto">
              <FolderTable
                listOfFolders={foldersList}
                onRowClick={handleRowClick}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ListOfFolders;
