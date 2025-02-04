// import { useEffect, useState } from "react";
import NavBarComponent from "../../../../../core/components/NavBar";
import { useFileMetaData } from "../../../../../core/state/FileContext";
import ListOfFiles from "../components/ListOfFiles";
import UploadFileComponet from "../components/UploadFileComponet";
// import { Data } from "../../../data/dtos/ProfileDtos";

function HomePage() {
  const { getFilesList } = useFileMetaData();
  // const [ setFiles] = useState<Data[]>([]);

  // useEffect(() => {
  //   setFiles(getFilesList());
  // }, []);

  return (
    <>
      <NavBarComponent />
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <UploadFileComponet />
        <ListOfFiles files={getFilesList()} />
      </div>
    </>
  );
}

export default HomePage;
