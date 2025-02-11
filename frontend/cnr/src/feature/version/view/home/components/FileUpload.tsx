import { useState } from "react";

function FileUpload() {
  const [fileName, setFileName] = useState("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFileName(event.target.files[0].name);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files.length > 0) {
      setFileName(event.dataTransfer.files[0].name);
    }
  };

  return (
    <dialog id="version" className="modal">
      <div className="modal-box p-8 shadow-lg">
        <h3 className="font-bold text-lg">Insert new Version:</h3>
        <div className="flex flex-col items-center justify-center">
          <form className="form-control mt-4 w-full max-w-md text-center">
            <label
              className="mt-5 flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-accent rounded-lg cursor-pointer hover:bg-gray-100"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <p className="mt-2 text-sm text-gray-600">
                  {fileName || "Drag & Drop File or Click to Upload"}
                </p>
              </div>
              <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
            <input
              type="text"
              className="mt-3 input input-bordered w-full"
              value={fileName}
              placeholder="Selected file name..."
              readOnly
            />
            <textarea
              className="mt-5 textarea textarea-bordered"
              placeholder="Description of transactions..."
            />
            <div className="mt-5 flex justify-center">
              <button className="btn btn-secondary flex items-center"></button>
            </div>
          </form>
        </div>
      </div>
    </dialog>
  );
}

export default FileUpload;
