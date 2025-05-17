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
  receiverId: string;
  taggedUsers: string[];
  organization: string;
  destination: string;
  SetLastVersion: (version: number) => void;
  SetHashParent: (hash: string) => void;
  SetReceiverId: (id: string) => void;
  SetTaggedUsers: (users: string[]) => void;
  SetOrganization: (org: string) => void;
  SetDestination: (dest: string) => void;
  AddTaggedUser: (userId: string) => void;
  RemoveTaggedUser: (userId: string) => void;
  ClearTaggedUsers: () => void;
}

// Create the context
const VersionContext = createContext<VersionContextType | undefined>(undefined);

export const VersionProvider = ({ children }: { children: ReactNode }) => {
  // Load values from localStorage when the provider mounts
  const storedVersion = localStorage.getItem("lastVersion");
  const storedHash = localStorage.getItem("hashParent");
  const storedReceiverId = localStorage.getItem("receiverId");
  const storedTaggedUsers = localStorage.getItem("taggedUsers");
  const storedOrganization = localStorage.getItem("organization");
  const storedDestination = localStorage.getItem("destination");

  const [lastVersion, setLastVersion] = useState<number>(
    storedVersion ? Number(storedVersion) : 0
  );
  const [hashParent, setHashParent] = useState<string>(storedHash || "");
  const [receiverId, setReceiverId] = useState<string>(storedReceiverId || "");
  const [taggedUsers, setTaggedUsers] = useState<string[]>(
    storedTaggedUsers ? JSON.parse(storedTaggedUsers) : []
  );
  const [organization, setOrganization] = useState<string>(
    storedOrganization || ""
  );
  const [destination, setDestination] = useState<string>(
    storedDestination || ""
  );

  // Update localStorage whenever the state changes
  useEffect(() => {
    localStorage.setItem("lastVersion", String(lastVersion));
  }, [lastVersion]);

  useEffect(() => {
    localStorage.setItem("hashParent", hashParent);
  }, [hashParent]);

  useEffect(() => {
    localStorage.setItem("receiverId", receiverId);
  }, [receiverId]);

  useEffect(() => {
    localStorage.setItem("taggedUsers", JSON.stringify(taggedUsers));
  }, [taggedUsers]);

  useEffect(() => {
    localStorage.setItem("organization", organization);
  }, [organization]);

  useEffect(() => {
    localStorage.setItem("destination", destination);
  }, [destination]);

  const SetLastVersion = (version: number) => {
    setLastVersion(version);
  };

  const SetHashParent = (hash: string) => {
    setHashParent(hash);
  };

  const SetReceiverId = (id: string) => {
    setReceiverId(id);
  };

  const SetTaggedUsers = (users: string[]) => {
    setTaggedUsers(users);
  };

  const SetOrganization = (org: string) => {
    setOrganization(org);
  };

  const SetDestination = (dest: string) => {
    setDestination(dest);
  };

  const AddTaggedUser = (userId: string) => {
    setTaggedUsers((prev) => {
      if (!prev.includes(userId)) {
        return [...prev, userId];
      }
      return prev;
    });
  };

  const RemoveTaggedUser = (userId: string) => {
    setTaggedUsers((prev) => prev.filter((id) => id !== userId));
  };

  const ClearTaggedUsers = () => {
    setTaggedUsers([]);
  };

  return (
    <VersionContext.Provider
      value={{
        lastVersion,
        hashParent,
        receiverId,
        taggedUsers,
        organization,
        destination,
        SetLastVersion,
        SetHashParent,
        SetReceiverId,
        SetTaggedUsers,
        SetOrganization,
        SetDestination,
        AddTaggedUser,
        RemoveTaggedUser,
        ClearTaggedUsers,
      }}
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
