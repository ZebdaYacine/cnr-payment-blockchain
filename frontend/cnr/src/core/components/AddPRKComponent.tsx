import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useKeys } from "../state/KeyContext";

const AddPRKComponent: React.FC = () => {
  const [fileContent, setFileContent] = useState<string>("");
  const [randomNumber, setRandomNumber] = useState<string>("");
  const [signature, setSignature] = useState<string>("");

  const { setPrivateKey } = useKeys();

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setFileContent(content);
      setPrivateKey(content);
      toast.success("Clé privée chargée avec succès");
    };
    reader.readAsText(file);
  };

  const handleVerify = async () => {
    try {
      const random = Math.floor(
        1000000000 + Math.random() * 9000000000
      ).toString();
      setRandomNumber(random);

      const encoder = new TextEncoder();
      const data = encoder.encode(random);

      // SAFER: Clean the PEM properly
      const pemBody = fileContent
        .replace("-----BEGIN PRIVATE KEY-----", "")
        .replace("-----END PRIVATE KEY-----", "")
        .replace(/\r?\n|\r/g, "")
        .trim();

      const binaryDer = Uint8Array.from(atob(pemBody), (c) => c.charCodeAt(0));

      const key = await window.crypto.subtle.importKey(
        "pkcs8",
        binaryDer.buffer,
        {
          name: "RSASSA-PKCS1-v1_5",
          hash: { name: "SHA-256" },
        },
        false,
        ["sign"]
      );

      const signatureBuffer = await window.crypto.subtle.sign(
        "RSASSA-PKCS1-v1_5",
        key,
        data
      );

      const signatureArray = new Uint8Array(signatureBuffer);
      const base64Signature = btoa(String.fromCharCode(...signatureArray));
      setSignature(base64Signature);
    } catch (error) {
      toast.error("Erreur lors de la signature !");
      console.error("Error during signing:", error);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="rounded-xl shadow bg-base-100 p-6 space-y-6">
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

        {fileContent && (
          <div className="flex flex-col space-y-2">
            <div className="divider" />
            <div className="bg-base-200 p-4 rounded text-sm text-gray-700 whitespace-pre-wrap max-h-64 overflow-auto border">
              {fileContent}
            </div>
            <button
              onClick={handleVerify}
              className="btn btn-outline btn-secondary"
            >
              Vérifier la compatibilité avec la clé publique
            </button>

            {randomNumber && (
              <div className="space-y-2 mt-4">
                <p>
                  <strong>Texte aléatoire :</strong> {randomNumber}
                </p>
                <p>
                  <strong>Signature numérique (base64) :</strong>
                </p>
                <div className="bg-base-300 p-3 rounded text-xs whitespace-pre-wrap break-all">
                  {signature}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default AddPRKComponent;
