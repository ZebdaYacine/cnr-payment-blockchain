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
  type: string;
  password: string;
  wilaya: string;
  userId: string;
  SetUserId: (userid: string) => void;
  SetUsername: (username: string) => void;
  SetWorkAt: (workAt: string) => void;
  SetidInstituion: (idInstituion: string) => void;
  SetEmail: (email: string) => void;
  SetPermission: (permission: string) => void;
  SetPassWord: (password: string) => void;
  SetType: (type: string) => void;
  SetWilaya: (type: string) => void;
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
  const [type, setType] = useState<string>("");
  const [wilaya, setWilaya] = useState<string>("");
  const [userId, setUserId] = useState<string>("");

  useEffect(() => localStorage.setItem("permission", permission), [permission]);

  const SetUserName = (username: string) => {
    setUserName(username);
  };

  const SetUserId = (userId: string) => {
    setUserId(userId);
  };

  const SetWilaya = (wilaya: string) => {
    setWilaya(wilaya);
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

  const SetType = (idInstituion: string) => {
    setType(idInstituion);
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
        type: type,
        wilaya: wilaya,
        userId: userId,
        SetUserId: SetUserId,
        SetidInstituion: SetidInstituion,
        SetWorkAt: SetWorkAt,
        SetUsername: SetUserName,
        SetPassWord: SetPassWord,
        SetEmail: SetEmail,
        SetPermission: SetPermission,
        SetType: SetType,
        SetWilaya: SetWilaya,
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
