import React, { useState } from "react";
import { ToastContainer } from "react-toastify";

const AddPRKComponent: React.FC = () => {
  const [fileContent, setFileContent] = useState<string>("");

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setFileContent(content);
    };
    reader.readAsText(file);
  };

  return (
    <>
      <ToastContainer />
      <div className="rounded-xl shadow bg-base-100 p-6 space-y-6">
        {/* Flex row with title + button */}
        <div className="flex justify-between items-center flex-wrap gap-4">
          <h2 className="text-2xl font-semibold">
            Ajouter une nouvelle clé Privée
          </h2>

          <label className="btn btn-outline btn-primary cursor-pointer">
            📁 Sélectionner une clé privée.
            <input
              type="file"
              accept=".pem,.key,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Display content after file upload */}
        {fileContent && (
          <div className="flex flex-col space-y-2">
            <div className="bg-base-200 p-4 rounded text-sm text-gray-700 whitespace-pre-wrap max-h-64 overflow-auto border">
              {fileContent}
            </div>
            <button className="btn btn-outline btn-secondary">
              Verifier la compatibilite avec la cle publique{" "}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default AddPRKComponent;
