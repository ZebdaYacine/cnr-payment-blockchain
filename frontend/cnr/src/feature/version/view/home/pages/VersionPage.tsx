// import { useEffect } from "react";
import ListOfVersion from "../components/ListOfVersion";
// import ListOfCommits from "../components/ListOfCommits";
import { FaFileAlt } from "react-icons/fa";
import { useParams } from "react-router";
import { useVersion } from "../../../../../core/state/versionContext";
import { VersionUseCase } from "../../../domain/usecase/VersionUseCase";
import { VersionRepositoryImpl } from "../../../data/repository/VersionRepositoryImpl";
import { VersionDataSourceImpl } from "../../../data/dataSource/VersionsDataSource";
import { useVersionViewModel } from "../../../viewmodel/VersionViewModel";
import { useEffect } from "react";
import { useUser } from "../../../../../core/state/UserContext";
import { useVersionMetaData } from "../../../../../core/state/versionMetaDataContext";

const dataSource = new VersionDataSourceImpl();
const repository = new VersionRepositoryImpl(dataSource);
const versionUseCase = new VersionUseCase(repository);
function VersionPage() {
  const { hashParent } = useVersion();
  const { folderName, fileName } = useParams();
  const { userSaved } = useUser();

  const userPermission = userSaved.permission;

  const { getVersion } = useVersionViewModel(versionUseCase);
  const { getFilesList } = useVersionMetaData();

  useEffect(() => {
    getVersion({
      permission: userPermission,
      folder: folderName || "",
      parent: fileName || "",
    });
  }, [folderName, userPermission, getVersion]);

  useEffect(() => {
    if (fileName) {
      const interval = setInterval(
        () =>
          getVersion({
            permission: userPermission,
            folder: folderName || "",
            parent: fileName || "",
          }),
        10000
      );
      return () => clearInterval(interval);
    }
  }, [folderName, getVersion]);
  return (
    <>
      <div className="card shadow-2xl  ">
        <div className="card-body">
          <div className="flex flex-col">
            <div className="flex flex-wrap justify-between">
              <div className="flex flex-col space-y-3">
                <div className="flex flex-col">
                  <div className="flex  items-center gap-2 ">
                    <FaFileAlt className="text-3xl" />
                    <span className="font-medium text-lg sm:text-3xl">
                      {fileName ?? "Unknown"}
                    </span>
                  </div>
                  <p className="text-xs sm:text-xl text-gray-500 mt-2 font-bold">
                    Checksum: {hashParent}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="divider"></div>
          <div className="h-72 md:h-3/4 shadow overflow-y-auto">
            <ListOfVersion version={getFilesList()} />
          </div>

          <div className="flex flex-col  md:flex-row space-y-5 md:space-y-0 md:space-x-2">
            {/* <div className="flex flex-col  md:w-1/4 w-full border-r border-gray-300 p-3 h-64 md:h-auto md:max-h-screen overflow-y-auto">
              <ListOfCommits commits={getFilesList()} />
            </div> */}

            <div className="flex flex-col md:w-3/4 w-full h-full">
              {/* <div className="h-72 md:h-3/4 shadow overflow-y-auto">
                <ListOfVersion version={getFilesList()} />
              </div> */}

              {/* <div className="h-32 md:h-1/4 p-3 space-y-2 shadow">
                <textarea
                  className="textarea textarea-success w-full h-full"
                  placeholder="Details about operation..."
                  readOnly
                />
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default VersionPage;
