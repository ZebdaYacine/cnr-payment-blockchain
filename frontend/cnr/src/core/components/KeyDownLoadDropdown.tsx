import { IoDownload } from "react-icons/io5";
import { useTheme } from "../state/ThemeContext";
import { FaApple, FaLinux, FaWindows } from "react-icons/fa6";

const KeyDownloadDropdown = () => {
  const { isDarkMode } = useTheme();

  return (
    <>
      <div className="dropdown dropdown-end">
        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
          <div className="indicator flex items-center gap-2">
            <IoDownload
              className={`h-7 w-7 ${
                isDarkMode ? "" : "text-white"
              } animate-bounce`}
            />
          </div>
        </div>

        <ul
          tabIndex={0}
          className={`dropdown-content menu shadow-2xl rounded-2xl w-72 z-50 p-2 ${
            isDarkMode
              ? "bg-slate-800/95 border border-slate-700"
              : "bg-white/95 border border-gray-200"
          }`}
          style={{
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
        >
          <li>
            <a
              href="/public/key-generator-windows.exe"
              download
              className="flex items-center gap-2 font-bold"
            >
              <FaWindows className="text-blue-500 w-10 h-10" />
              Télécharger pour Windows
            </a>
          </li>
          <li>
            <a
              href="/public/key-generator-linux.out"
              download
              className="flex items-center gap-2 font-bold"
            >
              <FaLinux className="text-green-900 w-10 h-10" />
              Télécharger pour Linux
            </a>
          </li>
          <li>
            <a
              href="/public/key-generator-linux.out"
              download
              className="flex items-center gap-2 font-bold"
            >
              <FaApple className="text-gray-600 w-10 h-10" />
              Télécharger pour Mac
            </a>
          </li>
        </ul>
      </div>
    </>
  );
};

export default KeyDownloadDropdown;
