import { RefObject } from "react";
import { useNavigate } from "react-router";

interface Props {
  profileDialogRef: RefObject<HTMLDialogElement>;
  onLogout: () => void;
}

export default function ProfileDropdown({ profileDialogRef, onLogout }: Props) {
  const navigate = useNavigate();
  return (
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
          <a
            onClick={() => {
              navigate("/settings");
            }}
          >
            Settings
          </a>
        </li>
        <li>
          <a onClick={onLogout}>Logout</a>
        </li>
      </ul>
    </div>
  );
}
