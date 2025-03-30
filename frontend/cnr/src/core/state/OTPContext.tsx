import { createContext, useState, ReactNode, useContext } from "react";

interface OTPContextType {
  isOTPSent: boolean;
  setOTPSent: (value: boolean) => void;
  isOTPConfirmed: boolean;
  setOTPConfirmed: (value: boolean) => void;
}

const OTPContext = createContext<OTPContextType | undefined>(undefined);

export const OTPProvider = ({ children }: { children: ReactNode }) => {
  const [isOTPSent, setIsOTPSent] = useState<boolean>(false);
  const [isOTPConfirmed, setIsOTPConfirmed] = useState<boolean>(false);

  return (
    <OTPContext.Provider
      value={{
        isOTPSent,
        setOTPSent: setIsOTPSent,
        isOTPConfirmed,
        setOTPConfirmed: setIsOTPConfirmed,
      }}
    >
      {children}
    </OTPContext.Provider>
  );
};

export const useOTP = (): OTPContextType => {
  const context = useContext(OTPContext);
  if (!context) {
    throw new Error("useOTP must be used within an OTPProvider");
  }
  return context;
};
