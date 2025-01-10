import { useState } from "react";
import { useThme } from "../../../../../core/state/ThemeContext";
import { FaUpload } from "react-icons/fa"; // Import the upload icon

function UploadFileComponet() {
  const { isDarkMode } = useThme(); // Use context to get and toggle dark mode
  const [file, setFileName] = useState(""); // Declare a state variable

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]; // Access the first file
    if (selectedFile) {
      setFileName(selectedFile.name); // Update the state with the file name
    } else {
      setFileName("No file selected");
    }
  };

  return (
    <>
      <div
        className={
          isDarkMode
            ? "card w-96 shadow-xl text-white"
            : "card bg-base-300 w-96 shadow-xl"
        }
      >
        <div className="card-body items-center text-center">
          <h2 className="card-title">
            <div
              className={
                file === "" ? "badge badge-warning" : "badge badge-primary"
              }
            >
              {file === "" ? "No File Selected..." : file}
            </div>
          </h2>
          <div className="card-actions flex flex-col items-center gap-4">
            <label className="btn btn-primary flex items-center gap-2 cursor-pointer">
              <FaUpload />
              Upload File
              <input
                type="file"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>
    </>
  );
}

export default UploadFileComponet;
