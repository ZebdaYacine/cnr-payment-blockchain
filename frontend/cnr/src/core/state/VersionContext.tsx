import { createContext, useState, ReactNode, useContext } from "react";

interface UserContextType {
  lastVersion: number;
  SetLastVersion: (version: number) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const VersionProvider = ({ children }: { children: ReactNode }) => {
  const [version, setVersion] = useState<number>(0);

  const SetLastVersion = (version: number) => {
    setVersion(version);
  };

  return (
    <UserContext.Provider
      value={{
        lastVersion: version,
        SetLastVersion: SetLastVersion,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useVersion = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useVersion must be used within a VersionProvider");
  }
  return context;
};
