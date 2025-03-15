import {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from "react";

interface UserContextType {
  username: string;
  email: string;
  permission: string;
  idInstituion: string;
  workAt: string;
  SetUsername: (username: string) => void;
  SetWorkAt: (workAt: string) => void;
  SetidInstituion: (idInstituion: string) => void;
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
  const [permission, setPermission] = useState<string>(
    () => localStorage.getItem("permission") || ""
  );
  const [idInstituion, setidInstituion] = useState<string>("");
  const [workAt, setWorkAt] = useState<string>("");

  useEffect(() => localStorage.setItem("permission", permission), [permission]);

  const SetUserName = (username: string) => {
    setUserName(username);
  };

  const SetPassWord = (password: string) => {
    setPassWord(password);
  };

  const SetWorkAt = (workAt: string) => {
    setWorkAt(workAt);
  };

  const SetidInstituion = (idInstituion: string) => {
    setidInstituion(idInstituion);
  };

  const SetPermission = (permission: string) => {
    setPermission(permission);
    localStorage.setItem("permission", permission);
  };

  return (
    <UserContext.Provider
      value={{
        username: username,
        email: email,
        permission: permission,
        password: password,
        idInstituion: idInstituion,
        workAt: workAt,
        SetidInstituion: SetidInstituion,
        SetWorkAt: SetWorkAt,
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
