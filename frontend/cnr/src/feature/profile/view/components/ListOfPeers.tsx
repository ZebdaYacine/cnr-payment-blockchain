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
    console.log(c.id);
  };

  return (
    <div className="card shadow-2xl w-full">
      <div className="card-body">
        <div className="flex flex-col space-y-3">
          <p className="text-xl font-bold text-gray-400">Participants</p>
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
            {users
              .filter((c) => c.id !== undefined && c.id !== idInstituion)
              .map((user) => (
                <div
                  key={user.id}
                  onClick={() =>
                    show({
                      id: user.id,
                      name: `${user.username} - ${user.workAt} / ${user.wilaya}`,
                      parent: {
                        id: user.idInstituion,
                        name: user.username,
                      },
                    })
                  }
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
