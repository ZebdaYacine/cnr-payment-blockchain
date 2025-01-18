import { createContext, useState, ReactNode, useContext } from "react";

interface UserContextType {
  userName: string;
  SetUserName: (username: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userName, setUserName] = useState<string>("");

  const SetUserName = (username: string) => {
    setUserName(username);
  };

  return (
    <UserContext.Provider value={{ userName, SetUserName }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserId = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserId must be used within a UserProvider");
  }
  return context;
};
