import { MdLightMode, MdOutlineDarkMode } from "react-icons/md";
import { useTheme } from "../../state/ThemeContext";

export default function DarkModeToggle() {
  const { toggleDarkMode, isDarkMode } = useTheme();

  return (
    <div
      role="button"
      className="btn btn-ghost btn-circle"
      onClick={toggleDarkMode}
      title={isDarkMode ? "Light Mode" : "Dark Mode"}
    >
      <div className={`indicator ${isDarkMode ? "" : "text-gray-200"}`}>
        {isDarkMode ? (
          <MdLightMode className="h-5 w-5" />
        ) : (
          <MdOutlineDarkMode className="h-5 w-5" />
        )}
      </div>
    </div>
  );
}
