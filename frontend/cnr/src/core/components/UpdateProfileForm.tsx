import React, { useEffect, useState } from "react";
import avatar from "../../assets/avatar.svg";
import { useUser } from "../state/UserContext";
import { PofileUseCase } from "../../feature/profile/domain/usecase/ProfileUseCase";
import { ProfileDataSourceImpl } from "../../feature/profile/data/dataSource/ProfileAPIDataSource";
import { ProfileRepositoryImpl } from "../../feature/profile/data/repository/ProfileRepositoryImpl";
import { useProfileViewModel } from "../../feature/profile/viewmodel/ProfileViewModel";
import { ToastContainer } from "react-toastify";
const UpdateProfileForm: React.FC = () => {
  const { userSaved } = useUser();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);

  const profileUseCase = new PofileUseCase(
    new ProfileRepositoryImpl(new ProfileDataSourceImpl())
  );
  const { updateFirstLastName, isUpdatingName } =
    useProfileViewModel(profileUseCase);
  // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     setProfilePic(file);
  //     setPreview(URL.createObjectURL(file));
  //   }
  // };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePic(file);
      setPreview(URL.createObjectURL(file));
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setBase64Image(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ firstName, lastName, profilePic });
    updateFirstLastName({ 
      firstName: firstName, 
      lastName: lastName , 
      avatar: base64Image || undefined,
});
  };

  useEffect(() => {
    if (userSaved) {
      setFirstName(userSaved.first_name || "");
      setLastName(userSaved.last_name || "");
    }
  }, [userSaved]);

  return (
    <>
      <ToastContainer />{" "}
      <form
        className=" bg-base-100 shadow-xl p-6 rounded-xl space-y-6"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold text-center">
          📝 Mise à jour du profil
        </h2>
        <div className="flex justify-center">
          <label className="cursor-pointer avatar relative group">
            <div className="w-36 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden">
              <img
                src={preview || avatar}
                alt="Avatar Preview"
                className="object-cover w-full h-full"
              />
              <div className="rounded-full absolute inset-0 bg-black bg-opacity-50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                📷 Modifier
              </div>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">🧍‍♂️ Prénom</span>
          </label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Votre prénom"
            className="input input-bordered w-full text-lg font-semibold text-gray-700"
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">👤 Nom</span>
          </label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Votre nom"
            className="input input-bordered w-full text-lg font-semibold text-gray-700"
          />
        </div>
        <div className="form-control mt-4">
          <button type="submit" className="btn btn-primary w-full">
            {isUpdatingName
              ? " 💾 En cours ..."
              : " 💾 Enregistrer les modifications"}
          </button>
        </div>
      </form>
    </>
  );
};

export default UpdateProfileForm;
