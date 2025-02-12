import { useEffect } from "react";

import NavBarComponent from "../../../../../core/components/NavBar";
import { useUserId } from "../../../../../core/state/UserContext";
import ListOfVersion from "../components/ListOfVersion";
import ListOfCommits from "../components/ListOfCommits";
import { VersionData } from "../../../data/dtos/VersionsDtos";

function VersionPage() {
  const { username, email, permission } = useUserId();

  const sampleVersions: VersionData[] = [
    // {
    //   ID: "1",
    //   HashFile: "abc123",
    //   UserID: "user001",
    //   FileName: "report.pdf",
    //   Parent: "root",
    //   Note: 5,
    //   Action: "Created",
    //   Time: "2024-02-12 10:30",
    //   Organisation: "Tech Corp",
    //   Status: "Approved",
    // },
  ];

  

  useEffect(() => {
    const interval = setInterval(() => {}, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <NavBarComponent
        user={{
          username: username,
          email: email,
          permission: permission,
        }}
      />
      <div className="flex  space-y-2">
        <div className="flex flex-col w-1/4  border-r border-gray-300 p-3 overflow-scroll h-screen">
          <ListOfCommits />
        </div>
        <div className="flex flex-col w-3/4 ">
          <div className="h-3/4 border shadow overflow-scroll">
            <ListOfVersion version={sampleVersions} />
          </div>
          <div className=" h-1/4  p-3 space-y-2">
            <span className="font-bold ">
              {" "}
              Checksum: 23972987498399502319092183426593246343432434
            </span>
            <textarea
              className="textarea textarea-success w-full h-full"
              placeholder="Details about operation..."
              readOnly
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default VersionPage;
