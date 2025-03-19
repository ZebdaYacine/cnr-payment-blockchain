import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";

// Define the context type
interface VersionContextType {
  lastVersion: number;
  hashParent: string;
  SetLastVersion: (version: number) => void;
  SetHashParent: (hash: string) => void;
}

// Create the context
const VersionContext = createContext<VersionContextType | undefined>(undefined);

export const VersionProvider = ({ children }: { children: ReactNode }) => {
  // Load values from localStorage when the provider mounts
  const storedVersion = localStorage.getItem("lastVersion");
  const storedHash = localStorage.getItem("hashParent");

  const [lastVersion, setLastVersion] = useState<number>(
    storedVersion ? Number(storedVersion) : 0
  );
  const [hashParent, setHashParent] = useState<string>(storedHash || "");

  // Update localStorage whenever the state changes
  useEffect(() => {
    localStorage.setItem("lastVersion", lastVersion.toString());
  }, [lastVersion]);

  useEffect(() => {
    localStorage.setItem("hashParent", hashParent);
  }, [hashParent]);

  const SetLastVersion = (version: number) => {
    setLastVersion(version);
  };

  const SetHashParent = (hash: string) => {
    setHashParent(hash);
  };

  return (
    <VersionContext.Provider
      value={{ lastVersion, SetLastVersion, hashParent, SetHashParent }}
    >
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
