import {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from "react";

// Define the context type
interface VersionContextType {
  lastVersion: number;
  SetLastVersion: (version: number) => void;
}

// Create the context
const VersionContext = createContext<VersionContextType | undefined>(undefined);

export const VersionProvider = ({ children }: { children: ReactNode }) => {
  const [lastVersion, setLastVersion] = useState<number>(0);

  const SetLastVersion = (version: number) => {
    setLastVersion(version);
  };
  useEffect(() => {
    setLastVersion(lastVersion);
  }, [lastVersion]);

  return (
    <VersionContext.Provider value={{ lastVersion, SetLastVersion }}>
      {children}
    </VersionContext.Provider>
  );
};

// Custom hook to use VersionContext
export const useVersion = (): VersionContextType => {
  const context = useContext(VersionContext);
  if (!context) {
    throw new Error("useVersion must be used within a VersionProvider");
  }
  return context;
};
