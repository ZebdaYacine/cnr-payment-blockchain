import { useEffect, useRef, useState } from "react";
import { useListUsers } from "../../../../core/state/ListOfUsersContext";
import { usePeer } from "../../../../core/state/PeerContext";
import { usePhaseId } from "../../../../core/state/PhaseContext";
import { useUser } from "../../../../core/state/UserContext";
import { Child } from "../../data/dtos/ProfileDtos";
import { User } from "../../../../core/dtos/data";

function ListOfPeers() {
  const { users } = useListUsers();
  const { SetChild } = usePeer();
  const { userSaved } = useUser();
  const { phase } = usePhaseId();

  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const selectRef = useRef<HTMLSelectElement>(null);

  const rest = Number(phase?.endAt) - new Date().getDate();

  const handleSelectChange = () => {
    const selected = selectRef.current?.value;
    if (!selected) return;

    if (selected === "Les intervenant de ce phases") {
      const currentPhaseId = phase?.id || "";
      const filtered = users.filter((user) =>
        user.phases.includes({
          id: currentPhaseId,
        })
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  };

  useEffect(() => {
    setFilteredUsers(users);
    if (selectRef.current) {
      selectRef.current.value = "Tout les intervenants";
    }
  }, [users]);

  const show = (c: Child) => {
    SetChild(c);
    console.log("Selected Child:", c);
  };

  const getAgentLabel = (type: string): string => {
    switch (type) {
      case "CAL":
        return "Calculateur";
      case "FINC":
        return "Vérificateur financier";
      case "VAL":
        return "Vérificateur";
      case "IT":
        return "Agent Informatique";
      case "RESP-SFTP":
        return "Responsable SFTP";
      default:
        return `Agent ${type}`;
    }
  };

  return (
    <div className="card shadow-2xl w-full">
      <div className="card-body">
        <div className="flex flex-col space-y-3">
          <div className="flex flex-wrap items-center justify-between w-full px-5 md:space-y-0 space-y-1">
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-green-600 animate-pulse"></div>
                <p className="text-xl font-bold text-gray-500">
                  Phase : {phase?.name}
                </p>
              </div>
              <em className="text-xs text-gray-500 mt-2">
                {rest > 0 ? (
                  <>
                    Rest <b>{rest} Jours</b> pour finaliser la phase.
                  </>
                ) : (
                  "Ce dernier jour de cette phase"
                )}
              </em>
            </div>

            <select
              className="select select-primary font-semibold"
              onChange={handleSelectChange}
              ref={selectRef}
            >
              <option>Les intervenant de ce phases</option>
              <option>Tout les intervenants</option>
            </select>
          </div>

          <div className="divider" />

          <div className="flex flex-wrap gap-2">
            {filteredUsers.length === 0 ? (
              <div className="flex flex-col">
                <p className="text-sm font-semibold text-gray-400">
                  Aucun utilisateur disponible
                </p>
              </div>
            ) : (
              filteredUsers
                .filter(
                  (c) => c.id !== undefined && c.id !== userSaved.idInstituion
                )
                .map((user) => (
                  <div
                    key={user.id}
                    onClick={() =>
                      show({
                        id: user.id,
                        name: user.username,
                        type: getAgentLabel(user.type),
                        wilaya: user.wilaya,
                        org: {
                          id: user.idInstituion,
                          name: user.workAt,
                        },
                      })
                    }
                    className="badge badge-primary lg:badge-lg font-semibold hover:badge-outline cursor-pointer px-3 py-2 whitespace-nowrap"
                  >
                    {user.username} - {user.workAt} - {user.wilaya} /{" "}
                    {getAgentLabel(user.type)}
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListOfPeers;
