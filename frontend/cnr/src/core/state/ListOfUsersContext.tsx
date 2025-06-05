import { createContext, useState, ReactNode, useContext } from "react";
import { User } from "../dtos/data";

interface UsersListContextType {
  users: User[];
  all_users: User[];
  setAllUsersList: (users: User[]) => void;
  setUsersList: (users: User[]) => void;

  getUsersList: () => User[];
}

const UsersContext = createContext<UsersListContextType | undefined>(undefined);

export const UsersListProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [all_users, setAllUsers] = useState<User[]>([]);

  const setUsersList = (users: User[]) => {
    setUsers(users);
  };

  const setAllUsersList = (users: User[]) => {
    setAllUsers(users);
  };

  const getUsersList = () => users;

  return (
    <UsersContext.Provider
      value={{
        users: users,
        setUsersList: setUsersList,
        getUsersList: getUsersList,
        all_users: all_users,
        setAllUsersList: setAllUsersList,
      }}
    >
      {children}
    </UsersContext.Provider>
  );
};

export const useListUsers = (): UsersListContextType => {
  const context = useContext(UsersContext);
  if (!context) {
    throw new Error("useFileMetaData must be used within a FileProvider");
  }
  return context;
};
