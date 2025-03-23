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
  phases: string[];
  SetUserId: (userid: string) => void;
  SetUsername: (username: string) => void;
  SetWorkAt: (workAt: string) => void;
  SetidInstituion: (idInstituion: string) => void;
  SetEmail: (email: string) => void;
  SetPermission: (permission: string) => void;
  SetPassWord: (password: string) => void;
  SetType: (type: string) => void;
  SetWilaya: (type: string) => void;
  SetPhases: (phases: string[]) => void;
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
  const [phases, setPhases] = useState<string[]>(() => {
    const storedPhases = localStorage.getItem("phases");
    return storedPhases ? JSON.parse(storedPhases) : [];
  });

  // Store permission when it changes
  useEffect(() => {
    localStorage.setItem("permission", permission);
  }, [permission]);

  // Store phases when they change
  useEffect(() => {
    localStorage.setItem("phases", JSON.stringify(phases));
  }, [phases]);

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

  const SetType = (type: string) => {
    setType(type);
  };

  const SetPermission = (permission: string) => {
    setPermission(permission);
    localStorage.setItem("permission", permission);
  };

  const SetPhases = (phases: string[]) => {
    setPhases(phases);
  };

  return (
    <UserContext.Provider
      value={{
        username,
        email,
        permission,
        password,
        idInstituion,
        workAt,
        type,
        wilaya,
        userId,
        phases,
        SetUserId,
        SetidInstituion,
        SetWorkAt,
        SetUsername: SetUserName,
        SetPassWord,
        SetEmail,
        SetPermission,
        SetType,
        SetWilaya,
        SetPhases,
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
