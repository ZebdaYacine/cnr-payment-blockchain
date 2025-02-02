import { Data } from "../../../data/dtos/ProfileDtos";

interface ListOfFilesProps {
  files: Data[];
}

function handleRowClick(file: Data) {
  console.log("File clicked:", file);
  // You can navigate, open a modal, or perform other actions here
}

function ListOfFiles({ files }: ListOfFilesProps) {
  return (
    <div className="card bg-base-300 w-3/4 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-center">List of Uploaded Files</h2>
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[600px] border border-gray-400 border-separate">
            {/* Table Head */}
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="p-3 border border-gray-500">ID</th>
                <th className="p-3 border border-gray-500">File</th>
                <th className="p-3 border border-gray-500">User</th>
                <th className="p-3 border border-gray-500">Time</th>
                <th className="p-3 border border-gray-500">Version</th>
              </tr>
            </thead>
            {/* Table Body */}
            <tbody className="text-gray-700 text-sm">
              {files.map((file) => (
                <tr
                  key={file.ID}
                  className="cursor-pointer hover:bg-gray-200 transition duration-200" // Added hover effect
                  onClick={() => handleRowClick(file)}
                >
                  <td className="p-3 border border-gray-500 text-center">
                    {file.ID}
                  </td>
                  <td className="p-3 border border-gray-500 whitespace-nowrap text-center">
                    {file.FileName}
                  </td>
                  <td className="p-3 border border-gray-500 whitespace-nowrap text-center">
                    {file.UserID}
                  </td>
                  <td className="p-3 border border-gray-500 text-center">
                    {file.Time}
                  </td>
                  <td className="p-3 border border-gray-500 text-center">
                    <div
                      className={`badge ${
                        file.Version > 1 ? "badge-secondary" : "badge-accent"
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
  );
}

export default ListOfFiles;
