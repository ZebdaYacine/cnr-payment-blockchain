import { useEffect } from "react";
import { FileDataSourceImpl } from "../../../data/dataSource/FileAPIDataSource";
import { FileRepositoryImpl } from "../../../data/repository/FileRepositoryImpl";
import { FileUseCase } from "../../../domain/usecase/FileUseCase";
import { useFileViewModel } from "../../../viewmodel/FileViewModel";

import ListOfFiles from "../components/ListOfFiles";
// import { usePeer } from "../../../../../core/state/PeerContext";
import { useFileMetaData } from "../../../../../core/state/FileContext";
import { Outlet, useParams } from "react-router";
import { useUserId } from "../../../../../core/state/UserContext";

function FilesPage() {
  const { folderName, fileName } = useParams();

  const fileUseCase = new FileUseCase(
    new FileRepositoryImpl(new FileDataSourceImpl())
  );

  const { getFiles } = useFileViewModel(fileUseCase);
  const { getFilesList } = useFileMetaData();
  const { permission } = useUserId();

  const userPermission = permission || localStorage.getItem("permission");
  useEffect(() => {
    if (folderName && userPermission) {
      getFiles({
        permission: userPermission.toLowerCase(),
        folder: folderName,
      });
    }
  }, [folderName, userPermission, getFiles]);

  useEffect(() => {
    if (folderName) {
      const interval = setInterval(
        () =>
          getFiles({
            permission: permission.toLowerCase(),
            folder: folderName,
          }),
        10000
      );
      return () => clearInterval(interval);
    }
  }, [folderName, getFiles]);

  return (
    <>
      {!fileName && folderName && <ListOfFiles files={getFilesList()} />}
      {fileName && <Outlet />} {/* Show Outlet only if a file is selected */}
    </>
  );
}

export default FilesPage;
