import { usePeer } from "../../../../../core/state/PeerContext";
import ListOfFolders from "../components/ListOfFolders";

function FolderPage() {
  const { Peer } = usePeer();

  return (
    <>
      <ListOfFolders peer={Peer} />
    </>
  );
}

export default FolderPage;
