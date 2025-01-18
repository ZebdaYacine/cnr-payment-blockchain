import {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from "react";

interface AuthContextType {
  isAuthentificated: boolean;
  token: string;
  Userlogged: (token: string) => void;
  Userlogout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthentificated, setAuthentification] = useState<boolean>(false);
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      setAuthentification(true);
      setToken(storedToken);
    }
  }, []);

  const Userlogged = (token: string) => {
    setAuthentification(true);
    setToken(token);
    localStorage.setItem("authToken", token);
  };

  const Userlogout = () => {
    setAuthentification(false);
    localStorage.removeItem("authToken");
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
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};
