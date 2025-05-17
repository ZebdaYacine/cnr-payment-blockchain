import { RefObject } from "react";
import { User } from "../../dtos/data";
import { useUser } from "../../state/UserContext";

interface Props {
  user: User;
  profileDialogRef: RefObject<HTMLDialogElement>;
}

export default function ProfileModal({ user, profileDialogRef }: Props) {
  const full_name = user.last_name + " " + user.first_name;
    const { userSaved } = useUser();
  
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
              src={userSaved.avatar}
              alt="Profile"
            />
            <div>
              <p className="text-lg font-semibold">
                {full_name || "Unknown User"}
              </p>
              <p className="text-sm ">{user.email || "No email provided"}</p>
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
