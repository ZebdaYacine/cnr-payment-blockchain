import { createContext, useState, ReactNode, useContext } from "react";

interface UserContextType {
  username: string;
  email: string;
  permission: string;
  SetUsername: (username: string) => void;
  SetEmail: (email: string) => void;
  SetPermission: (permission: string) => void;
  password: string;
  SetPassWord: (password: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [username, setUserName] = useState<string>("");
  const [password, setPassWord] = useState<string>("");
  const [email, SetEmail] = useState<string>("");
  const [permission, SetPermission] = useState<string>("");

  const SetUserName = (username: string) => {
    setUserName(username);
  };

  const SetPassWord = (password: string) => {
    setPassWord(password);
  };

  return (
    <UserContext.Provider
      value={{
        username: username,
        email: email,
        permission: permission,
        password: password,
        SetUsername: SetUserName,
        SetPassWord: SetPassWord,
        SetEmail: SetEmail,
        SetPermission: SetPermission,
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
