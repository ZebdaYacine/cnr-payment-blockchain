import {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from "react";

interface ReceiversContextType {
  receiverIds: string[];
  addReceiverId: (receiverId: string) => void;
  removeReceiverId: (receiverId: string) => void;
  setReceiverIds: (receiverIds: string[]) => void;
  clearReceiverIds: () => void;
}

const ReceiversContext = createContext<ReceiversContextType | undefined>(
  undefined
);

export const ReceiversProvider = ({ children }: { children: ReactNode }) => {
  const [receiverIds, setReceiverIds] = useState<string[]>(() => {
    const storedIds = localStorage.getItem("receiverIds");
    return storedIds ? JSON.parse(storedIds) : [];
  });

  useEffect(() => {
    localStorage.setItem("receiverIds", JSON.stringify(receiverIds));
  }, [receiverIds]);

  const addReceiverId = (receiverId: string) => {
    setReceiverIds((prevIds) => {
      if (!prevIds.includes(receiverId)) {
        return [...prevIds, receiverId];
      }
      return prevIds;
    });
  };

  const removeReceiverId = (receiverId: string) => {
    setReceiverIds((prevIds) => prevIds.filter((id) => id !== receiverId));
  };

  const clearReceiverIds = () => {
    setReceiverIds([]);
  };

  return (
    <ReceiversContext.Provider
      value={{
        receiverIds,
        addReceiverId,
        removeReceiverId,
        setReceiverIds,
        clearReceiverIds,
      }}
    >
      {children}
    </ReceiversContext.Provider>
  );
};

export const useReceivers = (): ReceiversContextType => {
  const context = useContext(ReceiversContext);
  if (!context) {
    throw new Error("useReceivers must be used within a ReceiversProvider");
  }
  return context;
};
