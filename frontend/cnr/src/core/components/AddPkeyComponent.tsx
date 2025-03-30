import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router";
import { useKeys } from "../state/PublicKeyContext";
import { useTimer } from "../state/TimerContext";

const AjouterCleSSHForm: React.FC = () => {
  const [cle, setCle] = useState("");
  const navigate = useNavigate();
  const { setPublicKey } = useKeys();
  const { resetTimer } = useTimer();

  const AddKey = () => {
    if (!cle.trim()) return;
    resetTimer();
    setPublicKey(cle);
    navigate("check-otp");
  };

  return (
    <>
      <ToastContainer />
      <div className="flex flex-col space-y-2 rounded-xl shadow">
        <div className="bg-base-100 p-6 space-y-4">
          <h2 className="text-2xl font-semibold mb-4">
            Ajouter une nouvelle clé Public
          </h2>

          <div className="form-control">
            <textarea
              className="textarea textarea-bordered min-h-[140px]"
              placeholder="Entrez votre clé publique..."
              value={cle}
              onChange={(e) => setCle(e.target.value)}
            />
          </div>

          <div className="form-control">
            <button className="btn btn-success w-fit" onClick={AddKey}>
              Ajouter la clé Public
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AjouterCleSSHForm;
