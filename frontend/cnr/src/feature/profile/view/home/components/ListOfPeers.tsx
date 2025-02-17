import { useChild } from "../../../../../core/state/InstitutionContext";
import { Child } from "../../../data/dtos/ProfileDtos";

function ListOfPeers() {
  const { child } = useChild();

  if (!child || child.length === 0) {
    return (
      <p className="text-xl font-bold text-gray-400">No children available</p>
    );
  }

  const show = (c: Child) => {
    console.log(c);
  };

  return (
    <div className="flex flex-col space-y-3">
      <p className="text-xl font-bold text-gray-400">Peers</p>
      <div className="flex flex-wrap gap-2">
        {child.map((c) => (
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
  );
}

export default ListOfPeers;
