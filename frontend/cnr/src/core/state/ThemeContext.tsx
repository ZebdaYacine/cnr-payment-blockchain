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
    setIsDarkMode((prev) => {
      const newMode = !prev;
      localStorage.setItem("isDarkMode", newMode ? "true" : "false");
      document.documentElement.setAttribute(
        "data-theme",
        newMode ? "dark" : "light"
      );
      return newMode;
    });
  };

  const toggleLightMode = () => {
    setIsDarkMode(false);
    localStorage.setItem("isDarkMode", "false");
    document.documentElement.setAttribute("data-theme", "light");
  };

  useEffect(() => {
    const storedMode = localStorage.getItem("isDarkMode");
    if (storedMode === "true") {
      setIsDarkMode(true);
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, []);

  return (
    <ThemeContext.Provider
      value={{ isDarkMode, toggleDarkMode, toggleLightMode }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
