import React, { useState } from "react";
import avatar from "../../assets/avatar.svg";
const UpdateProfileForm: React.FC = () => {
  const [firstName, setFirstName] = useState("Ali");
  const [lastName, setLastName] = useState("Benzema");
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePic(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Submit logic here
    console.log({ firstName, lastName, profilePic });
  };

  return (
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

      {/* First Name */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold">🧍‍♂️ Prénom</span>
        </label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Votre prénom"
          className="input input-bordered w-full"
        />
      </div>

      {/* Last Name */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold">👤 Nom</span>
        </label>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Votre nom"
          className="input input-bordered w-full"
        />
      </div>

      <div className="form-control mt-4">
        <button type="submit" className="btn btn-primary w-full">
          💾 Enregistrer les modifications
        </button>
      </div>
    </form>
  );
};

export default UpdateProfileForm;
