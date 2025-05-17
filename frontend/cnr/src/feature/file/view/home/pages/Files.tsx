import { useEffect } from "react";
import { FileDataSourceImpl } from "../../../data/dataSource/FileAPIDataSource";
import { FileRepositoryImpl } from "../../../data/repository/FileRepositoryImpl";
import { FileUseCase } from "../../../domain/usecase/FileUseCase";
import { useFileViewModel } from "../../../viewmodel/FileViewModel";

import ListOfFiles from "../components/ListOfFiles";
// import { usePeer } from "../../../../../core/state/PeerContext";
import { useFileMetaData } from "../../../../../core/state/FileContext";
import { Outlet, useParams } from "react-router";
import { useUser } from "../../../../../core/state/UserContext";

function FilesPage() {
  const { folderName, fileName } = useParams();

  const fileUseCase = new FileUseCase(
    new FileRepositoryImpl(new FileDataSourceImpl())
  );

  const { getFiles } = useFileViewModel(fileUseCase);
  const { getFilesList } = useFileMetaData();
  const { userSaved } = useUser();

  const userPermission = userSaved.permission;

  useEffect(() => {
    if (folderName && userPermission) {
      getFiles({
        permissions: userPermission.toLowerCase(),
        folder: folderName,
      });
    }
  }, [folderName, userPermission, getFiles]);

  useEffect(() => {
    if (folderName && !fileName) {
      const interval = setInterval(
        () =>
          getFiles({
            permissions: userPermission.toLowerCase(),
            folder: folderName,
          }),
        10000
      );
      return () => clearInterval(interval);
    }
  }, [folderName, fileName, getFiles]);

  return (
    <>
      {!fileName && folderName && <ListOfFiles files={getFilesList()} />}
      {fileName && <Outlet />} 
    </>
  );
}

export default FilesPage;
