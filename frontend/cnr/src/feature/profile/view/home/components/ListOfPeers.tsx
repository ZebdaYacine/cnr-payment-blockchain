import { useChild } from "../../../../../core/state/InstitutionContext";
import { usePeer } from "../../../../../core/state/PeerContext";
import { useUserId } from "../../../../../core/state/UserContext";
import { Child } from "../../../data/dtos/ProfileDtos";

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
    <div className="card  shadow-xl w-full">
      <div className="card-body">
        <div className="flex flex-col space-y-3">
          <p className="text-xl font-bold text-gray-400">Peers</p>
          <div className="divider" />
          <div className="flex flex-wrap gap-2">
            {child
              .filter((c) => c.id !== undefined && c.id !== idInstituion)
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
        </div>
      </div>
    </div>
  );
}

export default ListOfPeers;
