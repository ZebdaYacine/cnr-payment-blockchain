import { useEffect } from "react";
import ListOfVersion from "../components/ListOfVersion";
import ListOfCommits from "../components/ListOfCommits";
import { VersionData } from "../../../data/dtos/VersionsDtos";
import { FaFileAlt } from "react-icons/fa";
import { useParams } from "react-router";

function VersionPage() {
  const versionDataArray: VersionData[] = [
    {
      ID: "1",
      HashFile: "abc123",
      UserID: "user01",
      FileName: "report.pdf",
      Parent: "0",
      Note: 5,
      Path: "/files/reports",
      Action: "created",
      Time: "2025-03-17T10:00:00Z",
      Organisation: "TechCorp",
      Status: "approved",
    },
    {
      ID: "2",
      HashFile: "def456",
      UserID: "user02",
      FileName: "design.png",
      Parent: "1",
      Note: 4,
      Path: "/files/designs",
      Action: "updated",
      Time: "2025-03-17T11:00:00Z",
      Organisation: "DesignStudio",
      Status: "pending",
    },
    {
      ID: "3",
      HashFile: "ghi789",
      UserID: "user03",
      FileName: "presentation.pptx",
      Parent: "1",
      Note: 3,
      Path: "/files/presentations",
      Action: "deleted",
      Time: "2025-03-17T12:00:00Z",
      Organisation: "EduFirm",
      Status: "archived",
    },
    {
      ID: "4",
      HashFile: "jkl012",
      UserID: "user04",
      FileName: "contract.docx",
      Parent: "2",
      Note: 5,
      Path: "/files/contracts",
      Action: "reviewed",
      Time: "2025-03-17T13:00:00Z",
      Organisation: "LegalFirm",
      Status: "approved",
    },
  ];

  const { fileName } = useParams();

  useEffect(() => {
    const interval = setInterval(() => {}, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="card shadow-2xl">
        <div className="card-body">
          <div className="flex flex-col">
            <div className="flex flex-wrap justify-between">
              <div className="flex flex-col space-y-3">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <FaFileAlt className="text-3xl" />
                    <span className="font-medium text-2xl sm:text-3xl">
                      {fileName ?? "Unknown"}
                    </span>
                  </div>
                  <h1 className="text-xs sm:text-xl text-gray-500 mt-2 font-bold">
                    Checksum: 23972987498399502319092183426593246343432434
                  </h1>
                </div>
              </div>
            </div>
          </div>

          <div className="divider"></div>

          <div className="flex flex-col  md:flex-row space-y-5 md:space-y-0 md:space-x-2">
            <div className="flex flex-col  md:w-1/4 w-full border-r border-gray-300 p-3 h-64 md:h-auto md:max-h-screen overflow-y-auto">
              <ListOfCommits />
            </div>

            <div className="flex flex-col md:w-3/4 w-full h-full">
              <div className="h-72 md:h-3/4 shadow overflow-y-auto">
                <ListOfVersion version={versionDataArray} />
              </div>

              <div className="h-32 md:h-1/4 p-3 space-y-2 shadow">
                <textarea
                  className="textarea textarea-success w-full h-full"
                  placeholder="Details about operation..."
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default VersionPage;
