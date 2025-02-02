import { createContext, useState, ReactNode, useContext } from "react";
import { Data } from "../../feature/profile/data/dtos/ProfileDtos";

interface FileContextType {
  files: Data[];
  setFilesList: (files: Data[]) => void;
  getFilesList: () => Data[];
}

const FileContext = createContext<FileContextType | undefined>(undefined);

export const FileProvider = ({ children }: { children: ReactNode }) => {
  const [files, setFiles] = useState<Data[]>([]);

  const setFilesList = (files: Data[]) => {
    setFiles(files);
  };

  const getFilesList = () => files;

  return (
    <FileContext.Provider value={{ files, setFilesList, getFilesList }}>
      {children}
    </FileContext.Provider>
  );
};

export const useFileMetaData = (): FileContextType => {
  const context = useContext(FileContext);
  if (!context) {
    throw new Error("useFileMetaData must be used within a FileProvider");
  }
  return context;
};
