import { useNavigate } from "react-router-dom";
import AvatarCnr from "../components/AvatarCnr";
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

function LoginPage() {
  const navigate = useNavigate();
  const { isAuthentificated } = useAuth();

  const UseCase = useMemo(() => {
    return new AuthUseCase(new AuthRepositoryImpl(new AuthDataSourceImpl()));
  }, []);

  const { login, isPending, isSuccess, isError } = useAuthViewModel(UseCase);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const ref = useRef<LoadingBarRef>(null);

  useEffect(() => {
    if (isPending) {
      ref.current?.continuousStart();
    } else {
      ref.current?.complete();
    }

    if (isSuccess && isAuthentificated) {
      navigate("/home/welcome");
    }
  }, [isPending, isSuccess, isError, isAuthentificated]);

  const loginEvent = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitted(true);

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    if (!password.trim()) return;

    login.mutate({ username: email, password });
  };

  return (
    <>
      <LoadingBar color="#3b82f6" ref={ref} shadow={true} />
      <div className="flex flex-col items-center bg-gray-50 justify-center min-h-screen p-4 sm:p-6 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="md-w-full  mx-auto"
        >
          <motion.form
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6 p-8 bg-white rounded-xl shadow-md w-full"
            onSubmit={loginEvent}
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
                showForgotPassword={true}
              />
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
                Se connecter
              </button>
              <p className="text-gray-600 text-sm">
                J'ai pas un compte ?{" "}
                <span
                  onClick={() => navigate("/register")}
                  className="text-blue-600 hover:text-blue-700 cursor-pointer"
                >
                  Créer un compte
                </span>
              </p>
            </motion.div>
          </motion.form>
        </motion.div>
      </div>
    </>
  );
}

export default LoginPage;
