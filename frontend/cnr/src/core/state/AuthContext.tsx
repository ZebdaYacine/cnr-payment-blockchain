import {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from "react";
import { useResetState } from "../../services/Utils";

interface AuthContextType {
  isAuthentificated: boolean;
  token: string | null;
  Userlogged: (token: string) => void;
  Userlogout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("authToken")
  );
  const isAuthentificated = !!token;

  const resetState = useResetState();

  // const clearLocalStorage = () => {
  //   const keysToRemove = [
  //     "token",
  //     "user",
  //     "otpSent",
  //     "otpConfirmed",
  //     "privateKey",
  //     "digitalSignature",
  //     "digitalSignatureConfirmed",
  //     "currentPhase",
  //     "files",
  //     "notifications",
  //     "version",
  //     "folders",
  //     "versionMetaData",
  //     "listOfUsers",
  //     "peer",
  //     "theme",
  //   ];
  //   keysToRemove.forEach((key) => localStorage.removeItem(key));
  // };

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("authToken"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const Userlogged = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem("authToken", newToken);
  };

  const Userlogout = () => {
    resetState();
    setToken(null);
    localStorage.clear();
    // localStorage.removeItem("isDigitalSignatureConfirmed");
    // localStorage.removeItem("authToken");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthentificated, token, Userlogged, Userlogout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
