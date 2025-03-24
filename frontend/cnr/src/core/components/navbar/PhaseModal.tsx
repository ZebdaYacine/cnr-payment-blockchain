import { RefObject } from "react";
import { PhaseResponse } from "../../../feature/profile/data/dtos/ProfileDtos";

interface Props {
  phase: PhaseResponse | null;
  phaseDialogRef: RefObject<HTMLDialogElement>;
}

export default function PhaseModal({ phase, phaseDialogRef }: Props) {
  return (
    <dialog ref={phaseDialogRef} className="modal">
      <div className="modal-box">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg">Information sur la Phase</h3>
        <div className="py-4">
          <div className="mt-4 space-y-2">
            <p>
              <span className="font-semibold">Phase:</span>{" "}
              {phase?.name || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Date debut :</span>{" "}
              {phase?.startAt || "Not Assigned"} de ce mois
            </p>
            <p>
              <span className="font-semibold">Date fin :</span>{" "}
              {phase?.endAt || "Not Assigned"} de ce mois
            </p>
            <span className="font-semibold">Description:</span>
            <p className="text-center font-semibold text-blue-600">
              {phase?.description || "None"}
            </p>
          </div>
        </div>

        <div className="modal-action">
          <button
            className="btn"
            onClick={() => phaseDialogRef.current?.close()}
          >
            Close
          </button>
        </div>
      </div>
    </dialog>
  );
}
