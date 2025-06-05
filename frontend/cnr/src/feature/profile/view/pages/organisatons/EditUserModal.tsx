import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User } from "../../../../../core/dtos/data";
import { useProfileViewModel } from "../../../viewmodel/ProfileViewModel";
import { ProfileDataSourceImpl } from "../../../data/dataSource/ProfileAPIDataSource";
import { ProfileRepositoryImpl } from "../../../data/repository/ProfileRepositoryImpl";
import { PofileUseCase } from "../../../domain/usecase/ProfileUseCase";
import LoadingBar, { LoadingBarRef } from "react-top-loading-bar";

interface EditUserModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedUser: User) => void;
}

const TYPE_OPTIONS = [
  { value: "cal", label: "Calculateur" },
  { value: "val", label: "Vérificateur" },
  { value: "it", label: "Informaticien" },
  { value: "finc", label: "Financier" },
  { value: "rest-sftp", label: "Responsable FTP" },
];

const DOD_TYPE_OPTIONS = [{ value: "finc", label: "Financier" }];

export const EditUserModal: React.FC<EditUserModalProps> = ({
  user,
  isOpen,
  onClose,
  onSave,
}) => {
  const [editedUser, setEditedUser] = useState<User>(user);
  const [isUpdating, setIsUpdating] = useState(false);
  const profileUseCase = useMemo(() => {
    return new PofileUseCase(
      new ProfileRepositoryImpl(new ProfileDataSourceImpl())
    );
  }, []);
  const profileViewModel = useProfileViewModel(profileUseCase);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      // Update user type and status in a single call
      await profileViewModel.updateUser({
        userId: user.id,
        newType: editedUser.type,
        status: editedUser.status,
      });

      // Update other user data
      const updatedUser = {
        ...editedUser,
        permission: editedUser.permission,
      };

      // Call onSave with the updated user data
      onSave(updatedUser);

      // Close the modal after successful save
      onClose();
    } catch (error) {
      console.error("Error updating user:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Check if user is in DOD type
  const isDODUser = user.workAt?.toLowerCase().includes("dod");

  // Get appropriate type options based on user type
  const typeOptions = isDODUser ? DOD_TYPE_OPTIONS : TYPE_OPTIONS;

  const ref = useRef<LoadingBarRef>(null);

  useEffect(() => {
    if (isUpdating) {
      ref.current?.continuousStart();
    } else {
      ref.current?.complete();
    }
  }, [isUpdating]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-500 bg-opacity-75 transition-opacity p-4">
          <LoadingBar color="#3b82f6" ref={ref} shadow={true} />

          <div className="flex items-center justify-center min-h-screen text-center">
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md rounded-lg bg-white text-left shadow-xl transform transition-all sm:my-8"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <form onSubmit={handleSubmit}>
                <div className="bg-white px-6 pt-6 pb-4">
                  <h3
                    className="text-lg leading-6 font-medium text-gray-900 mb-6"
                    id="modal-headline"
                  >
                    {editedUser.last_name} {editedUser.first_name}
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Type d'institution
                      </label>
                      <div className="relative">
                        <select
                          value={editedUser.type}
                          onChange={(e) =>
                            setEditedUser({
                              ...editedUser,
                              type: e.target.value,
                            })
                          }
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm appearance-none bg-white"
                          disabled={isDODUser}
                        >
                          {typeOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                      </div>
                      {isDODUser && (
                        <p className="mt-1 text-sm text-gray-500">
                          Les utilisateurs DOD sont toujours de type Financier
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Permission
                      </label>
                      <select
                        value={editedUser.permission}
                        onChange={(e) =>
                          setEditedUser({
                            ...editedUser,
                            permission: e.target.value,
                          })
                        }
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
                        <option value="ADMIN">Admin</option>
                        <option value="USER">Utilisateur</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Statut
                      </label>
                      <select
                        value={editedUser.status ? "active" : "inactive"}
                        onChange={(e) =>
                          setEditedUser({
                            ...editedUser,
                            status: e.target.value === "active",
                          })
                        }
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
                        <option value="active">Actif</option>
                        <option value="inactive">Inactif</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-6 py-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUpdating ? "Mise à jour..." : "Enregistrer"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
