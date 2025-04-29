import { createContext, useState, ReactNode, useContext } from "react";

interface TypeTransactionContextType {
  targetType: string;
  setTargetType: (value: string) => void;
}

const TypeTransactionContext = createContext<
  TypeTransactionContextType | undefined
>(undefined);

export const TypeTransactionProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [targetType, setTargetType] = useState<string>("");

  return (
    <TypeTransactionContext.Provider value={{ targetType, setTargetType }}>
      {children}
    </TypeTransactionContext.Provider>
  );
};

export const useTypeTransaction = (): TypeTransactionContextType => {
  const context = useContext(TypeTransactionContext);
  if (!context) {
    throw new Error(
      "useTypeTransaction must be used within a TypeTransactionProvider"
    );
  }
  return context;
};
