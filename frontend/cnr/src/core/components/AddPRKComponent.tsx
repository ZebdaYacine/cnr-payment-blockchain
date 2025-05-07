import { useState, useEffect } from "react";
import { useProfileViewModel } from "../../feature/profile/viewmodel/ProfileViewModel";
import { PofileUseCase } from "../../feature/profile/domain/usecase/ProfileUseCase";
import { ProfileRepositoryImpl } from "../../feature/profile/data/repository/ProfileRepositoryImpl";
import { ProfileDataSourceImpl } from "../../feature/profile/data/dataSource/ProfileAPIDataSource";
import { useKeys } from "../state/KeyContext";
import { useSignatureVerifier } from "../../services/digitalSignutre";
import { useNotification } from "../../services/useNotification";
import { useUser } from "../state/UserContext";

const AddPRKComponent: React.FC = () => {
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const { setPrivateKey } = useKeys();
  const { error } = useNotification();
  const { userSaved } = useUser();

  const profileUseCase = new PofileUseCase(
    new ProfileRepositoryImpl(new ProfileDataSourceImpl())
  );
  const { isVerifyingSignature } = useProfileViewModel(profileUseCase);
  const { verify } = useSignatureVerifier();

  useEffect(() => {
    if (!userSaved.publicKey) {
      error(
        "Vous devez d'abord générer une clé publique avant d'ajouter une clé privée.",
        "colored"
      );
    }
  }, [userSaved.publicKey]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!userSaved.publicKey) {
      error(
        "Vous devez d'abord générer une clé publique avant d'ajouter une clé privée.",
        "colored"
      );
      return;
    }

    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setFileContent(content);
      setPrivateKey(content);
    };
    reader.readAsText(file);
  };

  const handleVerify = async () => {
    if (!userSaved.publicKey) {
      error(
        "Vous devez d'abord générer une clé publique avant d'ajouter une clé privée.",
        "colored"
      );
      return;
    }

    if (!fileContent) {
      error("Veuillez d'abord télécharger votre clé privée.", "colored");
      return;
    }

    try {
      setIsVerifying(true);
      await verify(fileContent);
    } catch (err) {
      console.log(err);
      error("Erreur lors de la vérification", "colored");
      setIsVerifying(false);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <>
      <div className="rounded-xl shadow bg-base-100 p-6 space-y-6">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <h2 className="text-2xl font-semibold">
            Ajouter une nouvelle clé Privée
          </h2>
          <label className="btn btn-outline btn-primary cursor-pointer">
            📁 Sélectionner une clé privée
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
              // disabled={isVerifying || isVerifyingSignature}
              className="btn btn-secondary px-4 py-2 rounded"
            >
              {isVerifying || isVerifyingSignature
                ? "Vérification en cours..."
                : "Vérifier"}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default AddPRKComponent;
