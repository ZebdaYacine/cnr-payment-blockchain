import { createContext, useState, ReactNode, useContext } from "react";
import { Folder } from "../../feature/profile/data/dtos/ProfileDtos";

interface FolderContextType {
  folders: Folder[];
  setFoldersList: (folders: Folder[]) => void;
  getFoldersList: () => Folder[];
}

const FolderCotext = createContext<FolderContextType | undefined>(undefined);

export const FolderProvider = ({ children }: { children: ReactNode }) => {
  const [folders, setFolders] = useState<Folder[]>([]);

  const setFoldrsList = (files: Folder[]) => {
    setFolders(files);
  };

  const getFoldersList = () => folders;

  return (
    <FolderCotext.Provider
      value={{
        folders: folders,
        setFoldersList: setFoldrsList,
        getFoldersList: getFoldersList,
      }}
    >
      {children}
    </FolderCotext.Provider>
  );
};

export const useFoldersMetaData = (): FolderContextType => {
  const context = useContext(FolderCotext);
  if (!context) {
    throw new Error("useFileMetaData must be used within a FileProvider");
  }
  return context;
};
