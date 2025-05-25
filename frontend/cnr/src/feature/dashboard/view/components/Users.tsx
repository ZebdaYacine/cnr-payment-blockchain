import { useState, useMemo } from "react";
import { WorkerSubmitFilesResponse } from "../../data/dtos/DashBoardDtos";

const USERS_PER_PAGE = 5;

interface UsersProps {
  workersErrorRateData?: WorkerSubmitFilesResponse[];
}

export default function Users({ workersErrorRateData }: UsersProps) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(
    1,
    Math.ceil((workersErrorRateData?.length || 0) / USERS_PER_PAGE)
  );
  const paginated = useMemo(() => {
    if (!workersErrorRateData) return [];
    return workersErrorRateData.slice(
      (page - 1) * USERS_PER_PAGE,
      page * USERS_PER_PAGE
    );
  }, [workersErrorRateData, page]);

  if (!workersErrorRateData) {
    return (
      <div className="card shadow-lg">
        <div className="card-body">
          <div className="text-center text-gray-600">
            Aucune donnée disponible.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow-lg w-full">
      <div className="card-body">
        <h2 className="text-lg font-bold">Utilisateurs pas encore soumis</h2>
        <div className="flex justify-between items-center mb-4">
          <div className="join">
            <button
              className="join-item btn btn-sm"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              ◀
            </button>
            <button className="join-item btn btn-sm" disabled>
              Page {page} / {totalPages}
            </button>
            <button
              className="join-item btn btn-sm"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              ▶
            </button>
          </div>
        </div>

        <div className="overflow-x-auto max-h-[500px]">
          <table className="table table-zebra">
            <thead className="bg-base-200 sticky top-0 z-10">
              <tr>
                <th>Prénom</th>
                <th>Nom</th>
                <th>Lieu de travail</th>
                <th>Wilaya</th>
                <th>Type</th>
                <th>A soumis</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center">
                    Aucun utilisateur trouvé.
                  </td>
                </tr>
              ) : (
                paginated.map((user) => (
                  <tr key={user.user_id}>
                    <td>{user.first_name}</td>
                    <td>{user.last_name}</td>
                    <td>{user.work_at}</td>
                    <td>{user.wilaya}</td>
                    <td>{user.type}</td>
                    <td>
                      {user.submitted ? (
                        <span className="badge badge-success">Oui</span>
                      ) : (
                        <span className="badge badge-error">Non</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
