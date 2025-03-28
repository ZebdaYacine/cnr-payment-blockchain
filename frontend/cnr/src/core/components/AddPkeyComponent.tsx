import React, { useState } from "react";

const AjouterCleSSHForm: React.FC = () => {
  const [cle, setCle] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ici tu peux envoyer les données à ton backend
  };

  return (
    <form
      onSubmit={handleSubmit}
      className=" bg-base-100 p-6 rounded-xl shadow space-y-4"
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
        ></textarea>
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
