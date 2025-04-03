import {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from "react";
import { ResetState } from "../../services/Utils";

interface AuthContextType {
  isAuthentificated: boolean;
  token: string | null;
  messageError: string | null;
  setMessageError: (msg: string | null) => void;
  Userlogged: (token: string) => void;
  Userlogout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("authToken")
  );
  const [messageError, setMessageError] = useState<string | null>(null);
  const isAuthentificated = !!token;

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
    setMessageError(null); // clear error on success
  };

  const Userlogout = () => {
    setToken(null);
    ResetState();
    localStorage.removeItem("authToken");
    setMessageError(null); // reset error on logout
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthentificated,
        token,
        messageError,
        setMessageError,
        Userlogged,
        Userlogout,
      }}
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
