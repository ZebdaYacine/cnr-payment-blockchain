import { createContext, useState, ReactNode, useContext } from "react";
import { VersionData } from "../../feature/version/data/dtos/VersionsDtos";

interface VersionMetaDataContextType {
  files: VersionData[];
  setFilesList: (files: VersionData[]) => void;
  getFilesList: () => VersionData[];
}

const VersionMetaDataContext = createContext<VersionMetaDataContextType | undefined>(undefined);

export const VersionMetaDataProvider = ({ children }: { children: ReactNode }) => {
  const [files, setFiles] = useState<VersionData[]>([]);

  const setFilesList = (files: VersionData[]) => {
    setFiles(files);
  };

  const getFilesList = () => files;

  return (
    <VersionMetaDataContext.Provider value={{ files, setFilesList, getFilesList }}>
      {children}
    </VersionMetaDataContext.Provider>
  );
};

export const useVersionMetaData = (): VersionMetaDataContextType => {
  const context = useContext(VersionMetaDataContext);
  if (!context) {
    throw new Error("useVersionMetaData must be used within a FileProvider");
  }
  return context;
};
