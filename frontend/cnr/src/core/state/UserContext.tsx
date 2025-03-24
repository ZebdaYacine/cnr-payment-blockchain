import {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from "react";
import { User } from "../dtos/data";

interface UserContextType {
  userSaved: User;
  SetUser: (user: Partial<User>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser
      ? JSON.parse(storedUser)
      : {
          id: "",
          email: "",
          password: "",
          username: "",
          idInstituion: "",
          workAt: "",
          type: "",
          permission: "",
          wilaya: "",
          phases: [],
        };
  });

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  const SetUser = (updatedFields: Partial<User>) => {
    setUser((prev) => ({ ...prev, ...updatedFields }));
  };

  return (
    <UserContext.Provider
      value={{
        userSaved: user,
        SetUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
