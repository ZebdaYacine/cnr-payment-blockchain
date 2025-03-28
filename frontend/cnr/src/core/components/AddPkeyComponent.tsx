import React, { useEffect, useState } from "react";
import { PofileUseCase } from "../../feature/profile/domain/usecase/ProfileUseCase";
import { ProfileRepositoryImpl } from "../../feature/profile/data/repository/ProfileRepositoryImpl";
import { ProfileDataSourceImpl } from "../../feature/profile/data/dataSource/ProfileAPIDataSource";
import { useProfileViewModel } from "../../feature/profile/viewmodel/ProfileViewModel";
import { useNotification } from "../../services/useNotification";

const AjouterCleSSHForm: React.FC = () => {
  const [cle, setCle] = useState("");
  const { success, error } = useNotification();
  const profileUseCase = new PofileUseCase(
    new ProfileRepositoryImpl(new ProfileDataSourceImpl())
  );
  const { addPk, isPKSuccess, isPKError } = useProfileViewModel(profileUseCase);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cle.trim()) return;
    addPk({ pk: cle.trim() });
  };

  useEffect(() => {
    if (isPKSuccess) {
      alert("✅ Clé ajoutée avec succès !");
      setCle(""); // Reset le champ après ajout
    }
    if (isPKError) {
      alert("✅ Clé ss avec succès !");

      error("❌ Échec de l'ajout de la clé.", "colored");
    }
  }, [isPKSuccess, isPKError]);

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-base-100 p-6 rounded-xl shadow space-y-4"
    >
      <h2 className="text-2xl font-semibold mb-4">
        Ajouter une nouvelle clé Public
      </h2>

      <div className="form-control">
        <textarea
          className="textarea textarea-bordered min-h-[140px]"
          placeholder={`Commence par 'ssh-rsa', 'ecdsa-sha2-nistp256', 'ecdsa-sha2-nistp384', 'ecdsa-sha2-nistp521', 'ssh-ed25519', 'sk-ecdsa-sha2-nistp256@openssh.com', ou 'sk-ssh-ed25519@openssh.com'`}
          value={cle}
          onChange={(e) => setCle(e.target.value)}
        />
      </div>

      <div className="form-control">
        <button type="submit" className="btn btn-success w-fit">
          Ajouter la clé Public
        </button>
      </div>
    </form>
  );
};

export default AjouterCleSSHForm;
