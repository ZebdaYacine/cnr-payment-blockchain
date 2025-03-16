import { useChildren } from "../../../../core/state/InstitutionContext";
import { useListUsers } from "../../../../core/state/ListOfUsersContext";
// import { useListUsers } from "../../../../core/state/ListOfUsersContext";
import { usePeer } from "../../../../core/state/PeerContext";
import { useUserId } from "../../../../core/state/UserContext";
import { Child } from "../../data/dtos/ProfileDtos";

function ListOfPeers() {
  const { children: child } = useChildren();
  const { users } = useListUsers();
  const { SetChild } = usePeer();
  const { idInstituion } = useUserId();

  if (!child || child.length === 0) {
    return (
      <p className="text-xl font-bold text-gray-400">No children available</p>
    );
  }

  const show = (c: Child) => {
    SetChild(c);
    console.log(c);
  };

  return (
    <div className="card shadow-2xl w-full">
      <div className="card-body">
        <div className="flex flex-col space-y-3">
          <p className="text-xl font-bold text-gray-500">Participants</p>
          <div className="divider" />

          <div className="flex flex-wrap gap-2">
            {!users || users.length === 0 ? (
              <p className="text-lg font-semibold text-gray-400">
                Aucun utilisateur disponible
              </p>
            ) : (
              users
                .filter((c) => c.id !== undefined && c.id !== idInstituion)
                .map((user) => {
                  // Function to get agent label based on user type
                  const getAgentLabel = (type: string): string => {
                    switch (type) {
                      case "CAL":
                        return "Calculateur";
                      case "FINC":
                        return "Vérificateur financie";
                      case "VAL":
                        return "Verificateur";
                      case "IT":
                        return "Agent Informatique";
                      case "RESP-SFTP":
                        return "Responsable SFTP";
                      default:
                        return `Agent ${type}`;
                    }
                  };

                  return (
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
                      className="badge badge-secondary hover:badge-outline 
                      cursor-pointer px-3 py-2 whitespace-nowrap
                      "
                    >
                      {user.username} - {user.workAt} - {user.wilaya} /{" "}
                      {getAgentLabel(user.type)}
                    </div>
                  );
                })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListOfPeers;
