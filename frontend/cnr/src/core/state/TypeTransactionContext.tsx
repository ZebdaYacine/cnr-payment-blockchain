import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";

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
  const [targetType, setTargetTypeState] = useState<string>(() => {
    // Load initial value from localStorage
    const stored = localStorage.getItem("targetType");
    return stored ?? "";
  });

  // Update localStorage whenever targetType changes
  useEffect(() => {
    localStorage.setItem("targetType", targetType);
  }, [targetType]);

  // Wrap setTargetType to update state and localStorage
  const setTargetType = (value: string) => {
    setTargetTypeState(value);
  };

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
