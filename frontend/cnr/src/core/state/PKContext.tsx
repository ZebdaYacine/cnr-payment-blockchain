import { createContext, useState, ReactNode, useContext } from "react";

interface PkContextType {
  pk: string;
  status: boolean;
  createAt: string;
  SetPK: (value: string) => void;
  SetStatus: (value: boolean) => void;
  SetCreateAt: (value: string) => void;
}

const PKContext = createContext<PkContextType | undefined>(undefined);

export const PKProvider = ({ children }: { children: ReactNode }) => {
  const [pk, setPk] = useState<string>("");
  const [status, setStatus] = useState<boolean>(false);
  const [createAt, setCreateAt] = useState<string>("");

  const SetPK = (value: string) => setPk(value);
  const SetStatus = (value: boolean) => setStatus(value);
  const SetCreateAt = (value: string) => setCreateAt(value);

  return (
    <PKContext.Provider
      value={{
        pk,
        status,
        createAt,
        SetPK,
        SetStatus,
        SetCreateAt,
      }}
    >
      {children}
    </PKContext.Provider>
  );
};

export const usePk = (): PkContextType => {
  const context = useContext(PKContext);
  if (!context) {
    throw new Error("usePk must be used within a PKProvider");
  }
  return context;
};
