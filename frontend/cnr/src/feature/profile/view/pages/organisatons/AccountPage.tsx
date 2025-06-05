import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useProfileViewModel } from "../../../viewmodel/ProfileViewModel";
import { ProfileDataSourceImpl } from "../../../data/dataSource/ProfileAPIDataSource";
import { ProfileRepositoryImpl } from "../../../data/repository/ProfileRepositoryImpl";
import { useUser } from "../../../../../core/state/UserContext";
import { useListUsers } from "../../../../../core/state/ListOfUsersContext";
import { PofileUseCase } from "../../../domain/usecase/ProfileUseCase";
import { EditUserModal } from "./EditUserModal";
import { User } from "../../../../../core/dtos/data";

const TYPE_LABELS: Record<string, string> = {
  cal: "Calculateur",
  val: "Vérificateur",
  it: "Informaticien",
  finc: "Financier",
  "rest-sftp": "Responsable FTP",
};

const TYPE_STYLES: Record<string, { bg: string; text: string }> = {
  cal: { bg: "bg-blue-100", text: "text-blue-800" },
  val: { bg: "bg-green-100", text: "text-green-800" },
  it: { bg: "bg-purple-100", text: "text-purple-800" },
  finc: { bg: "bg-yellow-100", text: "text-yellow-800" },
  "rest-sftp": { bg: "bg-red-100", text: "text-red-800" },
};

export const AccountPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const profileUseCase = useMemo(() => {
    return new PofileUseCase(
      new ProfileRepositoryImpl(new ProfileDataSourceImpl())
    );
  }, []);
  const { GetAllUsers, isAllUsersLoading, isAllError } =
    useProfileViewModel(profileUseCase);
  const { userSaved } = useUser();
  const { users } = useListUsers();

  useEffect(() => {
    GetAllUsers({ permissions: userSaved.permission.toLowerCase() });
  }, [GetAllUsers, userSaved.permission]);

  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.workAt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.wilaya.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentRows = filteredUsers.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleSaveUser = (updatedUser: User) => {
    // Here you would typically make an API call to update the user
    console.log("Updated user:", updatedUser);
    // For now, we'll just close the modal
    setIsEditModalOpen(false);
    setSelectedUser(updatedUser);
  };

  const getTypeStyle = (type: string) => {
    return TYPE_STYLES[type] || { bg: "bg-gray-100", text: "text-gray-800" };
  };

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className=" rounded-lg shadow-lg p-6"
      >
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
          <h1 className="text-2xl font-bold text-gray-500">
            Gestion des Comptes
          </h1>
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {isAllUsersLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">Chargement...</p>
          </div>
        ) : isAllError ? (
          <div className="text-center py-8">
            <p className="text-red-500 text-lg">
              Erreur lors du chargement des utilisateurs
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full ">
                <thead>
                  <tr className="">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nom d'utilisateur
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Institution
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Wilaya
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Permission
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y ">
                  {currentRows.map((user) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      onClick={() => handleEditUser(user)}
                      className="hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                      role="button"
                      tabIndex={0}
                      onKeyPress={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          handleEditUser(user);
                        }
                      }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                        {user.first_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.workAt}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.wilaya}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            getTypeStyle(user.type).bg
                          } ${getTypeStyle(user.type).text}`}
                        >
                          {TYPE_LABELS[user.type.toLowerCase()] || user.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.permission === "ADMIN"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {user.permission}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.status
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {user.status ? "Actif" : "Inactif"}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Show message when no results found */}
            {filteredUsers.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 text-lg">
                  Aucun résultat trouvé pour "{searchQuery}"
                </p>
              </div>
            )}

            {/* Pagination */}
            {filteredUsers.length > 0 && (
              <div className="flex flex-col sm:flex-row justify-between items-center mt-6 space-y-4 sm:space-y-0">
                <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-700">
                      Lignes par page:
                    </span>
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
                    <span className="text-sm text-gray-700">
                      Aller à la page:
                    </span>
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
                    {Math.min(endIndex, filteredUsers.length)} sur{" "}
                    {filteredUsers.length} entrées
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
            )}
          </>
        )}

        {selectedUser && (
          <EditUserModal
            user={selectedUser}
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedUser(selectedUser);
            }}
            onSave={handleSaveUser}
          />
        )}
      </motion.div>
    </div>
  );
};
