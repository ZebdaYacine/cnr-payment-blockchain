import { useEffect } from "react";

import ListOfVersion from "../components/ListOfVersion";
import ListOfCommits from "../components/ListOfCommits";
import { VersionData } from "../../../data/dtos/VersionsDtos";

function VersionPage() {
  const sampleVersions: VersionData[] = [];

  useEffect(() => {
    const interval = setInterval(() => {}, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className=" h-full w-full card shadow-2xl ">
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 ">
          <div className="flex flex-col md:w-1/4 border-r border-gray-300 p-3 overflow-auto h-64 md:h-screen">
            <ListOfCommits />
          </div>
          <div className="flex flex-col md:w-3/4 w-full">
            <div className="h-64 md:h-3/4  shadow overflow-auto">
              <ListOfVersion version={sampleVersions} />
            </div>
            <div className="h-1/4 p-3 space-y-2 overflow-x-auto">
              <span className="font-bold block">
                Checksum: 23972987498399502319092183426593246343432434
              </span>
              <textarea
                className="textarea textarea-success w-full h-full "
                placeholder="Details about operation..."
                readOnly
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default VersionPage;
