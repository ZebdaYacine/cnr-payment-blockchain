import { useNavigate } from "react-router-dom";
import AvatarCnr from "../../login/components/AvatarCnr";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import EmailInput from "../../../../../core/components/EmailInput";
import PasswordInput from "../../../../../core/components/PassWordInput";
import { AuthDataSourceImpl } from "../../../data/dataSource/AuthAPIDataSource";
import { AuthRepositoryImpl } from "../../../data/repository/AuthRepositoryImpl";
import { AuthUseCase } from "../../../domain/UseCases/AuthUseCase";
import { useAuthViewModel } from "../../../viewmodel/AuthViewModel";
import "react-toastify/dist/ReactToastify.css";
import LoadingBar, { LoadingBarRef } from "react-top-loading-bar";
import { useAuth } from "../../../../../core/state/AuthContext";
import { useUser } from "../../../../../core/state/UserContext";

const allWilayas = [
  "Adrar",
  "Chlef",
  "Laghouat",
  "Oum El Bouaghi",
  "Batna",
  "Béjaïa",
  "Biskra",
  "Béchar",
  "Blida",
  "Bouira",
  "Tamanrasset",
  "Tébessa",
  "Tlemcen",
  "Tiaret",
  "Tizi Ouzou",
  "Algiers",
  "Djelfa",
  "Jijel",
  "Sétif",
  "Saïda",
  "Skikda",
  "Sidi Bel Abbès",
  "Annaba",
  "Guelma",
  "Constantine",
  "Médéa",
  "Mostaganem",
  "M'Sila",
  "Mascara",
  "Ouargla",
  "Oran",
  "El Bayadh",
  "Illizi",
  "Bordj Bou Arreridj",
  "Boumerdès",
  "El Tarf",
  "Tindouf",
  "Tissemsilt",
  "El Oued",
  "Khenchela",
  "Souk Ahras",
  "Tipaza",
  "Mila",
  "Aïn Defla",
  "Naâma",
  "Aïn Témouchent",
  "Ghardaïa",
  "Relizane",
  "Timimoun",
  "Bordj Badji Mokhtar",
  "Ouled Djellal",
  "Béni Abbès",
  "In Salah",
  "In Guezzam",
  "Touggourt",
  "Djanet",
  "El M'Ghair",
  "El Meniaa",
];

const ccrWilayas = [
  "Tipaza",
  "Ghardaïa",
  "Oran",
  "Constantine",
  "Algiers",
  "Blida",
  "Tizi Ouzou",
  "Annaba",
  "Batna",
  "Sétif",
];

const institutionTypes = [
  { value: "ccr", label: "CCR" },
  { value: "dio", label: "DIO" },
  { value: "dof", label: "DOF" },
  { value: "post", label: "Poste" },
  { value: "agence", label: "Agence" },
];

function RegisterPage() {
  const navigate = useNavigate();
  const { isAuthentificated } = useAuth();

  const UseCase = useMemo(() => {
    return new AuthUseCase(new AuthRepositoryImpl(new AuthDataSourceImpl()));
  }, []);

  const { register, isPending, isSuccess, isError } = useAuthViewModel(UseCase);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [institutionType, setInstitutionType] = useState<string>("");
  const [institutionLocation, setInstitutionLocation] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [passwordError, setPasswordError] = useState<string>("");
  const ref = useRef<LoadingBarRef>(null);
  const [fname, setFname] = useState<string>("");
  const [lname, setLname] = useState<string>("");
  const { userSaved } = useUser();

  useEffect(() => {
    if (isPending) {
      ref.current?.continuousStart();
    } else {
      ref.current?.complete();
    }

    if (isSuccess && isAuthentificated) {
      if (userSaved.status) {
        navigate("/home/welcome");
      } else {
        navigate("/account-activation");
      }
    }
  }, [isPending, isSuccess, isError, isAuthentificated]);

  const validatePasswords = () => {
    if (password !== confirmPassword) {
      setPasswordError("Les mots de passe ne correspondent pas");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const getLocationOptions = () => {
    if (!institutionType) return [];

    switch (institutionType) {
      case "ccr":
        return ccrWilayas;
      case "agence":
        return allWilayas;
      default:
        return [];
    }
  };

  const registerEvent = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitted(true);

    if (!fname.trim()) return;
    if (!lname.trim()) return;
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    if (!password.trim()) return;
    if (!validatePasswords()) return;
    if (!institutionType) return;
    if (
      (institutionType === "ccr" || institutionType === "agence") &&
      !institutionLocation
    )
      return;

    register.mutate({
      fname,
      lname,
      email,
      password,
      org: institutionType,
      wilaya: institutionLocation,
    });
  };

  return (
    <>
      <LoadingBar color="#3b82f6" ref={ref} shadow={true} />
      <div className="flex flex-col items-center bg-gray-50 justify-center min-h-screen p-4 sm:p-6 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="md-w-full mx-auto"
        >
          <motion.form
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6 p-8 bg-white rounded-xl shadow-md w-full"
            onSubmit={registerEvent}
            autoComplete="on"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex justify-center mb-8"
            >
              <AvatarCnr />
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="w-full flex flex-row sm:flex-row gap-2"
            >
              <input
                type="text"
                value={fname}
                onChange={(e) => setFname(e.target.value)}
                placeholder="Prénom"
                className="input input-bordered w-full sm:w-1/2"
                autoComplete="given-name"
              />
              <input
                type="text"
                value={lname}
                onChange={(e) => setLname(e.target.value)}
                placeholder="Nom"
                className="input input-bordered w-full sm:w-1/2"
                autoComplete="family-name"
              />
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="w-full"
            >
              <EmailInput
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                validate={isSubmitted}
              />
            </motion.div>

            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="w-full"
            >
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                validate={isSubmitted}
                label="Mot de passe"
                placeholder="Entrez votre mot de passe"
                showForgotPassword={false}
              />
            </motion.div>

            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="w-full"
            >
              <PasswordInput
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                validate={isSubmitted}
                label="Confirmation du mot de passe"
                placeholder="Confirmez votre mot de passe"
                showForgotPassword={false}
              />
              {passwordError && (
                <span className="text-error text-sm mt-1">{passwordError}</span>
              )}
            </motion.div>

            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="w-full space-y-4"
            >
              <div className="form-control w-full">
                <select
                  className="select select-bordered w-full"
                  value={institutionType}
                  onChange={(e) => {
                    setInstitutionType(e.target.value);
                    setInstitutionLocation("");
                  }}
                >
                  <option value="">Sélectionner une institution</option>
                  {institutionTypes.map((inst) => (
                    <option key={inst.value} value={inst.value}>
                      {inst.label}
                    </option>
                  ))}
                </select>
              </div>

              {(institutionType === "ccr" || institutionType === "agence") && (
                <div className="form-control w-full">
                  <select
                    className="select select-bordered w-full"
                    value={institutionLocation}
                    onChange={(e) => setInstitutionLocation(e.target.value)}
                  >
                    <option value="">Sélectionner une wilaya</option>
                    {getLocationOptions().map((wilaya) => (
                      <option key={wilaya} value={wilaya}>
                        {wilaya}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col items-center space-y-4"
            >
              <button
                type="submit"
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Créer un compte
              </button>
              <p className="text-gray-600 text-sm">
                Déjà un compte ?{" "}
                <span
                  onClick={() => navigate("/")}
                  className="text-blue-600 hover:text-blue-700 cursor-pointer"
                >
                  Se connecter
                </span>
              </p>
            </motion.div>
          </motion.form>
        </motion.div>
      </div>
    </>
  );
}

export default RegisterPage;
