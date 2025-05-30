/* eslint-disable react-hooks/rules-of-hooks */
import { Outlet, useParams } from "react-router-dom";
import { usePhaseId } from "../../../../../core/state/PhaseContext";
import { useListUsers } from "../../../../../core/state/ListOfUsersContext";
import ListOfFolders from "../../../../folder/view/home/components/ListOfFolders";

const PeerPage = () => {
  const { userId, folderName, fileName } = useParams();
  const { users } = useListUsers();

  if (!userId) {
    return <p>Utilisateur non trouvé.</p>;
  }

  const user = users.find((u) => u.id === userId);
  const { phase } = usePhaseId();
  const rest = Number(phase?.endAt) - new Date().getDate();

  // if (!user) {
  //   return <p>Aucun utilisateur trouvé avec cet ID.</p>;
  // }

  return (
    <>
      <div className="card shadow-2xl w-full">
        <div className="card-body">
          <div className="flex flex-col space-y-3">
            <div className="flex flex-wrap items-center justify-between w-full px-5 md:space-y-0 space-y-1">
              <div className="flex flex-col">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-green-600 animate-pulse"></div>
                  <p className="text-xl font-bold text-gray-500">
                    Phase :{" "}
                    {phase?.name ||
                      "Il n'y a aucun travail à faire pour ce jour."}
                  </p>
                </div>
                <em className="text-xs text-gray-500 mt-2">
                  {rest > 0 ? (
                    <>
                      Rest <b>{rest} Jours</b> pour finaliser la phase.
                    </>
                  ) : phase ? (
                    "Ce dernier jour de cette phase"
                  ) : (
                    ""
                  )}
                </em>
              </div>
            </div>
          </div>
        </div>
      </div>
      {userId && !folderName && !fileName ? (
        <ListOfFolders
          peer={{
            id: user?.id as string,
            name: user?.username as string,
            type: user?.type as string,
            wilaya: user?.wilaya as string,
            org: {
              id: user?.idInstituion as string,
              name: user?.workAt as string,
            },
          }}
        />
      ) : folderName && !fileName ? (
        <Outlet />
      ) : (
        fileName && <Outlet />
      )}
    </>
  );
};

export default PeerPage;
