import { MdOutlineDarkMode } from "react-icons/md";
import { useTheme } from "../../state/ThemeContext";

export default function DarkModeToggle() {
  const { toggleDarkMode } = useTheme();

  return (
    <div
      role="button"
      className="btn btn-ghost btn-circle"
      onClick={toggleDarkMode}
    >
      <div className="indicator">
        <MdOutlineDarkMode className="h-5 w-5" />
      </div>
    </div>
  );
}
