import NavBarComponent from "../../../../../core/components/NavBar";
import { useFileMetaData } from "../../../../../core/state/FileContext";
import ListOfFiles from "../components/ListOfFiles";
import UploadFileComponet from "../components/UploadFileComponet";

function HomePage() {
  const { getFilesList } = useFileMetaData();

  return (
    <>
      <NavBarComponent />
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <UploadFileComponet />
        <ListOfFiles files={getFilesList()} />
      </div>

      {/* You can open the modal using document.getElementById('ID').showModal() method */}
    </>
  );
}

export default HomePage;
