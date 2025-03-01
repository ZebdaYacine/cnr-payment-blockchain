import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { Child, ChildResponse, Folder } from "../../../data/dtos/ProfileDtos";
import { ProfileDataSourceImpl } from "../../../data/dataSource/ProfileAPIDataSource";
import { ProfileRepositoryImpl } from "../../../data/repository/ProfileRepositoryImpl";
import { PofileUseCase } from "../../../domain/usecase/ProfileUseCase";
import { useProfileViewModel } from "../../../viewmodel/ProfileViewModel";
import { useUserId } from "../../../../../core/state/UserContext";
// import SelectFilesComponent from "./SelectFilesComponet";
import FileUploadModal from "./FileUploadModal";
import SelectFilesComponent from "./SelectFilesComponet";
import { MdErrorOutline, MdOutlineAccessTime } from "react-icons/md";
import { FaFolder } from "react-icons/fa6";

interface ListOfFoldersProps {
  folders: Folder[];
  peer: Child;
}

const ITEMS_PER_PAGE = 5; // Adjust this value as needed

const dataSource = new ProfileDataSourceImpl();
const repository = new ProfileRepositoryImpl(dataSource);
const profileUseCase = new PofileUseCase(repository);

function ListOfFolders({ folders: folders, peer: peer }: ListOfFoldersProps) {
  const navigate = useNavigate();
  const { workAt, idInstituion } = useUserId();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRadio, setSelectedRadio] = useState("");

  const safeFolders = Array.isArray(folders) ? folders : [];
  const totalPages = Math.ceil(safeFolders.length / ITEMS_PER_PAGE);
  const paginatedFiles = safeFolders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleRowClick = (file: string) => {
    console.log("File clicked:", file);
    navigate("/versions-file");
  };

  const {
    GetChildInstituations,
    childInstitutionData,
    isChildInstituaionsSuccss,
  } = useProfileViewModel(profileUseCase);

  useEffect(() => {
    if (workAt && idInstituion) {
      console.log({ id: idInstituion, name: workAt });
      GetChildInstituations({ id: idInstituion, name: workAt });
    }
  }, [workAt, idInstituion]);

  useEffect(() => {
    if (childInstitutionData && isChildInstituaionsSuccss) {
      const d = childInstitutionData as ChildResponse;
      console.log(d.data || []);
    }
  }, [childInstitutionData, isChildInstituaionsSuccss]);

  return (
    <>
      <FileUploadModal />
      <div className="mt-4 w-full">
        <div className="card  shadow-xl w-full">
          <div className="card-body">
            <div className="flex flex-col">
              <div className="flex flex-wrap justify-between">
                <div className="flex flex-col space-y-3">
                  <h2 className="card-title text-center text-3xl">
                    {peer ? peer.name : "No Peer Selected"}
                  </h2>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center cursor-pointer gap-2 p-2   ">
                      <input
                        type="radio"
                        name="radio-2"
                        className="radio radio-primary"
                        onClick={() => setSelectedRadio("IN")}
                      />
                      <span className="font-semibold">IN</span>
                    </label>

                    <label className="flex items-center cursor-pointer gap-2 p-2  ">
                      <input
                        type="radio"
                        name="radio-2"
                        className="radio radio-primary"
                        onClick={() => setSelectedRadio("OUT")}
                      />
                      <span className="font-semibold">OUT</span>
                    </label>
                  </div>
                </div>
                {selectedRadio === "OUT" && (
                  <div className="flex flex-row justify-center items-center">
                    <SelectFilesComponent />
                  </div>
                )}
              </div>
            </div>
            <div className="divider"></div>

            {folders.length === 0 ? (
              <div className="flex flex-col justify-center items-center p-4 bg-red-100 rounded-lg shadow-md">
                <MdErrorOutline className="text-red-500 w-12 h-12 mb-2" />
                <p className="font-bold text-red-600 text-lg">No file found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table table-auto">
                  {/* <thead>
                    <tr>
                      <th className="text-center">Folder</th>
                    </tr>
                  </thead> */}
                  <tbody>
                    {paginatedFiles.map((folder) => (
                      <tr
                        key={folder.name}
                        className="cursor-pointer hover:bg-gray-100 transition-all duration-200"
                        onClick={() => handleRowClick(folder.name)}
                      >
                        {/* Folder Name Column */}
                        <td className="text-left p-4">
                          <div className="flex items-center gap-3">
                            <FaFolder className=" text-xl" />
                            <span className="font-medium text-lg ">
                              {folder.name}
                            </span>
                          </div>
                        </td>

                        {/* Author Column */}
                        <td className="text-center text-gray-600 p-4">
                          <div className="flex items-center justify-center gap-3">
                            <div className="avatar">
                              <div className="w-8 h-8 rounded-full">
                                <img
                                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                                  alt="User Avatar"
                                />
                              </div>
                            </div>
                            <span className="font-semibold text-blue-500">
                              by Zebda Yssine
                            </span>
                          </div>
                        </td>

                        <td className="text-center p-4">
                          <div className="badge badge-soft badge-secondary gap-2">
                            <MdOutlineAccessTime />
                            12-02-2-25
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="flex justify-center mt-4">
              <div className="join">
                <button
                  className="join-item btn"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  «
                </button>
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index}
                    className={`join-item btn ${
                      currentPage === index + 1 ? "btn-active" : ""
                    }`}
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  className="join-item btn"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  »
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ListOfFolders;
