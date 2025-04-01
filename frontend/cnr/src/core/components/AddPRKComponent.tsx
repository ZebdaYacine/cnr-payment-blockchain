import { useProfileViewModel } from "../../feature/profile/viewmodel/ProfileViewModel";
import { PofileUseCase } from "../../feature/profile/domain/usecase/ProfileUseCase";
import { toast, ToastContainer } from "react-toastify";
import { ProfileRepositoryImpl } from "../../feature/profile/data/repository/ProfileRepositoryImpl";
import { useState } from "react";
import { ProfileDataSourceImpl } from "../../feature/profile/data/dataSource/ProfileAPIDataSource";
import { useKeys } from "../state/KeyContext";

const AddPRKComponent: React.FC = () => {
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [randomNumber, setRandomNumber] = useState<string | null>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const profileUseCase = new PofileUseCase(
    new ProfileRepositoryImpl(new ProfileDataSourceImpl())
  );
  const { verifySignature, isVerifyingSignature } =
    useProfileViewModel(profileUseCase);

  const { setPrivateKey } = useKeys();

  const pemToArrayBuffer = (pem: string): ArrayBuffer => {
    const b64 = pem
      .replace(/-----BEGIN [^-]+-----/, "")
      .replace(/-----END [^-]+-----/, "")
      .replace(/\s/g, "");
    const binary = atob(b64);
    const len = binary.length;
    const buffer = new ArrayBuffer(len);
    const view = new Uint8Array(buffer);
    for (let i = 0; i < len; i++) {
      view[i] = binary.charCodeAt(i);
    }
    return buffer;
  };

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
    if (!fileContent) {
      toast.error("Veuillez d'abord télécharger votre clé privée.");
      return;
    }

    try {
      setIsVerifying(true);

      const keyBuffer = pemToArrayBuffer(fileContent);

      const key = await window.crypto.subtle.importKey(
        "pkcs8",
        keyBuffer,
        {
          name: "ECDSA",
          namedCurve: "P-256",
        },
        false,
        ["sign"]
      );

      const randomValue = Math.floor(Math.random() * 1000000).toString();
      setRandomNumber(randomValue);

      const encoder = new TextEncoder();
      const data = encoder.encode(randomValue);

      const signatureBuffer = await window.crypto.subtle.sign(
        {
          name: "ECDSA",
          hash: "SHA-256",
        },
        key,
        data
      );

      const signatureBase64 = btoa(
        String.fromCharCode(...new Uint8Array(signatureBuffer))
      );
      setSignature(signatureBase64);

      await verifySignature({
        signature: signatureBase64,
        randomValue: randomValue,
      });
    } catch (error) {
      console.error("Error during verification:", error);
      if (error instanceof Error) {
        if (error.message.includes("Unsupported key format")) {
          toast.error(
            "Format de clé non supporté. Veuillez utiliser une clé PKCS8."
          );
        } else if (error.message.includes("Failed to sign")) {
          toast.error(
            "Erreur lors de la signature. Veuillez vérifier votre clé."
          );
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error("Une erreur inconnue s'est produite.");
      }
    } finally {
      setIsVerifying(false);
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
              disabled={isVerifying || isVerifyingSignature}
              className="btn btn-secondary px-4 py-2 rounded "
            >
              {isVerifying || isVerifyingSignature
                ? "Vérification en cours..."
                : "Vérifier"}
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
