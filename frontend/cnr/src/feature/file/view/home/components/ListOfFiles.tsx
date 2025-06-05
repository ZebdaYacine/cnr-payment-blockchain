import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { MdErrorOutline, MdFilterList } from "react-icons/md";
import { FaFolderTree } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import { useVersion } from "../../../../../core/state/versionContext";
import { Data } from "../../../data/dtos/FileDtos";
import DownloaderButton from "../../../../../core/components/DownloaderButton";
// import { useKeys } from "../../../../../core/state/KeyContext";

interface ListOfFilesProps {
  files: Data[];
}

const ITEMS_PER_PAGE = 5;

function ListOfFiles({ files: files }: ListOfFilesProps) {
  const navigate = useNavigate();
  const { folderName } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [checkedFiles, setCheckedFiles] = useState<Data[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const {
    SetLastVersion,
    SetHashParent,
    SetReceiverId,
    SetTaggedUsers,
    SetOrganization,
    SetDestination,
    ClearTaggedUsers,
  } = useVersion();

  // Filter files based on search term and status
  const filteredFiles = files.filter((file) => {
    const matchesSearch =
      file.FileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.ID.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || file.Status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredFiles.length / ITEMS_PER_PAGE);
  const paginatedFiles = filteredFiles.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  // const { isDigitalSignatureConfirmed } = useKeys();
  // useEffect(() => {
  //   if (!isDigitalSignatureConfirmed) {
  //     navigate(`/home/reglementaion/COM-003`);
  //   }
  // }, [isDigitalSignatureConfirmed]);
  const handleCheckboxChange = (file: Data, checked: boolean) => {
    if (checked) {
      setCheckedFiles([...checkedFiles, file]);
    } else setCheckedFiles(checkedFiles.filter((f) => f.ID !== file.ID));
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const newFiles = files.filter(
        (file) => !checkedFiles.some((f) => f.ID === file.ID)
      );
      const d = newFiles.filter(
        (file) => !checkedFiles.some(() => file.Status === "Invalid")
      );
      setCheckedFiles([...checkedFiles, ...d]);
    } else {
      const remaining = checkedFiles.filter(
        (f) => !files.some((file) => file.ID === f.ID)
      );
      setCheckedFiles(remaining);
    }
  };

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [files, totalPages, currentPage]);

  const handleRowClick = (
    fileName: string,
    last_version: number,
    hashPrent: string,
    userId: string,
    organization: string,
    destination: string,
    taggedUsers: string[]
  ) => {
    // Reset all states first
    SetHashParent("");
    SetLastVersion(0);
    SetReceiverId("");
    SetTaggedUsers([]);
    SetOrganization("");
    SetDestination("");
    ClearTaggedUsers();

    // Set new values
    SetHashParent(hashPrent);
    SetLastVersion(last_version);
    SetReceiverId(userId);
    SetOrganization(organization);
    SetDestination(destination);
    SetTaggedUsers(taggedUsers);

    console.log("Navigating to file version:", fileName);
    navigate(`/home/peer/${userId}/${folderName}/${fileName}`);
  };

  return (
    <div className="w-full space-y-6 mt-5">
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <FaFolderTree className="text-3xl text-blue-500" />
            <span className="font-medium text-2xl md:text-3xl text-gray-800">
              {folderName ?? "Unknown"}
            </span>
          </div>

          {checkedFiles.length > 0 && (
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary"
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
                <span className="text-sm font-medium">Sélectionner Tout</span>
              </label>
              <DownloaderButton checkedFiles={checkedFiles} />
            </div>
          )}
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white/50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200"
              placeholder="Rechercher un fichier..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 border  rounded-lg  text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <MdFilterList className="h-5 w-5 mr-2" />
            Filtres
          </motion.button>
        </div>

        {/* Filter Options */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4  rounded-lg"
            >
              <div className="flex flex-wrap gap-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-blue-500"
                    name="status"
                    value="all"
                    checked={statusFilter === "all"}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  />
                  <span className="ml-2">Tous</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-blue-500"
                    name="status"
                    value="Valid"
                    checked={statusFilter === "Valid"}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  />
                  <span className="ml-2">Valide</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-blue-500"
                    name="status"
                    value="Invalid"
                    checked={statusFilter === "Invalid"}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  />
                  <span className="ml-2">Invalide</span>
                </label>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Files Table */}
      <div className="backdrop-blur-sm rounded-xl shadow-xl overflow-hidden">
        {files.length === 0 ? (
          <div className="flex flex-col justify-center items-center p-8">
            <MdErrorOutline className="text-red-500 w-12 h-12 mb-2" />
            <p className="font-bold text-red-600 text-lg">
              Aucun fichier trouvé
            </p>
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="flex flex-col justify-center items-center p-8">
            <p className="font-bold text-gray-600 text-lg">
              Aucun résultat trouvé
            </p>
            <p className="text-gray-500">
              Essayez de modifier vos critères de recherche
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y ">
              <thead className=" backdrop-blur-sm">
                <tr>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sélection
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fichier
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Utilisateur
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Version actuelle
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre de versions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <AnimatePresence>
                  {paginatedFiles.map((file, index) => (
                    <motion.tr
                      key={file.ID}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="hover:bg-gray-50/80 backdrop-blur-sm transition-all duration-200 cursor-pointer group"
                      onDoubleClick={() =>
                        handleRowClick(
                          file.FileName,
                          file.LastVersion,
                          file.HashFile,
                          file.reciverId,
                          file.Organisation || "",
                          "",
                          file.TaggedUsers || []
                        )
                      }
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {file.Status === "Valid" && (
                          <input
                            id={file.ID}
                            type="checkbox"
                            className="checkbox checkbox-primary"
                            checked={checkedFiles.some((f) => f.ID === file.ID)}
                            onChange={(e) =>
                              handleCheckboxChange(file, e.target.checked)
                            }
                          />
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                        {file.ID}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                        {file.FileName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                        {file.reciverId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                        {file.Time}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            file.Status === "Valid"
                              ? "bg-green-100 text-green-950"
                              : "bg-red-100 text-red-950"
                          }`}
                        >
                          {file.Status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Version {file.Version}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            file.Version > 1
                              ? "bg-purple-100 text-purple-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {file.LastVersion - 1} autres versions
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center p-4">
            <nav
              className="relative z-0 inline-flex rounded-lg shadow-sm -space-x-px"
              aria-label="Pagination"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-4 py-2 rounded-l-lg border border-gray-300 bg-white text-sm font-medium ${
                  currentPage === 1
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Précédent
              </motion.button>

              {Array.from({ length: totalPages }, (_, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === index + 1
                      ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {index + 1}
                </motion.button>
              ))}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center px-4 py-2 rounded-r-lg border border-gray-300 bg-white text-sm font-medium ${
                  currentPage === totalPages
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Suivant
              </motion.button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}

export default ListOfFiles;
