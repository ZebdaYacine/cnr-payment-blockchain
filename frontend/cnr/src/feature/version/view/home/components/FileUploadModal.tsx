import { useState } from "react";
import { BsXLg } from "react-icons/bs";
function FileUploadModal() {
  const [fileName, setFileName] = useState("");
  const [commitSize, setCommitSize] = useState(100);
  const [commitText, setCommitText] = useState("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      //setFileName(event.target.files[0].name);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files.length > 0) {
      setFileName(event.dataTransfer.files[0].name);
    }
  };

  const handleCommitSizeChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const newText = event.target.value;
    const size = newText.length;
    if (size <= 100) {
      setCommitText(newText);
      setCommitSize(100 - size);
    } else {
      const limitedText = newText.slice(0, 100);
      console.log(limitedText);
      setCommitText(limitedText);
      setCommitSize(0);
    }
  };

  const close = () => {
    const modal = document.getElementById("version") as HTMLDialogElement;
    if (modal) {
      modal.close();
    }
  };

  return (
    <dialog id="version" className="modal">
      <div className="modal-box p-8 shadow-lg">
        <div className="flex flex-row justify-between">
          <h3 className="font-bold text-lg">Insert new Version:</h3>
          <BsXLg className="cursor-pointer" onClick={close} />
        </div>
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
              placeholder="Commit transactions..."
            />

            <div className="flex flex-col mt-3">
              <textarea
                className="textarea textarea-bordered"
                placeholder="Details about transactions..."
                onChange={handleCommitSizeChange}
                value={commitText}
              />
              <div className="mt-2 flex flex-row-reverse">
                <div
                  className={`badge badge-lg ${
                    commitText.length == 100
                      ? "badge-secondary"
                      : "badge-accent"
                  }`}
                >
                  {commitSize}
                </div>
              </div>
            </div>

            <div className="mt-5 flex justify-center">
              <button
                className="btn btn-accent flex items-center"
                disabled={commitText.length === 0}
              >
                Add Version
              </button>
            </div>
          </form>
        </div>
      </div>
    </dialog>
  );
}

export default FileUploadModal;
