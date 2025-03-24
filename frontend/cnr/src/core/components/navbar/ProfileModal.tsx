import { RefObject } from "react";
import { User } from "../../dtos/data";

interface Props {
  user: User;
  profileDialogRef: RefObject<HTMLDialogElement>;
}

export default function ProfileModal({ user, profileDialogRef }: Props) {
  return (
    <dialog ref={profileDialogRef} className="modal">
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
  );
}
