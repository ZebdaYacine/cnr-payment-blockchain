import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import EmailInput from "../../../../core/components/EmailInput";
// import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingBar, { LoadingBarRef } from "react-top-loading-bar";
import { useRef } from "react";
import { motion } from "framer-motion";
import { FaArrowLeft, FaPaperPlane, FaLock } from "react-icons/fa";
import { useAuthViewModel } from "../../viewmodel/AuthViewModel";
import { AuthUseCase } from "../../domain/UseCases/AuthUseCase";
import { AuthRepositoryImpl } from "../../data/repository/AuthRepositoryImpl";
import { AuthDataSourceImpl } from "../../data/dataSource/AuthAPIDataSource";

export const ForgetPwdPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const ref = useRef<LoadingBarRef>(null);

  const UseCase = useMemo(() => {
    return new AuthUseCase(new AuthRepositoryImpl(new AuthDataSourceImpl()));
  }, []);

  const { forgetPassword } = useAuthViewModel(UseCase);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;

    ref.current?.continuousStart();
    forgetPassword.mutate({ email });
  };

  React.useEffect(() => {
    if (forgetPassword.isPending) {
      ref.current?.continuousStart();
    } else {
      ref.current?.complete();
    }

    // if (forgetPassword.isSuccess) {
    //   setTimeout(() => {
    //     navigate("/");
    //   }, 3000);
    // }
  }, [forgetPassword.isPending, forgetPassword.isSuccess]);

  return (
    <>
      <LoadingBar color="#f11946" ref={ref} shadow={true} />
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
        <div className="container mx-auto px-4 h-screen flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <form
                className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-white/20"
                onSubmit={handleSubmit}
                autoComplete="on"
              >
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <motion.div
                      initial={{ rotate: -10, scale: 0.8 }}
                      animate={{ rotate: 0, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="text-6xl mb-4 text-indigo-600"
                    >
                      <FaLock className="mx-auto" />
                    </motion.div>
                    <motion.h2
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-3xl font-bold text-gray-800 mb-2"
                    >
                      Mot de passe oublié?
                    </motion.h2>
                    <motion.p
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="text-gray-600 text-sm mb-6"
                    >
                      Entrez votre adresse e-mail et nous vous enverrons les
                      instructions pour réinitialiser votre mot de passe.
                    </motion.p>
                  </div>

                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <EmailInput
                      value={email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setEmail(e.target.value)
                      }
                      validate={isSubmitted}
                    />
                  </motion.div>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="flex flex-col space-y-4"
                  >
                    <button
                      type="submit"
                      disabled={forgetPassword.isPending}
                      className="btn btn-primary w-full flex items-center justify-center space-x-2 hover:scale-105 transition-all duration-200 h-12 text-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaPaperPlane className="w-5 h-5" />
                      <span>
                        {forgetPassword.isPending
                          ? "Envoi en cours..."
                          : "Envoyer les instructions"}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate("/")}
                      className="btn btn-ghost w-full flex items-center justify-center space-x-2 text-gray-600 hover:text-gray-800 transition-all duration-200 hover:bg-gray-100 rounded-lg"
                    >
                      <FaArrowLeft className="w-4 h-4" />
                      <span>Retour à la connexion</span>
                    </button>
                  </motion.div>
                </motion.div>
              </form>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
};
