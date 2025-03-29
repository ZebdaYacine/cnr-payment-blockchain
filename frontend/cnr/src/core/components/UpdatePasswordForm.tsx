import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { PofileUseCase } from "../../feature/profile/domain/usecase/ProfileUseCase";
import { ProfileDataSourceImpl } from "../../feature/profile/data/dataSource/ProfileAPIDataSource";
import { ProfileRepositoryImpl } from "../../feature/profile/data/repository/ProfileRepositoryImpl";
import { useProfileViewModel } from "../../feature/profile/viewmodel/ProfileViewModel";
import { ToastContainer } from "react-toastify";

const UpdatePasswordForm: React.FC = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [confirmOldPassword, setConfirmOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [showOld, setShowOld] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const profileUseCase = new PofileUseCase(
    new ProfileRepositoryImpl(new ProfileDataSourceImpl())
  );
  const { updatePassword, isUpdatingPassword } =
    useProfileViewModel(profileUseCase);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};

    if (!oldPassword) newErrors.old = "Veuillez entrer l'ancien mot de passe.";
    if (!confirmOldPassword)
      newErrors.confirm = "Veuillez confirmer l'ancien mot de passe.";
    if (oldPassword !== confirmOldPassword)
      newErrors.confirm = "Les mots de passe ne correspondent pas.";
    if (!newPassword || newPassword.length < 6)
      newErrors.new =
        "Le nouveau mot de passe doit contenir au moins 6 caractères.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      updatePassword({
        oldPassword,
        newPassword,
      });
    }
  };

  const getPasswordFeedback = (password: string): string[] => {
    const feedback: string[] = [];

    if (!/[A-Z]/.test(password)) feedback.push("Une majuscule est requise");
    if (!/[a-z]/.test(password)) feedback.push("Une minuscule est requise");
    if (!/[0-9]/.test(password)) feedback.push("Un chiffre est requis");
    if (!/[^A-Za-z0-9]/.test(password))
      feedback.push("Un caractère spécial est requis");
    if (password.length < 6) feedback.push("Au moins 6 caractères sont requis");

    return feedback;
  };

  return (
    <>
      {" "}
      <ToastContainer />{" "}
      <form
        onSubmit={handleSubmit}
        className="bg-base-100 shadow-xl p-6 rounded-xl space-y-6 "
      >
        <h2 className="text-2xl font-bold text-center">
          🔐 Mise à jour du mot de passe
        </h2>

        {/* Old Password */}
        <div className="form-control">
          <label className="label font-semibold">🔑 Ancien mot de passe</label>
          <div className="relative">
            <input
              type={showOld ? "text" : "password"}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Ancien mot de passe"
              className="input input-bordered w-full pr-10"
            />
            <span
              onClick={() => setShowOld(!showOld)}
              className="absolute right-3 top-3 cursor-pointer text-gray-500"
            >
              {showOld ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {errors.old && (
            <p className="text-sm text-red-500 mt-1">{errors.old}</p>
          )}
        </div>

        {/* Confirm Old Password */}
        <div className="form-control">
          <label className="label font-semibold">✅ Confirmer</label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              value={confirmOldPassword}
              onChange={(e) => setConfirmOldPassword(e.target.value)}
              placeholder="Confirmez le mot de passe"
              className="input input-bordered w-full pr-10"
            />
            <span
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-3 cursor-pointer text-gray-500"
            >
              {showConfirm ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {errors.confirm && (
            <p className="text-sm text-red-500 mt-1">{errors.confirm}</p>
          )}
        </div>

        {/* New Password */}
        <div className="form-control">
          <label className="label font-semibold">🆕 Nouveau mot de passe</label>
          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Nouveau mot de passe"
              className="input input-bordered w-full pr-10"
            />
            <span
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-3 cursor-pointer text-gray-500"
            >
              {showNew ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {errors.new && (
            <p className="text-sm text-red-500 mt-1">{errors.new}</p>
          )}

          {/* Password strength meter */}
          {/* Password requirements */}
          {newPassword && (
            <div className="mt-2">
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
                {getPasswordFeedback(newPassword).length > 0
                  ? "Le mot de passe doit contenir:"
                  : "Mot de pass acceptee"}
                :
              </p>
              <ul className="text-sm text-red-500 list-disc list-inside space-y-1">
                {getPasswordFeedback(newPassword).map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full mt-2"
          disabled={isUpdatingPassword}
        >
          {isUpdatingPassword
            ? "💾 Mise à jour en cours..."
            : "💾 Enregistrer le mot de passe"}
        </button>
      </form>
    </>
  );
};

export default UpdatePasswordForm;
