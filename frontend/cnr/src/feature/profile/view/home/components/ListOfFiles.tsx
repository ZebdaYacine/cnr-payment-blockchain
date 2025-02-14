import { useNavigate } from "react-router";
import { Data } from "../../../data/dtos/ProfileDtos";

interface ListOfFilesProps {
  files: Data[];
}

function ListOfFiles({ files }: ListOfFilesProps) {
  const navigate = useNavigate();
  const handleRowClick = (file: Data) => {
    console.log("File clicked:", file);
    navigate("/versions-file");
  };
  return (
    <>
      <div className="mt-4 w-full">
        <div className="card bg-base-300 shadow-xl w-full">
          <div className="card-body">
            <h2 className="card-title text-center">List of Uploaded Files</h2>
            <div className="overflow-x-auto">
              <table className="table table-auto">
                <thead>
                  <tr>
                    <th className="text-center">ID</th>
                    <th className="text-center">File</th>
                    <th className="text-center">User</th>
                    <th className="text-center">Time</th>
                    <th className="text-center">Status</th>
                    <th className="text-center">Version</th>
                  </tr>
                </thead>
                <tbody>
                  {files.map((file) => (
                    <tr
                      key={file.ID}
                      className="cursor-pointer hover"
                      onClick={() => handleRowClick(file)}
                    >
                      <td className="text-center ">{file.ID}</td>
                      <td className="text-center">{file.FileName}</td>
                      <td className="text-center">{file.UserID}</td>
                      <td className="text-center">{file.Time}</td>
                      <td className="text-center">
                        <div
                          className={`badge ${
                            file.Status === "Valid"
                              ? "badge-accent"
                              : "badge-secondary"
                          }`}
                        >
                          {file.Status}
                        </div>
                      </td>
                      <td className="text-center">
                        <div
                          className={`badge ${
                            file.Version > 1
                              ? "badge-secondary"
                              : "badge-accent"
                          }`}
                        >
                          {file.Version} version
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ListOfFiles;
