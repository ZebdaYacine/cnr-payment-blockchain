import { createContext, useContext, useState, ReactNode } from "react";
import { Child } from "../../feature/profile/data/dtos/ProfileDtos";

interface ChildContextType {
  children: Child[];
  SetChildren: (child: Child[]) => void;
  GetChild: () => Child[];
}

const ChildContext = createContext<ChildContextType | undefined>(undefined);

export const ChildProvider = ({ children }: { children: ReactNode }) => {
  const [child, setChildren] = useState<Child[]>([]);

  const SetChild = (newChild: Child[]) => {
    setChildren(newChild);
  };

  const GetChild = () => child;

  return (
    <ChildContext.Provider
      value={{ children: child, SetChildren: SetChild, GetChild }}
    >
      {children}
    </ChildContext.Provider>
  );
};

export const useChildren = (): ChildContextType => {
  const context = useContext(ChildContext);
  if (!context) {
    throw new Error("useChild must be used within a ChildProvider");
  }
  return context;
};
