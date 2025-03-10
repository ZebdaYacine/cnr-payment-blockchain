import { User } from "../../../../core/dtos/data";
import { useChild } from "../../../../core/state/InstitutionContext";
import { usePeer } from "../../../../core/state/PeerContext";
import { useUserId } from "../../../../core/state/UserContext";
import { Child } from "../../data/dtos/ProfileDtos";

function ListOfPeers() {
  const { child } = useChild();
  const { SetChild } = usePeer();
  const { idInstituion } = useUserId();

  if (!child || child.length === 0) {
    return (
      <p className="text-xl font-bold text-gray-400">No children available</p>
    );
  }

  const show = (c: Child) => {
    SetChild(c);
    console.log(c.id);
  };

  return (
    <div className="card shadow-2xl w-full">
      <div className="card-body">
        <div className="flex flex-col space-y-3">
          <p className="text-xl font-bold text-gray-400">Participants</p>
          <div className="divider" />

          {/* Peers */}
          <div className="flex flex-wrap gap-2">
            {child
              .filter((c) => c.id !== undefined && c.id !== idInstituion)
              .slice(0, -4) // Exclude last 3 elements
              .map((c) => (
                <div
                  key={c.id}
                  className="badge badge-primary hover:badge-outline cursor-pointer px-4 py-2 whitespace-nowrap"
                  onClick={() => show(c)}
                >
                  {c.name}
                </div>
              ))}
          </div>

          {/* Users Section */}
          <div className="divider" />
          <p className="text-xl font-bold text-gray-400">Calculateurs</p>
          <div className="flex flex-wrap gap-2">
            {child.slice(-4).map((user) => (
              <div
                key={user.id}
                className="badge badge-secondary hover:badge-outline cursor-pointer px-4 py-2 whitespace-nowrap"
              >
                {user.username} - {user.workAt} / {user.wilaya}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListOfPeers;
