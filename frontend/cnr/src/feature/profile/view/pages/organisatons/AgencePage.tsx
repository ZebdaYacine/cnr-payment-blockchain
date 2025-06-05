import React, { useState } from "react";
import { motion } from "framer-motion";

interface AgenceData {
  id: string;
  code: string;
  name: string;
  wilaya: string;
  phone: string;
  address: string;
  status: "active" | "inactive";
  ccr: {
    id: string;
    code: string;
    name: string;
    address: string;
    phone: string;
    status: "active" | "inactive";
  };
}

const AgenceData: AgenceData[] = [
  {
    id: "1",
    code: "Agence-001",
    name: "Agence Alger Centre",
    wilaya: "Alger",
    phone: "021 23 45 67",
    address: "123 Rue Didouche Mourad, Alger Centre",
    status: "active",
    ccr: {
      id: "CCR-001",
      code: "CCR-001",
      name: "CCR Alger Centre",
      address: "45 Rue Larbi Ben M'hidi, Alger Centre",
      phone: "021 23 45 68",
      status: "active",
    },
  },
  {
    id: "2",
    code: "Agence-002",
    name: "Agence Oran",
    wilaya: "Oran",
    phone: "041 34 56 78",
    address: "45 Boulevard de la Soummam, Oran",
    status: "active",
    ccr: {
      id: "CCR-002",
      code: "CCR-002",
      name: "CCR Oran",
      address: "12 Boulevard Colonel Lotfi, Oran",
      phone: "041 34 56 79",
      status: "active",
    },
  },
  {
    id: "3",
    code: "Agence-003",
    name: "Agence Constantine",
    wilaya: "Constantine",
    phone: "031 45 67 89",
    address: "78 Avenue Aissat Idir, Constantine",
    status: "active",
    ccr: {
      id: "CCR-003",
      code: "CCR-003",
      name: "CCR Constantine",
      address: "56 Boulevard de l'Abîme, Constantine",
      phone: "031 45 67 90",
      status: "active",
    },
  },
  {
    id: "4",
    code: "Agence-004",
    name: "Agence Annaba",
    wilaya: "Annaba",
    phone: "038 56 78 90",
    address: "12 Rue de la République, Annaba",
    status: "active",
    ccr: {
      id: "CCR-004",
      code: "CCR-004",
      name: "CCR Annaba",
      address: "23 Boulevard de la Mer, Annaba",
      phone: "038 56 78 91",
      status: "active",
    },
  },
  {
    id: "5",
    code: "Agence-005",
    name: "Agence Blida",
    wilaya: "Blida",
    phone: "025 67 89 01",
    address: "34 Avenue des Martyrs, Blida",
    status: "active",
    ccr: {
      id: "CCR-005",
      code: "CCR-005",
      name: "CCR Blida",
      address: "67 Rue Colonel Amirouche, Blida",
      phone: "025 67 89 02",
      status: "active",
    },
  },
  {
    id: "6",
    code: "Agence-006",
    name: "Agence Tlemcen",
    wilaya: "Tlemcen",
    phone: "043 78 90 12",
    address: "56 Boulevard Colonel Lotfi, Tlemcen",
    status: "active",
    ccr: {
      id: "CCR-006",
      code: "CCR-006",
      name: "CCR Tlemcen",
      address: "89 Rue de la République, Tlemcen",
      phone: "043 78 90 13",
      status: "active",
    },
  },
  {
    id: "7",
    code: "Agence-007",
    name: "Agence Sétif",
    wilaya: "Sétif",
    phone: "036 89 01 23",
    address: "89 Avenue de l'Indépendance, Sétif",
    status: "active",
    ccr: {
      id: "CCR-007",
      code: "CCR-007",
      name: "CCR Sétif",
      address: "12 Boulevard des Martyrs, Sétif",
      phone: "036 89 01 24",
      status: "active",
    },
  },
  {
    id: "8",
    code: "Agence-008",
    name: "Agence Skikda",
    wilaya: "Skikda",
    phone: "038 90 12 34",
    address: "23 Rue du 19 Mars, Skikda",
    status: "active",
    ccr: {
      id: "CCR-008",
      code: "CCR-008",
      name: "CCR Skikda",
      address: "45 Avenue de l'Indépendance, Skikda",
      phone: "038 90 12 35",
      status: "active",
    },
  },
  {
    id: "9",
    code: "Agence-009",
    name: "Agence Batna",
    wilaya: "Batna",
    phone: "033 01 23 45",
    address: "67 Avenue de la Révolution, Batna",
    status: "active",
    ccr: {
      id: "CCR-009",
      code: "CCR-009",
      name: "CCR Batna",
      address: "90 Boulevard Colonel Amirouche, Batna",
      phone: "033 01 23 46",
      status: "active",
    },
  },
  {
    id: "10",
    code: "Agence-010",
    name: "Agence Mostaganem",
    wilaya: "Mostaganem",
    phone: "045 12 34 56",
    address: "45 Boulevard de la Mer, Mostaganem",
    status: "active",
    ccr: {
      id: "CCR-010",
      code: "CCR-010",
      name: "CCR Mostaganem",
      address: "78 Rue de la République, Mostaganem",
      phone: "045 12 34 57",
      status: "active",
    },
  },
];

