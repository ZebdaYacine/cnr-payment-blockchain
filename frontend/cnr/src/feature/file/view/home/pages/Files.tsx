import { useEffect } from "react";
import { ProfileDataSourceImpl } from "../../../data/dataSource/ProfileAPIDataSource";
import { ProfileRepositoryImpl } from "../../../data/repository/ProfileRepositoryImpl";
import { PofileUseCase } from "../../../domain/usecase/ProfileUseCase";
import { useProfileViewModel } from "../../../viewmodel/ProfileViewModel";

import ListOfFiles from "../components/ListOfFiles";
import { usePeer } from "../../../../../core/state/PeerContext";
import { useFileMetaData } from "../../../../../core/state/FileContext";
import { Outlet, useParams } from "react-router";

function FilesPage() {
  const { folderName, fileName } = useParams(); 

  const profileUseCase = new PofileUseCase(
    new ProfileRepositoryImpl(new ProfileDataSourceImpl())
  );

  const { getFiles } = useProfileViewModel(profileUseCase);
  const { getFilesList } = useFileMetaData();

  useEffect(() => {
    if (folderName) {
      getFiles({ folder: folderName });
    }
  }, [folderName, getFiles]);

  const { Peer } = usePeer();
  useEffect(() => {
    if (folderName) {
      const interval = setInterval(
        () => getFiles({ folder: folderName }),
        10000
      );
      return () => clearInterval(interval);
    }
  }, [folderName, getFiles]);

  return (
    <>
      {!fileName && folderName && (
        <ListOfFiles files={getFilesList()} peer={Peer} />
      )}
      {fileName && <Outlet />} {/* Show Outlet only if a file is selected */}
    </>
  );
}

export default FilesPage;
