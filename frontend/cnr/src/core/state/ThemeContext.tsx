import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  toggleLightMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (isDarkMode) {
      localStorage.setItem("isDarkMode", "");
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      localStorage.setItem("isDarkMode", "true");
      document.documentElement.setAttribute("data-theme", "dark");
    }
  };

  useEffect(() => {
    const storedMode = localStorage.getItem("isDarkMode");
    if (storedMode === "") {
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }, []);

  const toggleLightMode = () => {
    setIsDarkMode(false);
    document.documentElement.setAttribute("data-theme", "light");
  };

  return (
    <ThemeContext.Provider
      value={{ isDarkMode, toggleDarkMode, toggleLightMode }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useThme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