export const AgencePage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [expandedAgence, setExpandedAgence] = useState<string | null>(null);

  const totalPages = Math.ceil(AgenceData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentRows = AgenceData.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1);
  };

  const toggleCCR = (agenceId: string) => {
    setExpandedAgence(expandedAgence === agenceId ? null : agenceId);
  };

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Agences et Centres de Chèques Ruraux
        </h1>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Wilaya
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Téléphone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Adresse
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CCR
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentRows.map((agence) => (
                <React.Fragment key={agence.id}>
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {agence.code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {agence.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {agence.wilaya}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {agence.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {agence.address}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          agence.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {agence.status === "active" ? "Actif" : "Inactif"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleCCR(agence.id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {expandedAgence === agence.id ? "Masquer" : "Afficher"}
                      </button>
                    </td>
                  </motion.tr>
                  {expandedAgence === agence.id && (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 bg-gray-50">
                        <div className="ml-8">
                          <h3 className="text-lg font-semibold text-gray-700 mb-2">
                            Centre de Chèques Ruraux
                          </h3>
                          <div className="bg-white p-4 rounded-lg shadow">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium text-gray-900">
                                  {agence.ccr.name}
                                </h4>
                                <p className="text-sm text-gray-500">
                                  {agence.ccr.code}
                                </p>
                              </div>
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  agence.ccr.status === "active"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {agence.ccr.status === "active"
                                  ? "Actif"
                                  : "Inactif"}
                              </span>
                            </div>
                            <div className="mt-2 text-sm text-gray-600">
                              <p>{agence.ccr.address}</p>
                              <p>{agence.ccr.phone}</p>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 space-y-4 sm:space-y-0">
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">Lignes par page:</span>
              <select
                value={rowsPerPage}
                onChange={(e) =>
                  handleRowsPerPageChange(Number(e.target.value))
                }
                className="rounded-md border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">Aller à la page:</span>
              <input
                type="number"
                min={1}
                max={totalPages}
                value={currentPage}
                onChange={(e) => {
                  const page = Math.min(
                    Math.max(1, Number(e.target.value)),
                    totalPages
                  );
                  handlePageChange(page);
                }}
                className="w-16 rounded-md border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <span className="text-sm text-gray-700">
              Affichage de {startIndex + 1} à{" "}
              {Math.min(endIndex, AgenceData.length)} sur {AgenceData.length}{" "}
              entrées
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md transition-colors ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
              title="Première page"
            >
              ««
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md transition-colors ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
              title="Page précédente"
            >
              «
            </button>

            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  if (totalPages <= 7) return true;
                  if (page === 1 || page === totalPages) return true;
                  if (page >= currentPage - 1 && page <= currentPage + 1)
                    return true;
                  return false;
                })
                .map((page, index, array) => {
                  if (index > 0 && array[index - 1] !== page - 1) {
                    return (
                      <React.Fragment key={`ellipsis-${page}`}>
                        <span className="px-2 text-gray-500">...</span>
                        <button
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-1 rounded-md transition-colors ${
                            currentPage === page
                              ? "bg-blue-500 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {page}
                        </button>
                      </React.Fragment>
                    );
                  }
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 rounded-md transition-colors ${
                        currentPage === page
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-md transition-colors ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
              title="Page suivante"
            >
              »
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-md transition-colors ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
              title="Dernière page"
            >
              »»
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
