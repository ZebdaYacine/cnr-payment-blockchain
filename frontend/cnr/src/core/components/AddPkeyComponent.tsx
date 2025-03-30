/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router";
import { useKeys } from "../state/PublicKeyContext";
import { useTimer } from "../state/TimerContext";
import { PofileUseCase } from "../../feature/profile/domain/usecase/ProfileUseCase";
import { ProfileDataSourceImpl } from "../../feature/profile/data/dataSource/ProfileAPIDataSource";
import { ProfileRepositoryImpl } from "../../feature/profile/data/repository/ProfileRepositoryImpl";
import { useProfileViewModel } from "../../feature/profile/viewmodel/ProfileViewModel";

const AddPKComponent: React.FC = () => {
  const [cle, setCle] = useState("");
  const navigate = useNavigate();
  const { setPublicKey } = useKeys();
  const { resetTimer } = useTimer();
  const profileUseCase = new PofileUseCase(
    new ProfileRepositoryImpl(new ProfileDataSourceImpl())
  );
  const { addPk, isPKSuccess, isPKError, isPKLoading } =
    useProfileViewModel(profileUseCase);

  const AddKey = () => {
    if (!cle.trim()) return;
    resetTimer();
    addPk({ pk: cle });
  };

  useEffect(() => {
    if (isPKSuccess) {
      navigate("/home/PK-manager/add-private-key");
      setPublicKey(cle);
    }
  }, [isPKSuccess]);

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
              className="textarea textarea-bordered min-h-[140px] "
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

export default AddPKComponent;
