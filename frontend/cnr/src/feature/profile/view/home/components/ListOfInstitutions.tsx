import { useChild } from "../../../../../core/state/InstitutionContext";

function ListOfChildren() {
  const { child } = useChild();

  if (!child || child.length === 0) {
    return (
      <p className="text-xl font-bold text-gray-400">No children available</p>
    );
  }

  const cancel = () => {
    console.log("Cancel clicked");
  };

  const check = (str: string): string => {
    if (str === "DG") {
      return "CCR";
    } else if (str === "CCR") {
      return "AGENCE";
    }
    return "";
  };

  return (
    <div className="flex flex-col space-y-3">
      <p className="text-xl font-bold text-gray-400">
        List of {check(child[0]?.Parent?.Name || "")}
      </p>
      <div className="flex flex-wrap gap-2">
        {child.map((c) => (
          <div
            key={c.ID}
            className="badge badge-primary hover:badge-outline cursor-pointer px-4 py-2 whitespace-nowrap"
            onClick={cancel}
          >
            {c.Name}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ListOfChildren;
