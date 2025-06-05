import React from "react";
import { motion } from "framer-motion";

interface CCRData {
  id: string;
  code: string;
  wilaya: string;
  name: string;
  status: "active" | "inactive";
}

const dummyCCRData: CCRData[] = [
  {
    id: "1",
    code: "CCR-001",
    wilaya: "Algiers",
    name: "CCR Alger Centre",
    status: "active",
  },
  {
    id: "2",
    code: "CCR-002",
    wilaya: "Oran",
    name: "CCR Oran",
    status: "active",
  },
  {
    id: "3",
    code: "CCR-003",
    wilaya: "Constantine",
    name: "CCR Constantine",
    status: "active",
  },
  {
    id: "4",
    code: "CCR-004",
    wilaya: "Annaba",
    name: "CCR Annaba",
    status: "inactive",
  },
  {
    id: "5",
    code: "CCR-005",
    wilaya: "Blida",
    name: "CCR Blida",
    status: "active",
  },
];

export const CCRPage: React.FC = () => {
  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Centres de Chèques et Règlements (CCR)
        </h1>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Wilaya
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {dummyCCRData.map((ccr) => (
                <motion.tr
                  key={ccr.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {ccr.code}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {ccr.wilaya}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {ccr.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        ccr.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {ccr.status === "active" ? "Actif" : "Inactif"}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};
