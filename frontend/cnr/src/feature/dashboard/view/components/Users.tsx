import React, { useState, useMemo } from "react";

// ✅ Define the User type
type User = {
  name: string;
  country: string;
  institution: string;
  poste: string;
  fichiers: number;
  versions: number;
  phase: string;
  mois: string;
};

// ✅ Define only sortable keys
type SortableKey = "name" | "poste" | "institution" | "fichiers" | "versions";

const USERS_PER_PAGE = 5;

export default function Users() {
  const [users] = useState<User[]>([
    {
      name: "Hart Hagerty",
      country: "United States",
      institution: "CNAS Alger",
      poste: "Desktop Support Technician",
      fichiers: 134,
      versions: 98,
      phase: "Développement",
      mois: "Janvier",
    },
    {
      name: "Brice Swyre",
      country: "China",
      institution: "CNAS Oran",
      poste: "Tax Accountant",
      fichiers: 89,
      versions: 73,
      phase: "Test",
      mois: "Février",
    },
    {
      name: "Marjy Ferencz",
      country: "Russia",
      institution: "CNAS Tlemcen",
      poste: "Office Assistant I",
      fichiers: 150,
      versions: 120,
      phase: "Production",
      mois: "Janvier",
    },
    {
      name: "Jane Doe",
      country: "Canada",
      institution: "CNAS Alger",
      poste: "Engineer",
      fichiers: 112,
      versions: 88,
      phase: "Développement",
      mois: "Mars",
    },
    {
      name: "Yancy Tear",
      country: "Brazil",
      institution: "CNAS Tlemcen",
      poste: "Community Outreach Specialist",
      fichiers: 76,
      versions: 55,
      phase: "Test",
      mois: "Mars",
    },
  ]);

  const [moisFilter, setMoisFilter] = useState("All");
  const [sortKey, setSortKey] = useState<SortableKey>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return moisFilter === "All"
      ? users
      : users.filter((u) => u.mois === moisFilter);
  }, [moisFilter, users]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];
      if (typeof aValue === "string") {
        return sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    });
  }, [filtered, sortKey, sortOrder]);

  const totalPages = Math.ceil(sorted.length / USERS_PER_PAGE);
  const paginated = sorted.slice(
    (page - 1) * USERS_PER_PAGE,
    page * USERS_PER_PAGE
  );

  const handleSort = (key: SortableKey) => {
    if (sortKey === key) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  return (
    <div className="card shadow-lg">
      <div className="card-body">
        <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
          <div>
            <label className="mr-2 font-semibold">Filtrer par mois:</label>
            <select
              className="select select-bordered select-sm"
              value={moisFilter}
              onChange={(e) => {
                setMoisFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="All">Tous</option>
              <option value="Janvier">Janvier</option>
              <option value="Février">Février</option>
              <option value="Mars">Mars</option>
              <option value="Avril">Avril</option>
              <option value="Mai">Mai</option>
            </select>
          </div>

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
                <th
                  onClick={() => handleSort("name")}
                  className="cursor-pointer"
                >
                  Utilisateur{" "}
                  {sortKey === "name" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th
                  onClick={() => handleSort("poste")}
                  className="cursor-pointer"
                >
                  Poste{" "}
                  {sortKey === "poste" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th
                  onClick={() => handleSort("institution")}
                  className="cursor-pointer"
                >
                  Institution{" "}
                  {sortKey === "institution" &&
                    (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th
                  onClick={() => handleSort("fichiers")}
                  className="cursor-pointer"
                >
                  Fichiers{" "}
                  {sortKey === "fichiers" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th
                  onClick={() => handleSort("versions")}
                  className="cursor-pointer"
                >
                  Versions{" "}
                  {sortKey === "versions" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th>Taux d'erreur</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((u, i) => {
                const tauxErreur = u.fichiers
                  ? (100 - (u.versions / u.fichiers) * 100).toFixed(1)
                  : "N/A";
                return (
                  <tr key={i}>
                    <td>
                      <div className="font-bold">{u.name}</div>
                      <div className="text-sm opacity-50">{u.country}</div>
                    </td>
                    <td>{u.poste}</td>
                    <td>{u.institution}</td>
                    <td>{u.fichiers}</td>
                    <td>{u.versions}</td>
                    <td>{tauxErreur}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
