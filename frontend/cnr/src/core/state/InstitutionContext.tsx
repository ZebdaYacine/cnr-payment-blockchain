import { createContext, useContext, useState, ReactNode } from "react";
import { Child } from "../../feature/profile/data/dtos/ProfileDtos";

interface ChildContextType {
  child: Child[];
  SetChild: (child: Child[]) => void;
  GetChild: () => Child[];
}

const ChildContext = createContext<ChildContextType | undefined>(undefined);

export const ChildProvider = ({ children }: { children: ReactNode }) => {
  const [child, setChild] = useState<Child[]>([]);

  const SetChild = (newChild: Child[]) => {
    setChild(newChild);
  };

  const GetChild = () => child;

  return (
    <ChildContext.Provider value={{ child, SetChild, GetChild }}>
      {children}
    </ChildContext.Provider>
  );
};

export const useChild = (): ChildContextType => {
  const context = useContext(ChildContext);
  if (!context) {
    throw new Error("useChild must be used within a ChildProvider");
  }
  return context;
};
