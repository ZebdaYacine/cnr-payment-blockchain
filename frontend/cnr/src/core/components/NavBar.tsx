import { useRef } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { IoNotificationsSharp } from "react-icons/io5";
import { MdOutlineDarkMode } from "react-icons/md";
import { useTheme } from "../state/ThemeContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext";
import { useLogger } from "../../services/useLogger";

interface NavBarProps {
  user: {
    username?: string;
    email?: string;
    permission?: string;
    workAt?: string;
    idInstituion?: string;
    type?: string;
  };
}

function NavBarComponent({ user }: NavBarProps) {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const { isAuthentificated, Userlogout } = useAuth();
  const { debug } = useLogger();
  const profileDialogRef = useRef<HTMLDialogElement>(null);

  const logoutEvent = () => {
    Userlogout();
    debug("USER IS AUTHENTIFICATED : " + isAuthentificated);
    if (!isAuthentificated) navigate("/");
  };

  return (
    <>
      <div
        className={
          isDarkMode
            ? "navbar bg-slate-950 text-white"
            : "navbar bg-blue-600 text-black"
        }
      >
        <div className="flex-1">
          <a className="btn btn-ghost text-xl text-cyan-50">
            {user.username} - {user.workAt} / {user.type}
          </a>
        </div>
        <div className="flex-none">
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle"
            >
              <div className="indicator">
                <FaShoppingCart className="h-5 w-5" />
                <span className="badge badge-sm indicator-item">8</span>
              </div>
            </div>
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle"
            >
              <div className="indicator">
                <IoNotificationsSharp className="h-5 w-5 " />
                <span className="badge badge-sm indicator-item">8</span>
              </div>
            </div>
            <div
              role="button"
              className="btn btn-ghost btn-circle"
              onClick={toggleDarkMode}
            >
              <div className="indicator">
                <MdOutlineDarkMode className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* Profile Dropdown */}
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img
                  alt="User Profile"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li onClick={() => profileDialogRef.current?.showModal()}>
                <a className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </a>
              </li>
              <li>
                <a>Settings</a>
              </li>
              <li>
                <a onClick={logoutEvent}>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      <dialog ref={profileDialogRef} id="Profile" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">User Profile</h3>
          <div className="py-4">
            <div className="flex items-center space-x-3">
              <img
                className="w-16 h-16 rounded-full border"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                alt="Profile"
              />
              <div>
                <p className="text-lg font-semibold">
                  {user.username || "Unknown User"}
                </p>
                <p className="text-sm text-gray-500">
                  {user.email || "No email provided"}
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <p>
                <span className="font-semibold">Permission:</span>{" "}
                {user.permission || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Work At:</span>{" "}
                {user.workAt || "Not Assigned"}
              </p>
              <p>
                <span className="font-semibold">Institution ID:</span>{" "}
                {user.idInstituion || "None"}
              </p>
            </div>
          </div>

          <div className="modal-action">
            <button
              className="btn"
              onClick={() => profileDialogRef.current?.close()}
            >
              Close
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}

export default NavBarComponent;
