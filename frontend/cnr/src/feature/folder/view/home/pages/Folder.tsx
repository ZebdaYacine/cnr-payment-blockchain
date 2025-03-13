import { useEffect } from "react";
import { FolderDataSourceImpl } from "../../../data/dataSource/FolderAPIDataSource";
import { FolderRepositoryImpl } from "../../../data/repository/FolderRepositoryImpl";
import { FolderUseCase } from "../../../domain/usecase/FolderUseCase";
import { useFolderViewModel } from "../../../viewmodel/FolderViewModel";
import { usePeer } from "../../../../../core/state/PeerContext";
import ListOfFolders from "../components/ListOfFolders";
import { useFoldersMetaData } from "../../../../../core/state/FolderContext";

function FolderPage() {
  const profileUseCase = new FolderUseCase(
    new FolderRepositoryImpl(new FolderDataSourceImpl())
  );

  const { getFoldersList } = useFoldersMetaData();
  const { getFolders } = useFolderViewModel(profileUseCase);

  useEffect(() => {
    getFolders();
  }, [getFolders]);

  useEffect(() => {
    const interval = setInterval(() => getFolders(), 10000);
    return () => clearInterval(interval);
  }, [getFolders]);

  const { Peer } = usePeer();

  return (
    <>
      <ListOfFolders
        folders={Array.isArray(getFoldersList()) ? getFoldersList() : []}
        peer={Peer}
      />
    </>
  );
}

export default FolderPage;
