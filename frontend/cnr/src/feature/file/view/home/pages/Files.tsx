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
  const { fileName } = useParams();
  const profileUseCase = new PofileUseCase(
    new ProfileRepositoryImpl(new ProfileDataSourceImpl())
  );

  const { getFiles } = useProfileViewModel(profileUseCase);
  const { getFilesList } = useFileMetaData();
  useEffect(() => {
    getFiles();
  }, [getFiles]);

  const { Peer } = usePeer();
  useEffect(() => {
    const interval = setInterval(() => getFiles(), 10000);
    return () => clearInterval(interval);
  }, [getFiles]);

  return (
    <>
      {!fileName && <ListOfFiles files={getFilesList()} peer={Peer} />}
      <Outlet />
    </>
  );
}

export default FilesPage;
