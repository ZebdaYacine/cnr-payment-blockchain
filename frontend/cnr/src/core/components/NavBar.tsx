import { FaShoppingCart } from "react-icons/fa";
import { IoNotificationsSharp } from "react-icons/io5";
import { MdOutlineDarkMode } from "react-icons/md";
import { useTheme } from "../state/ThemeContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext";
import { useLogger } from "../../services/useLogger";

interface NavBarProps {
  user: { username?: string; email?: string; permission?: string };
}

function NavBarComponent({ user }: NavBarProps) {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const { isAuthentificated, Userlogout } = useAuth();
  const { debug } = useLogger();

  const logoutEvent = () => {
    Userlogout();
    debug("USER IS AUTHENTIFICATED : " + isAuthentificated);
    if (!isAuthentificated) navigate("/");
  };

  return (
    <div
      className={
        isDarkMode
          ? "navbar bg-zinc-800 text-white"
          : "navbar bg-blue-700 texe-black"
      }
    >
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">{user.username}</a>{" "}
      </div>
      <div className="flex-none">
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <div className="indicator">
              <FaShoppingCart className="h-5 w-5" />
              <span className="badge badge-sm indicator-item">8</span>
            </div>
          </div>
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
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
          <div
            tabIndex={0}
            className="card card-compact dropdown-content bg-base-100 z-[1] mt-3 w-52 shadow"
          >
            <div className="card-body">
              <span className="text-lg font-bold">8 Items</span>
              <span className="text-info">Subtotal: $999</span>
              <div className="card-actions">
                <button className="btn btn-primary btn-block">View cart</button>
              </div>
            </div>
          </div>
        </div>
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
            <li>
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
  );
}

export default NavBarComponent;
