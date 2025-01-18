import { createContext, useState, ReactNode, useContext } from "react";

interface UserContextType {
  username: string;
  SetUsername: (username: string) => void;
  password: string;
  SetPassWord: (password: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [username, setUserName] = useState<string>("");
  const [password, setPassWord] = useState<string>("");

  const SetUserName = (username: string) => {
    setUserName(username);
  };

  const SetPassWord = (username: string) => {
    setPassWord(username);
  };

  return (
    <UserContext.Provider
      value={{
        username: username,
        SetUsername: SetUserName,
        password: password,
        SetPassWord: SetPassWord,
      }}
    >
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
